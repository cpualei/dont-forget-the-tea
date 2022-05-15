

const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const { User } = require('../db/models');
const { csrfProtection, asyncHandler } = require('./utils');

const router = express.Router();


//-----------------------SIGN UP VALIDATOR----------------------
const userSignUpValidators = [
  check('firstName')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for first name')
    .isLength({ max: 50 })
    .withMessage('First Name must not be more than 50 characters long'),
  check('lastName')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for last name')
    .isLength({ max: 50 })
    .withMessage('Last Name must not be more than 50 characters long'),
  check('username')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for username')
    .isLength({ max: 50 })
    .withMessage('Username must not be more than 50 characters long'),
  check('email')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for email address')
    .isLength({ max: 255 })
    .withMessage('Email Address must not be more than 255 characters long')
    .isEmail()
    .withMessage('Email Address is not a valid email'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for password')

];

//-----------------------GET SIGN UP PAGE-----------------------
router.get('/signup', csrfProtection, asyncHandler(async (req, res) => {
  if (req.session.auth) {
    res.redirect('/lists')
  }
  res.render('signup', {
    title: 'Sign Up',
    user: {},
    errors: [],
    csrfToken: req.csrfToken(),
  });
}));

//-----------------------SIGN UP--------------------------------
router.post('/signup', csrfProtection, userSignUpValidators,
  asyncHandler(async (req, res) => {
    // destructure user input
    console.log('IN POST SIGN UP ROUTE----')
    const {
      email,
      firstName,
      lastName,
      username,
      password
    } = req.body;
    console.log('FORM VARIABLE: ',
      email,
      firstName,
      lastName,
      username,
      password)
    const validatorErrors = validationResult(req); // check req object for no errors

    if (validatorErrors.isEmpty()) { // if no errors, hash pwd, create the user in db
      console.log('IN IF VALIDATOR IS EMPTY STATEMENT----', validatorErrors.isEmpty())
      const hashPassword = await bcrypt.hash(password, 12);
      console.log(hashPassword)
      const newUser = await User.create({
        email,
        firstName,
        lastName,
        username,
        hashPassword
      });
      console.log('newuser', newUser)
      req.session.auth = {
        username: newUser.username,
        userId: newUser.id
      }
      res.redirect('/lists');

    } else { // if there are errors
      console.log('ELSE BLOCK RUNNING: DIDNT PASS VALIDATION')
      const errors = validatorErrors.array().map((error) => error.msg); // create errors array
      console.log('THIS IS THE ERROR ARR ', errors)
      const user = { // create user object
        email,
        firstName,
        lastName,
        username
      };
      console.log('THIS IS USER OBJECT RETURNING TO FORM', user)
      res.render('signup', { // re-render registration page w/ user data and error data
        title: 'Sign Up',
        user,
        errors,
        csrfToken: req.csrfToken(),
      });
    };
  }));


//-----------------------LOG IN VALIDATOR----------------------
const userLoginValidator = [
  check('username')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a valid username'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a password'),
]

//-----------------------GET LOG IN PAGE----------------------
router.get('/login', csrfProtection, asyncHandler(async (req, res) => {
  if (req.session.auth) {
    res.redirect('/lists')
  }
  res.render('login', { //render login page
    csrfToken: req.csrfToken(),
    errors: [],
    user: {}
  });
}));

router.use((req, res, next) => {
  console.log('IN THE USER ROUTER, REQUEST REACHES HERE')
  next()
})

const middlewareChecker = router.use((req, res, next) => {
  console.log('IN THE USER ROUTER, REQUEST REACHES HERE')
  next()
})

//-----------------------LOG IN-------------------------------
router.post('/login', csrfProtection, userLoginValidator, asyncHandler(async (req, res) => {
  console.log('IN THE POST LOGIN ROUTE')
  const {
    username,
    password
  } = req.body
  //add "username or email" this option later
  console.log('THIS IS USERNAME AND PASSWORD FROM REQ.BODY', username, password)


  let errors = [];
  const validatorErrors = validationResult(req);
  if (validatorErrors.isEmpty()) {
    console.log('IF VALIDATEORERRORS IS EMPTY IS RUNNING', validatorErrors.isEmpty())
    const user = await User.findOne({
      where: {
        username
      }
    });
    console.log('USER IN DATABASE', user)
    if (user !== null) {
      console.log('IN USER NULL BLOCK', user !== null)
      console.log("Password: ", password)
      console.log("HASH PASSWORD: ", user.hashPassword.toString())
      const isPassword = await bcrypt.compare(password, user.hashPassword.toString())
      if (isPassword) {
        console.log('IN THE ISPASSWORD IF BLOCK', isPassword)
        req.session.auth = {
          username: user.username,
          userId: user.id
        }
        console.log('THIS IS REQ.RESSION.AUTH')
        res.redirect('/lists')
      } else {
        errors.push('Invalid username or password');
        res.render('login', { //re-render login page
          csrfToken: req.csrfToken(),
          errors,
          user: {}
        });
      }
    }
  } else {
    console.log("IN THE ELSE BLOCK OF VALIDATION ERRORS.ISEMPTY, DID NOT PASS userLoginValidator" )
    errors = validatorErrors.array().map((error) => error.msg);
    res.render('login', { //re-render login page
      csrfToken: req.csrfToken(),
      errors,
      user: {}
    });
  }
}));


// -----------------------LOG OUT------------------------------
router.post('/logout', (req, res) => {
  console.log("IN POST LOGOUT")
  delete req.session.auth
  req.session.save(() => res.redirect('/'));
});

module.exports = router;
