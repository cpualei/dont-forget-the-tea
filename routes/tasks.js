

const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const { Task } = require('../db/models');
const { csrfProtection, asyncHandler } = require('./utils');

const router = express.Router();

const taskNotFoundError = (id) => {
    const err = Error(`Task with id of ${id} could not be found`);
    err.title = 'Task not found';
    err.status = 404;
    return err;
};

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
    check('content')
      .exists({ checkFalsy: true })
      .withMessage("Task can't be empty."),
    //  Task name cannot be longer than 255 characters:
    check('content')
      .isLength({ max: 280 })
      .withMessage("Task can't be longer than 255 characters."),
];

router.get('/', asyncHandler(async(req, res) => {
    const tasks = await Task.findAll();
    res.render('tasks', { tasks })
}));

router.get('/:id(\\d+)', asyncHandler(async(req, res, next) => {
    const taskId = parseInt(req.params.id, 10);
    const task = await Task.findByPk(taskId);

    if (task) {
        res.render('task-details', { task });
    } else {
        next(taskNotFoundError(taskId));
    };
}));

router.post('/', csrfProtection, asyncHandler(async(req, res) => {
    const { content, listId } = req.body;

    if (req.errors.length > 0) {
        res.render('create-task', { errors: req.errors, data: req.body })
    } else {
        const task = await Task.create({
            content,
            listId,
            userId: req.session.auth.userId
        });
        res.redirect('/')
    };
}));

module.exports = router;
