require('dotenv').config();
const { initializeDatabase } = require('./src/utils/initDb');

(async () => {
    try {
        await initializeDatabase();
        console.log('Setup completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Setup failed:', error);
        process.exit(1);
    }
})(); 