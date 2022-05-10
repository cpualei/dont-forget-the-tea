

const express = require('express');
const { check, validationResult } = require('express-validator');

const { User } = require('../db/models');
const { csrfProtection, asyncHandler } = require('./utils');

const router = express.Router();

router.get('/signup', csrfProtection, (req, res) => {
  res.render('signup', {
    title: 'Sign Up',
    user: {},
    errors: [],
    csrfToken: req.csrfToken(),
  });
});

const userValidators = [
  check('firstName')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for First Name')
    .isLength({ max: 50 })
    .withMessage('First Name must not be more than 50 characters long'),
  check('lastName')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Last Name')
    .isLength({ max: 50 })
    .withMessage('Last Name must not be more than 50 characters long'),
  check('username')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for username')
    .isLength({ max: 50 })
    .withMessage('Username must not be more than 50 characters long'),
  check('email')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Email Address')
    .isLength({ max: 255 })
    .withMessage('Email Address must not be more than 255 characters long')
    .isEmail()
    .withMessage('Email Address is not a valid email'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Password')

];

router.post('/signup', csrfProtection, userValidators,
  asyncHandler(async (req, res) => {
    // destructure user input
    const {
      email,
      firstName,
      lastName,
      username,
      password
    } = req.body;

    const validatorErrors = validationResult(req); // check req object for no errors

    if (validatorErrors.isEmpty()) { // if no errors, hash pwd, create the user in db
      const hashedPassword = await bcrypt.hash(password, 12);
      await User.create({
        email,
        firstName,
        lastName,
        username,
        hashedPassword
      });
      res.redirect('/');

    } else { // if there are errors
      const errors = validatorErrors.array().map((error) => error.msg); // create errors array
      const user = { // create user object
        email,
        firstName,
        lastName,
        username
      };
      res.render('signup', { // re-render registration page w/ user data and error data
        title: 'Sign Up',
        user,
        errors,
        csrfToken: req.csrfToken(),
      });
    }
  }));

module.exports = router;
