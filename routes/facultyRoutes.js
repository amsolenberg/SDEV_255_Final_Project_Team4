const express = require('express');
const facultyRoutes = express.Router();

facultyRoutes.use('/courses', require('./faculty/courses'));
facultyRoutes.use('/faculty', require('./faculty/faculty'));
facultyRoutes.use('/students', require('./faculty/students'));

module.exports = facultyRoutes;