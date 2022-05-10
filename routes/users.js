

const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
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
router.use((req, res, next) => {
  console.log("THE REQUEST REACHES HERE------------")
  next();
})
router.post('/signup', csrfProtection, userValidators,
  asyncHandler(async (req, res) => {
    // destructure user input
    console.log("IN POST SIGN UP ROUTE----" )
    const {
      email,
      firstName,
      lastName,
      username,
      password
    } = req.body;
    console.log("FORM VARIABLE: ",
    email,
    firstName,
    lastName,
    username,
    password)
    const validatorErrors = validationResult(req); // check req object for no errors

    if (validatorErrors.isEmpty()) { // if no errors, hash pwd, create the user in db
      console.log("IN IF VALIDATOR IS EMPTY STATEMENT----", validatorErrors.isEmpty() )
      const hashPassword = await bcrypt.hash(password, 12);
      console.log(hashPassword)
      const newUser = await User.create({
        email,
        firstName,
        lastName,
        username,
        hashPassword
      });
      console.log("newuser", newUser)
      res.redirect('/users/signup');

    } else { // if there are errors
      console.log("ELSE BLOCK RUNNING: DIDNT PASS VALIDATION")
      const errors = validatorErrors.array().map((error) => error.msg); // create errors array
      console.log("THIS IS THE ERROR ARR ", errors)
      const user = { // create user object
        email,
        firstName,
        lastName,
        username
      };
      console.log("THIS IS USER OBJECT RETURNING TO FORM", user)
      res.render('signup', { // re-render registration page w/ user data and error data
        title: 'Sign Up',
        user,
        errors,
        csrfToken: req.csrfToken(),
      });
    }
  }));

module.exports = router;
