const express = require('express');
const router = express.Router();
const NoAuthRoute = require('../models/noAuthRoute');
const jwtVerify = require('../middlewares/jwtVerify');
const { sequelize } = require('../utils/db');

// Protected route to manage no-auth routes (admin only)
router.post('/no-auth-routes', jwtVerify, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }

        const { path, description } = req.body;
        const noAuthRoute = await NoAuthRoute.create({ 
            path, 
            description 
        });

        res.status(201).json(noAuthRoute);
    } catch (error) {
        console.error('Create no-auth route error:', error);
        res.status(500).json({ message: 'Error creating no-auth route' });
    }
});

// Get all no-auth routes
router.get('/no-auth-routes', jwtVerify, async (req, res) => {
    try {
        const routes = await NoAuthRoute.findAll();
        res.json(routes);
    } catch (error) {
        console.error('Fetch no-auth routes error:', error);
        res.status(500).json({ message: 'Error fetching routes' });
    }
});

module.exports = router;
