const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/auth');

router.get('/data', authenticateJWT, (req, res) => {
    res.json({ message: 'This is protected data' });
});

module.exports = router;
