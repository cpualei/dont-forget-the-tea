const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const { Task, List, ListTask, User, Subtask } = require('../db/models');
const { csrfProtection, asyncHandler } = require('./utils');
const router = express.Router();
/* GET home page. */
router.get('/', ((req, res) => {
  res.render('about-us');
}));

module.exports = router;
