const { sequelize } = require('./db');
const User = require('../models/user');
const NoAuthRoute = require('../models/noAuthRoute');

const initializeDatabase = async () => {
    try {
        // Create tables
        await sequelize.sync({ force: true }); // Be careful with force: true in production!

        // Create default admin user
        await User.create({
            username: 'admin',
            password: 'admin123', // Change this in production!
            email: 'admin@example.com',
            role: 'admin'
        });

        // Create some default no-auth routes
        await NoAuthRoute.create({
            path: '/health',
            description: 'Health check endpoint'
        });

        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Database initialization failed:', error);
        process.exit(1);
    }
};

module.exports = { initializeDatabase }; 