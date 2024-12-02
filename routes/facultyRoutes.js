const express = require('express');
const facultyRoutes = express.Router();

facultyRoutes.use('/courses', require('./faculty/courses'));
facultyRoutes.use('/faculty', require('./faculty/faculty'));
facultyRoutes.use('/students', require('./faculty/students'));
facultyRoutes.use('/enrollment', require('./faculty/enrollment'));

module.exports = facultyRoutes;