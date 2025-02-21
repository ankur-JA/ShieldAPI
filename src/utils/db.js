const { Sequelize } = require('sequelize');
const config = require('../config/config');

const sequelize = new Sequelize(config.database.url, {
    dialect: 'postgres',
    logging: config.environment === 'development' ? console.log : false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    define: {
        timestamps: true // Enable timestamps for all models
    }
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('PostgreSQL connected successfully');
        
        // Sync all models
        await sequelize.sync({ alter: true });
        console.log('Database synchronized');
    } catch (error) {
        console.error('PostgreSQL connection error:', error);
        throw error; // Let the caller handle the error
    }
};

module.exports = { sequelize, connectDB };
