const express = require('express');
const Student = require('../../models/student');
const router = express.Router();
const isAuthenticated = require('../../middleware/auth');

router.use(isAuthenticated, (req, res, next) => {
    if (req.session.user.userType !== 'faculty') {
        return res.redirect('/');
    }
    next();
});

// GET resolve broken enrollment
router.get('/resolve/:studentId/:enrollmentId', async (req, res) => {
    const {studentId, enrollmentId} = req.params;

    try {
        const student = await Student.findById(studentId).populate('user');

        if (!student) {
            req.flash('error', 'Student not found.');
            return res.redirect('/faculty/students');
        }

        const enrollment = student.enrollments.find((e) => e._id.toString() === enrollmentId);

        if (!enrollment) {
            req.flash('error', 'Enrollment not found.');
            return res.redirect('/faculty/students');
        }

        res.render('faculty/resolve-enrollment', {
            student, enrollmentId, title: 'Resolve Broken Enrollment',
        });
    } catch (error) {
        console.error('Error loading resolve enrollment page:', error);
        req.flash('error', 'An error occurred while loading the page.');
        res.redirect('/faculty/students');
    }
});

// POST resolve broken enrollment
router.post('/resolve/:studentId/:enrollmentId', async (req, res) => {
    const {studentId, enrollmentId} = req.params;

    try {
        const student = await Student.findById(studentId);

        if (!student) {
            req.flash('error', 'Student not found.');
            return res.redirect('/faculty/students');
        }

        const enrollmentIndex = student.enrollments.findIndex((e) => e._id.toString() === enrollmentId);

        if (enrollmentIndex === -1) {
            req.flash('error', 'Enrollment not found.');
            return res.redirect('/faculty/students');
        }

        student.enrollments.splice(enrollmentIndex, 1);
        await student.save();

        req.flash('success', 'Invalid enrollment resolved.');
        res.redirect('/faculty/students');
    } catch (error) {
        console.error('Error resolving enrollment:', error);
        req.flash('error', 'An error occurred while resolving the enrollment.');
        res.redirect('/faculty/students');
    }
});

module.exports = router;
