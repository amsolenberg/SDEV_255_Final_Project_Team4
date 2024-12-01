const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');

module.exports = (app) => {
    app.use(express.static('public'));
    app.use(express.urlencoded({extended: true}));
    app.use(morgan('dev'));
    app.use(express.json());
    app.use(methodOverride('_method'));
    app.use(flash());
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {secure: false}
    }))
    app.use((req, res, next) => {
        res.locals.user = req.session.user;
        res.locals.success = req.flash('success');
        res.locals.error = req.flash('error');
        next();
    })
}
