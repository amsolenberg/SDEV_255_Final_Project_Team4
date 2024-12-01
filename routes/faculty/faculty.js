const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../../models/user');
const isAuthenticated = require('../../middleware/auth');
const router = express.Router();

router.use(isAuthenticated, (req, res, next) => {
    if (req.session.user.userType !== 'faculty') {
        return res.redirect('/');
    }
    next();
});

// GET all faculty
router.get('/', async (req, res) => {
    try {
        const facultyList = await User.find({userType: 'faculty'});
        res.render('faculty/faculty-list', {facultyList, title: 'Manage Faculty'});
    } catch (error) {
        console.error('Error fetching faculty:', error);
        res.status(500).send('Internal Server Error');
    }
})

// GET form to add new faculty
router.get('/add', (req, res) => {
    res.render('faculty/faculty-add', {title: 'Add Faculty'});
})

// POST add new faculty
router.post('/add', async (req, res) => {
    const {firstName, lastName, email, password} = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newFaculty = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            userType: 'faculty',
        })
        await newFaculty.save()
        res.redirect('/faculty/faculty');
    } catch (error) {
        console.error('Error adding faculty:', error);
        res.status(500).send('Internal Server Error');
    }
})

// GET form to edit faculty
router.get('/edit/:id', async (req, res) => {
    try {
        const faculty = await User.findById(req.params.id);
        if (!faculty) {
            return res.status(404).send('Faculty not found');
        }
        res.render('faculty/faculty-edit', {faculty, title: 'Edit Faculty'});
    } catch (error) {
        console.error('Error editing faculty:', error);
        res.status(500).send('Internal Server Error');
    }
})

// POST to update faculty
router.post('/edit/:id', async (req, res) => {
    const {firstName, lastName, email} = req.body;
    try {
        await User.findByIdAndUpdate(req.params.id, {firstName, lastName, email});
        res.redirect('/faculty/faculty');
    } catch (error) {
        console.error('Error updating faculty:', error);
        res.status(500).send('Internal Server Error');
    }
})

// POST to delete faculty
router.post('/delete/:id', async (req, res) => {
    try {
        // Check if the faculty being deleted is the currently logged-in user
        if (req.params.id === req.session.user._id) {
            req.flash('error', 'You cannot delete yourself.');
            return res.redirect('/faculty/faculty');
        }

        // Proceed with deletion if not self
        await User.findByIdAndDelete(req.params.id);
        req.flash('success', 'Faculty member deleted successfully.');
        res.redirect('/faculty/faculty');
    } catch (error) {
        console.error('Error deleting faculty:', error);
        req.flash('error', 'An error occurred. Please try again.');
        res.redirect('/faculty/faculty');
    }
});

module.exports = router;