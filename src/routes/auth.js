const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const config = require('../config/config');
const { sequelize } = require('../utils/db');

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { username, password, email } = req.body;
        
        const userExists = await User.findOne({ 
            where: {
                [sequelize.Op.or]: [{ username }, { email }]
            }
        });
        
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({ 
            username, 
            password, 
            email 
        });

        res.status(201).json({ 
            message: 'User created successfully',
            userId: user.id 
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error creating user' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const user = await User.findOne({ 
            where: { username } 
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { 
                userId: user.id, 
                username: user.username, 
                role: user.role 
            },
            config.jwtSecret,
            { expiresIn: '24h' }
        );

        res.json({ token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
});

module.exports = router;
