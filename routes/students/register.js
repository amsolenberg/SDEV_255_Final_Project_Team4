const express = require('express');
const Student = require('../../models/student');
const Course = require('../../models/course');
const isAuthenticated = require('../../middleware/auth');

const router = express.Router();

router.use(isAuthenticated, (req, res, next) => {
    if (req.session.user.userType !== 'student') {
        return res.redirect('/');
    }
    next();
});

// GET courses for enrollment
router.get('/courses/register', async (req, res) => {
    try {
        const student = await Student.findOne({user: req.session.user._id}).populate('enrollments.course');
        const courses = await Course.find();

        // Get the enrolled courses
        const enrolledCourses = student ? student.enrollments.map(e => e.course) : [];

        res.render('student/courses-register', {courses, enrolledCourses, title: 'Register for Courses'});
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).send('Internal Server Error');
    }
});

// POST enroll in courses
router.post('/courses/register', async (req, res) => {
    const {courseIds} = req.body;

    try {
        const student = await Student.findOne({user: req.session.user._id});

        if (!student) {
            req.flash('error', 'Student record not found.');
            return res.redirect('/student/courses/register');
        }

        const selectedCourses = Array.isArray(courseIds) ? courseIds : [courseIds];

        selectedCourses.forEach(courseId => {
            if (!student.enrollments.some(e => e.course.toString() === courseId)) {
                student.enrollments.push({course: courseId});
            }
        });

        await student.save();
        req.flash('success', 'Successfully enrolled in selected courses.');
        res.redirect('/profile');
    } catch (error) {
        console.error('Error enrolling in courses:', error);
        req.flash('error', 'An error occurred. Please try again.');
        res.redirect('/student/courses/register');
    }
});

module.exports = router;
