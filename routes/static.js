const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', {title: 'Home'});
})

router.get('/privacy-policy', (req, res) => {
    res.render('privacy-policy', {title: 'Privacy Policy'});
})

router.get('/terms', (req, res) => {
    res.render('terms', {title: 'Terms of Service'});
})

module.exports = router;