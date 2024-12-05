const express = require('express');
const Student = require('../../models/student');
const Course = require('../../models/course');
const isAuthenticated = require('../../middleware/auth');

const router = express.Router();

router.use(isAuthenticated, (req, res, next) => {
  if (req.session.user.userType !== 'student') {
    return res.redirect('/');
  }
  next();
});

// GET view cart
router.get('/', async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.session.user._id }).populate('cart.course');
    res.render('student/cart', { cart: student.cart, title: 'My Cart' });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).send('Internal Server Error');
  }
});

// POST add to cart
router.post('/add', async (req, res) => {
  const { courseId } = req.body;

  try {
    const student = await Student.findOne({ user: req.session.user._id });
    if (!student) {
      return res.status(404).json({ error: 'Student record not found.' });
    }

    if (student.cart.some((item) => item.course.toString() === courseId)) {
      return res.status(400).json({ error: 'Course already in cart.' });
    }

    student.cart.push({ course: courseId });
    await student.save();

    res.status(200).json({ message: 'Course added to cart.' });
  } catch (error) {
    console.error('Error adding course to cart:', error);
    res.status(500).json({ error: 'An error occurred. Please try again.' });
  }
});

// POST remove from cart
router.post('/remove', async (req, res) => {
  const { courseId } = req.body;

  try {
    const student = await Student.findOne({ user: req.session.user._id });
    if (!student) {
      req.flash('error', 'Student record not found.');
      return res.redirect('/student/cart');
    }

    // Remove the course from the cart
    student.cart = student.cart.filter((item) => item.course.toString() !== courseId);
    await student.save();

    req.flash('success', 'Course removed from cart.');
    res.redirect('/student/cart');
  } catch (error) {
    console.error('Error removing course from cart:', error);
    req.flash('error', 'An error occurred. Please try again.');
    res.redirect('/student/cart');
  }
});

router.post('/enroll', async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.session.user._id });

    if (!student) {
      req.flash('error', 'Student record not found.');
      return res.redirect('/student/cart');
    }

    // Add all courses in the cart to the student's enrollments
    student.cart.forEach((cartItem) => {
      if (!student.enrollments.some((enrollment) => enrollment.course.toString() === cartItem.course.toString())) {
        student.enrollments.push({ course: cartItem.course });
      }
    });

    // Clear the cart after enrollment
    student.cart = [];
    await student.save();

    req.flash('success', 'Successfully enrolled in selected courses.');
    res.redirect('/profile');
  } catch (error) {
    console.error('Error enrolling in courses:', error);
    req.flash('error', 'An error occurred. Please try again.');
    res.redirect('/student/cart');
  }
});

module.exports = router;
