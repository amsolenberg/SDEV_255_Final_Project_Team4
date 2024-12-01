const express = require('express');
const Course = require('../models/Course');

const router = express.Router();

router.get('/list', async (req, res) => {
    try {
        const courses = await Course.find();
        res.render('course-list', {courses, title: 'Course List'});
    } catch (err) {
        console.error('Error fetching course list', err);
        res.status(500).send('Error fetching course list');
    }
})

module.exports = router;