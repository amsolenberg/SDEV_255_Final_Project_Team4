const Student = require('../models/student');

const setCartCount = async (req, res, next) => {
    if (req.session.user && req.session.user.userType === 'student') {
        try {
            const student = await Student.findOne({ user: req.session.user._id });
            res.locals.cartCount = student ? student.cart.length : 0;
        } catch (error) {
            console.error('Error fetching cart count:', error);
            res.locals.cartCount = 0;
        }
    } else {
        res.locals.cartCount = 0;
    }
    next();
};

module.exports = setCartCount;