const express = require('express');
const User = require('../../models/user');
const Course = require('../../models/course');
const Student = require('../../models/student');
const router = express.Router();
const isAuthenticated = require('../../middleware/auth');

router.use(isAuthenticated, (req, res, next) => {
    if (req.session.user.userType !== 'faculty') {
        return res.redirect('/');
    }
    next();
});

// GET course list
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find({}).populate('faculty', 'firstName lastName').lean();

        const courseEnrollmentCounts = await Student.aggregate([
            {$unwind: '$enrollments'},
            {$group: {_id: '$enrollments.course', count: {$sum: 1}}}
        ])

        const enrollmentMap = courseEnrollmentCounts.reduce((map, entry) => {
            map[entry._id.toString()] = entry.count;
            return map;
        }, {});

        courses.forEach(course => {
            course.enrollmentCount = enrollmentMap[course._id.toString()] || 0;
        })

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
        const courseId = req.params.id;

        const studentsWithCourse = await Student.find({'enrollments.course': courseId});

        if (studentsWithCourse.length > 0) {
            req.flash(
                'error',
                'Cannot delete this course. Students are currently enrolled in it.'
            );
            return res.redirect('/faculty/courses');
        }

        await Course.findByIdAndDelete(courseId);

        req.flash('success', 'Course deleted successfully.');
        res.redirect('/faculty/courses');
    } catch (error) {
        console.error('Error deleting course:', error);
        req.flash('error', 'An error occurred while deleting the course.');
        res.redirect('/faculty/courses');
    }
});

// GET resolve broken enrollment
router.get('/enrollment/resolve/:studentId/:enrollmentId', async (req, res) => {
    const {studentId, enrollmentId} = req.params;

    try {
        const student = await Student.findById(studentId).populate('user');

        if (!student) {
            req.flash('error', 'Student not found.');
            return res.redirect('/faculty/students');
        }

        const enrollment = student.enrollments.find(
            (e) => e._id.toString() === enrollmentId
        );

        if (!enrollment) {
            req.flash('error', 'Enrollment not found.');
            return res.redirect('/faculty/students');
        }

        res.render('faculty/resolve-enrollment', {
            student,
            enrollmentId,
            title: 'Resolve Broken Enrollment',
        });
    } catch (error) {
        console.error('Error loading resolve enrollment page:', error);
        req.flash('error', 'An error occurred while loading the page.');
        res.redirect('/faculty/students');
    }
});

// POST resolve broken enrollment
router.post('/enrollment/resolve/:studentId/:enrollmentId', async (req, res) => {
    const { studentId, enrollmentId } = req.params;

    try {
        const student = await Student.findById(studentId);

        if (!student) {
            req.flash('error', 'Student not found.');
            return res.redirect('/faculty/students');
        }

        const enrollmentIndex = student.enrollments.findIndex(
            (e) => e._id.toString() === enrollmentId
        );

        if (enrollmentIndex === -1) {
            req.flash('error', 'Enrollment not found.');
            return res.redirect('/faculty/students');
        }

        // Remove the invalid enrollment
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