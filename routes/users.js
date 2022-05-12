

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
  router.get('/signup', csrfProtection, asyncHandler( async (req, res) => {
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
    console.log('IN POST SIGN UP ROUTE----' )
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
      console.log('IN IF VALIDATOR IS EMPTY STATEMENT----', validatorErrors.isEmpty() )
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
      res.redirect('/users/signup');

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
      .withMessage('Please provide a password')
  ]

//-----------------------GET LOG IN PAGE----------------------
router.get('/login', csrfProtection, asyncHandler(async (req, res) =>{
  res.render('login',  { //render login page
    csrfToken: req.csrfToken(),
    errors: [],
    user: {}
  });
}));

//-----------------------LOG IN-------------------------------
router.post('/login', csrfProtection, asyncHandler(async (req, res) => {
  const {
    username,
    password
  }= req.body
  //add "username or email" this option later
  const user = await User.findOne({
    where: {
      username
    }
  });
  console.log("Password: ", password)
  console.log("HASH PASSWORD: ", user.hashPassword.toString())
  const isPassword = await bcrypt.compare(password, user.hashPassword.toString())
  if (user && isPassword) {
    console.log('Successful login!')
    req.session.auth = {
      username: user.username,
      userId: user.id
    }
    res.redirect('/tasks')
  } else {
    req.errors.push('Invalid username or password. Please try again.')
    res.render('login',  { //re-render login page
      csrfToken: req.csrfToken(),
      errors: req.errors,
      user: {}
    });
  };
}));

//-----------------------LOG OUT------------------------------
// ADD LOGOUT PAGE???
// router.post('/logout', (req, res) => {
//   delete req.session.auth
//   req.session.save(() => res.redirect('/'));
// });

module.exports = router;
