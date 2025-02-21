const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { createProxyMiddleware } = require('http-proxy-middleware');
const jwtVerify = require('./src/middlewares/jwtVerify');
const { connectDB } = require('./src/utils/db');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const config = require('./src/config/config');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const Redis = require('ioredis');

// Redis for session sharing between instances
const redis = new Redis(config.redis.url);

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
        // Replace the dead worker
        cluster.fork();
    });
} else {
    const app = express();

    // Basic security middleware
    app.use(helmet());
    app.use(cors());
    app.use(bodyParser.json());

    // Rate limiting with Redis
    const limiter = rateLimit({
        store: new require('rate-limit-redis')({
            client: redis,
            prefix: 'rate-limit:'
        }),
        windowMs: 15 * 60 * 1000,
        max: 100
    });
    app.use(limiter);

    // Initialize database
    (async () => {
        try {
            await connectDB();
        } catch (error) {
            console.error('Failed to connect to database:', error);
            process.exit(1);
        }
    })();

    const authRoutes = require('./src/routes/auth');
    const apiRoutes = require('./src/routes/api');

    app.use('/auth', authRoutes);
    app.use('/api', apiRoutes);

    // Error handling middleware
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).send('Something broke!');
    });

    // Proxy middleware configuration
    const proxyConfig = {
        target: config.targetUrl,
        changeOrigin: true,
        pathRewrite: {
            '^/proxy': '',
        },
        ws: true,
        secure: config.environment === 'production',
        onError: (err, req, res) => {
            console.error('Proxy Error:', err);
            res.status(500).send('Proxy Error');
        },
        onProxyReq: (proxyReq, req, res) => {
            proxyReq.setHeader('X-Proxy-Time', Date.now());
            proxyReq.setHeader('X-Worker-Pid', process.pid);
            if (req.ip) {
                proxyReq.setHeader('X-Forwarded-For', req.ip);
            }
            if (req.headers.authorization) {
                proxyReq.setHeader('Authorization', req.headers.authorization);
            }
        }
    };

    // Health check endpoint
    app.get('/health', (req, res) => {
        res.status(200).json({ 
            status: 'OK', 
            timestamp: new Date(),
            pid: process.pid 
        });
    });

    app.use('/proxy', jwtVerify, createProxyMiddleware(proxyConfig));

    // Handle 404
    app.use((req, res) => {
        res.status(404).send('Not Found');
    });

    // Start server on different ports for each worker
    const PORT = config.port + cluster.worker.id - 1; // 3001, 3002, 3003, etc.
    const server = app.listen(PORT, () => {
        console.log(`Worker ${process.pid} started on port ${PORT}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
        console.log('SIGTERM signal received: closing HTTP server');
        server.close(() => {
            console.log('HTTP server closed');
            process.exit(0);
        });
    });
} 