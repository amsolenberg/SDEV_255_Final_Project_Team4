const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Student = require('../models/student');
const Course = require('../models/course');

const isAuthenticated = require('../middleware/auth');

const router = express.Router();

// GET profile page
router.get('/', isAuthenticated, async (req, res) => {
    const user = req.session.user;

    try {
        let associatedData = [];
        if (user.userType === 'student') {
            const student = await Student.findOne({user: user._id}).populate('enrollments.course');
            associatedData = student ? student.enrollments.map(e => e.course) : [];
        } else if (user.userType === 'faculty') {
            associatedData = await Course.find({faculty: user._id})
        }

        res.render('profile', {user, associatedData, title: 'Profile'});
    } catch (err) {
        console.error('Error fetching profile data:', err);
        res.status(500).send('Internal Server Error');
    }
});

// POST update email
router.post('/email-update', isAuthenticated, async (req, res) => {
    const {email} = req.body;

    try {
        await User.findByIdAndUpdate(req.session.user._id, {email});
        req.session.user.email = email; // Update session data
        res.redirect('/profile');
    } catch (error) {
        console.error('Error updating email:', error);
        res.status(500).send('Internal Server Error');
    }
});

// POST change password
router.post('/password-change', isAuthenticated, async (req, res) => {
    const {currentPassword, newPassword, confirmPassword} = req.body;

    try {
        const user = await User.findById(req.session.user._id);

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.render('profile', {
                user: req.session.user,
                error: 'Current password is incorrect.',
                title: 'Profile'
            });
        }

        // Verify new password match
        if (newPassword !== confirmPassword) {
            return res.render('profile', {user: req.session.user, error: 'Passwords do not match.', title: 'Profile'});
        }

        // Update password
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.redirect('/profile');
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).send('Internal Server Error');
    }
})

// POST unenroll student from a course
router.post('/unenroll', isAuthenticated, async (req, res) => {
    const {courseId} = req.body;

    try {
        const student = await Student.findOne({user: req.session.user._id});

        if (!student) {
            req.flash('error', 'Student record not found.');
            return res.redirect('/profile');
        }

        // Remove the course from enrollments
        student.enrollments = student.enrollments.filter(enrollment => enrollment.course.toString() !== courseId);
        await student.save();

        req.flash('success', 'Successfully unenrolled from the course.');
        res.redirect('/profile');
    } catch (error) {
        console.error('Error unenrolling from course:', error);
        req.flash('error', 'An error occurred. Please try again.');
        res.redirect('/profile');
    }
});

// POST remove course from faculty association
router.post('/remove-course', isAuthenticated, async (req, res) => {
    const {courseId} = req.body;

    try {
        const course = await Course.findById(courseId);

        if (!course) {
            req.flash('error', 'Course not found.');
            return res.redirect('/profile');
        }

        // Remove faculty association
        if (course.faculty.toString() === req.session.user._id) {
            course.faculty = null;
            await course.save();
            req.flash('success', 'Successfully removed from the course.');
        } else {
            req.flash('error', 'You are not associated with this course.');
        }

        res.redirect('/profile');
    } catch (error) {
        console.error('Error removing course association:', error);
        req.flash('error', 'An error occurred. Please try again.');
        res.redirect('/profile');
    }
});

module.exports = router;