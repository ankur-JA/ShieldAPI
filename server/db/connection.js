const { Pool } = require('pg'); // For PostgreSQL
const mongoose = require('mongoose'); // For MongoDB

// PostgreSQL connection
const pool = new Pool({
    user: 'your_db_user',
    host: 'your_db_host',
    database: 'your_db_name',
    password: 'your_db_password',
    port: 5432,
});

pool.on('connect', () => {
    console.log('Connected to the PostgreSQL database');
});

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/your_db_name', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
    console.log('Connected to the MongoDB database');
});

module.exports = { pool, mongoose };
