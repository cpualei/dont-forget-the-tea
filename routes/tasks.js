const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const { Task, List, ListTask, User, Subtask } = require('../db/models');
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
        .isLength({ max: 255 })
        .withMessage("Task can't be longer than 255 characters."),
];

router.get('/', csrfProtection, asyncHandler(async (req, res) => {
    const { userId } = req.session.auth;
    const tasks = await Task.findAll();
    console.log(tasks)
    const lists = await List.findAll({
        where: {
            userId
        }
    });
    console.log(lists)
    res.render('create-task', { lists, tasks, csrfToken: req.csrfToken() })
})
);

router.post('/', csrfProtection, validateTask, handleValidationErrors, asyncHandler(async (req, res) => {
    const { content, dueDate, listId } = req.body;
    const newTask = await Task.create({
        content,
        dueDate,
        userId: req.session.auth.userId
    });
    await ListTask.create({
        taskId: newTask.id,
        listId
    })
    res.redirect('/')
})
);

router.get('/:id(\\d+)', asyncHandler(async (req, res, next) => {
    const taskId = parseInt(req.params.id, 10);
    const task = await Task.findByPk(taskId);

    if (task) {
        res.render('task-details', { task });
    } else {
        next(taskNotFoundError(taskId));
    };
})
);

router.get('/:id(\\d+)/edit', csrfProtection, asyncHandler(async (req, res, next) => {
    const { userId } = req.session.auth;
    const taskId = parseInt(req.params.id, 10);
    const task = await Task.findByPk(taskId);
    const lists = await List.findAll({
        where: {
            userId
        }
    });
    if (task) {
        res.render('edit-task', { task, lists, csrfToken: req.csrfToken() });
    } else {
        next(taskNotFoundError(taskId));
    };
})
);

router.post("/:id(\\d+)/edit", csrfProtection, validateTask, handleValidationErrors, asyncHandler(async (req, res, next) => {
    const taskId = parseInt(req.params.id, 10);
    const task = await Task.findByPk(taskId);
    if (task) {
        await task.update({ content: req.body.content });
    } else {
        next(taskNotFoundError(taskId));
    }
    res.redirect('/tasks')
})
);

// -------------------------DELETE------------------------
router.get('/:id(\\d+)/delete', csrfProtection,
    asyncHandler(async (req, res) => {
        const taskId = parseInt(req.params.id, 10);
        const task = await Task.findByPk(taskId);
        res.render('delete-task', {
            title: 'Delete Task',
            task,
            csrfToken: req.csrfToken(),
        });
    }));


router.post("/:id(\\d+)/delete", csrfProtection, asyncHandler(async (req, res, next) => {
    const taskId = parseInt(req.params.id, 10);
    const task = await Task.findByPk(taskId);
    const listTasks = await ListTask.findAll({
        where: {
            taskId
        }        
    })
    const subtasks = await Subtask.findAll({
        where: {
            taskId
        }
    })
    if (task) {
        for (let i = 0; i < subtasks.length; i++) {            
            await subtasks[i].destroy();
        }
        for (let i = 0; i < listTasks.length; i++) {
            await listTasks[i].destroy();
        }        
        await task.destroy();
    } else {
        next(taskNotFoundError(taskId));
    }
    res.redirect('/tasks')
})
);


module.exports = router;
