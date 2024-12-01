const express = require('express');
const bcrypt = require('bcryptjs');
// const User = require('../models/user');

const router = express.Router();

router.get('/', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error during logout:', err);
            return res.status(500).send('Unable to log out.');
        }

        // clear the session cache
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
});

module.exports = router;
