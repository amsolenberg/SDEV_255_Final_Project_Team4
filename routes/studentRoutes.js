const express = require('express');
const studentRoutes = express.Router();

studentRoutes.use('/', require('./students/register'));

module.exports = studentRoutes;