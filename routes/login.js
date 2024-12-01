const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('login', {error: null, title: 'Login'});
})

router.post('/', async (req, res) => {
    const {email, password} = req.body;

    console.log('Received data:', {email, password}); // DEBUG

    try {
        // check if user exists
        const user = await User.findOne({email});
        if (!user) {
            console.log('Validation error: Missing fields'); // DEBUG
            return res.render('login', {error: 'Invalid email or password.', title: 'Login'});
        }
        // compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Validation error: Incorrect password'); // DEBUG
            return res.render('login', {error: 'Invalid email or password', title: 'Login'});
        }

        req.session.user = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            userType: user.userType,
        }
        console.log('Session user:', req.session.user); // DEBUG

        res.redirect('/profile')
        console.log('Login successful'); // DEBUG
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Internal Server Error');
    }
})

module.exports = router;
