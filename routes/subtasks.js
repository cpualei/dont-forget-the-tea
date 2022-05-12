const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const { Task, List, ListTask, User, Subtask } = require('../db/models');
const { csrfProtection, asyncHandler } = require('./utils');

const router = express.Router();

//-----------------------ERROR HANDLING-----------------------
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
  
//-----------------------TASK VALIDATOR-----------------------

const validateTask = [
    //  Task name cannot be empty:
    check('content')
        .exists({ checkFalsy: true })
        .withMessage("Task can't be empty."),
    //  Task name cannot be longer than 255 characters:
    check('content')
        .isLength({ max: 255 })
        .withMessage("Task can't be longer than 255 characters."),
];

//-----------------------TASK DETAIL PAGE-----------------------
router.get('/:id(\\d+)', asyncHandler(async (req, res, next) => {
    const subtaskId = parseInt(req.params.id, 10);
    const subtask = await Subtask.findByPk(subtaskId);
    if (subtask) {
        res.render('subtask-details', { subtask });
    } else {
        next(taskNotFoundError(subtaskId));
    };
})
);

//-----------------------GET EDIT SUBTASK DETAIL PAGE-----------------------
router.get('/:id(\\d+)/edit', csrfProtection, asyncHandler(async (req, res, next) => {
    const subtaskId = parseInt(req.params.id, 10);
    const subtask = await Subtask.findByPk(subtaskId);
    if (subtask) {
        res.render('edit-subtask', { subtask, csrfToken: req.csrfToken() });
    } else {
        next(taskNotFoundError(subtaskId));
    };
})
);
//-----------------------EDIT SUBTASK-----------------------
router.post("/:id(\\d+)/edit", csrfProtection, validateTask, handleValidationErrors, asyncHandler(async (req, res, next) => {
    const subtaskId = parseInt(req.params.id, 10);
    const subtask = await Subtask.findByPk(subtaskId);
    if (subtask) {
        await subtask.update({ content: req.body.content });
    } else {
        next(taskNotFoundError(subtaskId));
    }
    res.redirect(`/subtasks/${subtaskId}`)
})
);

// -------------------------GET DELETE TASK PAGE------------------------
router.get('/:id(\\d+)/delete', csrfProtection,
    asyncHandler(async (req, res) => {
        const subtaskId = parseInt(req.params.id, 10);
        const subtask = await Subtask.findByPk(subtaskId);
        res.render('delete-subtask', {
            title: 'Delete subtask',
            subtask,
            csrfToken: req.csrfToken(),
        });
    }));

// -------------------------DELETE TASK------------------------
router.post("/:id(\\d+)/delete", csrfProtection, asyncHandler(async (req, res, next) => {
    const subtaskId = parseInt(req.params.id, 10);
    const subtask = await Subtask.findByPk(subtaskId);

    if (subtask) {
        await subtask.destroy();
    } else {
        next(taskNotFoundError(subtaskId));
    }
    res.redirect('/tasks/')
    //*** we want to redirect to task/:id page
})
);
module.exports = router;
