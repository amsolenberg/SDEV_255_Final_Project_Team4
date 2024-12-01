const express = require('express');
const bcrypt = require('bcryptjs');
const Student = require('../../models/student');
const User = require('../../models/user');
const Course = require('../../models/course');
const isAuthenticated = require('../../middleware/auth');

const router = express.Router();

router.use(isAuthenticated, (req, res, next) => {
    if (req.session.user.userType !== 'faculty') {
        return res.redirect('/');
    }
    next();
});

// GET all students
router.get('/', async (req, res) => {
    try {
        const students = await Student.find({}).populate('user').populate('enrollments.course');
        res.render('faculty/student-list', {students, title: 'Manage Students'});
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).send('Internal Server Error');
    }
})

// GET form to add a new student
router.get('/add', async (req, res) => {
    try {
        const courses = await Course.find();
        res.render('faculty/student-add', {courses, title: 'Add Student'})
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).send('Internal Server Error');
    }
})

// POST add new student
router.post('/add', async (req, res) => {
    const {firstName, lastName, email, password, major, courses} = req.body;
    const courseArray = Array.isArray(courses) ? courses : courses ? [courses] : [];
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({firstName, lastName, email, password: hashedPassword, userType: 'student'});
        const savedUser = await newUser.save();
        const newStudent = new Student({
            user: savedUser._id,
            major,
            enrollments: courseArray.map(courseId => ({ course: courseId })),
        });
        await newStuent.save();

        res.redirect('/faculty/students');
    } catch (error) {
        console.error('Error adding student:', error);
        res.status(500).send('Internal Server Error');
    }
})

// GET form to edit a student
router.get('/edit/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).populate('user').populate('enrollments.course');
        const courses = await Course.find();
        if (!student) {
            return res.status(404).send('Student Not Found');
        }
        res.render('faculty/student-edit', {student, courses, title: 'Edit Student'});
    } catch (error) {
        console.error('Error editing student:', error);
        res.status(500).send('Internal Server Error');
    }
})

// POST update student
router.post('/edit/:id', async (req, res) => {
    const {firstName, lastName, email, major, courses} = req.body;
    const courseArray = Array.isArray(courses) ? courses : courses ? [courses] : [];
    try {
        const student = await Student.findById(req.params.id).populate('user');
        if (!student) {
            return res.status(404).send('Student Not Found');
        }
        // update the user information
        await User.findByIdAndUpdate(student.user._id, {firstName, lastName, email});

        // update the student information
        student.major = major;
        student.enrollments = courseArray.map(courseId => ({ course: courseId }));

        await student.save();

        res.redirect('/faculty/students');
    } catch (error) {
        console.error('Error updating student:', error);
        res.status(500).send('Internal Server Error');
    }
})

// POST delete student
router.post('/delete/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).send('Student Not Found');
        }

        // remove the user record
        await User.findByIdAndDelete(student.user);

        // remove teh student record
        await Student.findByIdAndDelete(req.params.id);

        res.redirect('/faculty/students');
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).send('Internal Server Error');
    }
})

module.exports = router;