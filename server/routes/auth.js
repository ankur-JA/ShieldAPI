const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Validate credentials
    // For demonstration purposes, assume validation passed
    const user = { id: 1, username };

    const token = jwt.sign(user, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token });
});

module.exports = router;
