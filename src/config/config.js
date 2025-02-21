require('dotenv').config();

module.exports = {
    port: parseInt(process.env.PORT) || 3000,
    database: {
        url: process.env.DATABASE_URL,
        dialect: 'postgres'
    },
    redis: {
        url: process.env.REDIS_URL || 'redis://localhost:6379'
    },
    jwtSecret: process.env.JWT_SECRET,
    targetUrl: process.env.TARGET_URL,
    environment: process.env.NODE_ENV || 'development',
    corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000']
}; 