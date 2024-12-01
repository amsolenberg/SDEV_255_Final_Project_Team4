const express = require('express');
const Course = require('../models/course');
const Student = require('../models/student');

const router = express.Router();

router.get('/list', async (req, res) => {
    try {
        const courses = await Course.find().populate('faculty', 'firstName lastName').lean();

        // Aggregate enrollment counts
        const courseEnrollmentCounts = await Student.aggregate([
            {$unwind: '$enrollments'},
            {$group: {_id: '$enrollments.course', count: {$sum: 1}}},
        ]);

        // Map enrollment counts to courses
        const enrollmentMap = courseEnrollmentCounts.reduce((map, entry) => {
            map[entry._id.toString()] = entry.count;
            return map;
        }, {});

        // Add enrollment counts to each course
        courses.forEach(course => {
            course.enrollmentCount = enrollmentMap[course._id.toString()] || 0;
        });

        res.render('course-list', {courses, title: 'Course List'});
    } catch (err) {
        console.error('Error fetching course list', err);
        res.status(500).send('Error fetching course list');
    }
});

module.exports = router;