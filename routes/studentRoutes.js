const express = require('express');
const studentRoutes = express.Router();

studentRoutes.use('/', require('./students/register'));
studentRoutes.use('/cart', require('./students/cart'));

module.exports = studentRoutes;