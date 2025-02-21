const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

module.exports = (req, res, next) => {
    logger.info({
        method: req.method,
        path: req.path,
        ip: req.ip,
        timestamp: new Date()
    });
    next();
}; 