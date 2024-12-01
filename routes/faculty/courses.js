const express = require('express');
const User = require('../../models/User');
const Course = require('../../models/Course');
const router = express.Router();
const isAuthenticated = require('../../middleware/auth');

router.use(isAuthenticated);

// GET course list
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find({}).populate('faculty', 'firstName lastName');
        res.render('faculty/courses-list', {courses, title: 'Manage Courses'});
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).send('Internal Server Error');
    }
});

// GET form to add a new course
router.get('/add', async (req, res) => {
    try {
        const facultyList = await User.find({userType: 'faculty'});
        res.render('faculty/courses-add', {title: 'Add Course', facultyList});
    } catch (error) {
        console.error('Error fetching faculty list:', error);
        res.status(500).send('Internal Server Error');
    }
})

// POST new course
router.post('/add', async (req, res) => {
    let {name, code, description, credits, faculty} = req.body;
    try {
        code = code.toUpperCase(); // Make any Course Code entered be saved as uppercase
        const newCourse = new Course({name, code, description, credits});
        if (faculty) {
            newCourse.faculty = faculty;
        }
        await newCourse.save();
        res.redirect('/faculty/courses');
    } catch (error) {
        console.error('Error adding course:', error);
        res.status(500).send('Internal Server Error');
    }
})

// GET form to edit a course
router.get('/edit/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('faculty', 'firstName lastName');
        if (!course) {
            return res.status(404).send('Course not found');
        }
        const facultyList = await User.find({userType: 'faculty'}); // Get all faculty
        res.render('faculty/courses-edit', {course, facultyList, title: 'Edit Course'});
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).send('Internal Server Error');
    }
});

// POST update course
router.post('/edit/:id', async (req, res) => {
    const {name, code, description, credits, faculty} = req.body;

    try {
        await Course.findByIdAndUpdate(req.params.id, {
            name,
            code: code.toUpperCase(),
            description,
            credits,
            faculty: faculty || null,
        });
        res.redirect('/faculty/courses');
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).send('Internal Server Error');
    }
});

// POST delete course
router.post('/delete/:id', async (req, res) => {
    try {
        await Course.findByIdAndDelete(req.params.id);
        res.redirect('/faculty/courses');
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).send('Internal Server Error');
    }
})

module.exports = router;