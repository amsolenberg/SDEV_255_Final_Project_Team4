const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Student = require('../models/student');
const Faculty = require('../models/faculty');

const router = express.Router();

// Render the registration page
router.get('/', (req, res) => {
    res.render('register', {error: null, title: 'Register'});
})

// POST for registration
router.post('/', async (req, res) => {
    const {firstName, lastName, email, password, confirmPassword, userType, major, department} = req.body;

    console.log("Received data:", {firstName, lastName, email}); // DEBUG

    // Validate form fields
    if (!firstName || !lastName || !email || !password || !confirmPassword || !userType) {
        console.log('Validation error: Missing fields'); // DEBUG
        return res.render('register', {error: 'All fields are required.', title: 'Register'});
    }
    if (password !== confirmPassword) {
        console.log('Passwords do not match'); // DEBUG
        return res.render('register', {error: 'Passwords do not match.', title: 'Register'});
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({email});
        if (existingUser) {
            console.log('Validation error: User already exists'); // DEBUG
            return res.render('register', {error: 'User already exists', title: 'Register'});
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Password hashed successfully'); // DEBUG

        // Create the user
        const newUser = new User({firstName, lastName, email, password: hashedPassword, userType});
        const savedUser = await newUser.save();
        console.log('User saved successfully:', savedUser); // DEBUG

        // Handle `department` or `major`
        if (userType === 'student') {
            if (major) {
                const newStudent = new Student({
                    user: savedUser._id,
                    major
                })
                await newStudent.save();
            }
        } else if (userType === 'faculty') {
            if (department) {
                const newFaculty = new Faculty({
                    user: savedUser._id,
                    department
                })
                await newFaculty.save();
            }
        }
        // Redirect to login page
        res.redirect('/login')
    } catch (err) {
        console.error('Error during registration:', err); // DEBUG
        res.render('register', {error: 'An error occurred. Please try again.', title: 'Register'});
    }
})

module.exports = router;