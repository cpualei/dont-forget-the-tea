const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const { Task, List, ListTask, User, Subtask } = require('../db/models');
const { csrfProtection, asyncHandler } = require('./utils');

const router = express.Router();

const handleValidationErrors = (req, res, next) => {
    const validationErrors = validationResult(req);

    // If the validation errors are not empty,
    if (!validationErrors.isEmpty()) {
        // Generate an array of error messages
        const errors = validationErrors.array().map((error) => error.msg);

        // Generate a new `400 Bad request.` Error object
        // and invoke the next function passing in `err`
        // to pass control to the global error handler.
        const err = Error("Bad request.");
        err.status = 400;
        err.title = "Bad request.";
        err.errors = errors;
        return next(err);
    }

    // Invoke the next middleware function
    next();
};

const validateTask = [
    //  Task name cannot be empty:
    check('title')
        .exists({ checkFalsy: true })
        .withMessage("List can't be empty.")
        .isLength({ max: 255 })
        .withMessage("List can't be longer than 255 characters."),
    check('smart')
        .exists({ checkFalsy: true })
        .withMessage("Smart list")
];

router.get('/', csrfProtection, asyncHandler(async (req, res) => {
    const lists = await List.findAll();
    console.log(lists)
    res.render('list', { lists, csrfToken: req.csrfToken() })
})
);

router.get('/create', csrfProtection, asyncHandler(async (req, res) => {
    res.render('create-list', { csrfToken: req.csrfToken() })
})
);

router.post('/create', csrfProtection, validateTask, handleValidationErrors, asyncHandler(async (req, res) => {
    const { title, includeWord, excludeWord, smart } = req.body;
    const newList = await List.create({
        title, 
        userId: req.session.auth.userId,
        includeWord, 
        excludeWord, 
        smart
    });
    // await ListTask.create({
    //     taskId,
    //     listId: newList.id 
    // })
    res.redirect('/lists')
})
);
module.exports = router;
