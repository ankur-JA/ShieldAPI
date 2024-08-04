const express = require('express');
const app = express();
const { pool, mongoose } = require('./db/connection');
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');
const limiter = require('./middleware/ratelimiter');
const applySecurityHeaders = require('./middleware/securityHeaders');
const winston = require('winston');

// Apply middlewares
app.use(express.json());
app.use(limiter);
app.use(applySecurityHeaders);

// Logging
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
