const express = require('express');
const staticRoutes = require('./static');
const loginRoutes = require('./login');
const logoutRoutes = require('./logout');
const registerRoutes = require('./register');
const courseRoutes = require('./courses');
const profileRoutes = require('./profile');
const facultyRoutes = require('./facultyRoutes');


const router = express.Router();

router.use('/', staticRoutes);
router.use('/login', loginRoutes);
router.use('/logout', logoutRoutes);
router.use('/register', registerRoutes);
router.use('/courses', courseRoutes);
router.use('/profile', profileRoutes);
router.use('/faculty', facultyRoutes);

module.exports = router;