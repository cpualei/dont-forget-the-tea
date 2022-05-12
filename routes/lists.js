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

const validateList = [
    //  Task name cannot be empty:
    check('title')
        .exists({ checkFalsy: true })
        .withMessage("List can't be empty.")
        .isLength({ max: 255 })
        .withMessage("List can't be longer than 255 characters."),
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

router.post('/create', csrfProtection, validateList, handleValidationErrors, asyncHandler(async (req, res) => {
    const { title, includeWord, excludeWord, smart } = req.body;
    await List.create({
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

router.get('/:id(\\d+)/edit', csrfProtection, asyncHandler(async (req, res, next) => {
    const listId = parseInt(req.params.id, 10);
    const list = await List.findByPk(listId);
    if (list) {
        res.render('edit-list', { list, csrfToken: req.csrfToken() });
    } else {
        next(taskNotFoundError(listId));
    };
})
);

router.post("/:id(\\d+)/edit", csrfProtection, validateList, handleValidationErrors, asyncHandler(async (req, res, next) => {
    const listId = parseInt(req.params.id, 10);
    const list = await List.findByPk(listId);
    if (list) {
        await list.update({ list, title: req.body.title,csrfToken: req.csrfToken() });
    } else {
        next(taskNotFoundError(listId));
    }
    res.redirect('/lists')
})
);

// -------------------------DELETE------------------------
router.get('/:id(\\d+)/delete', csrfProtection,
    asyncHandler(async (req, res) => {
        const listId = parseInt(req.params.id, 10);
        const list = await List.findByPk(listId);
        res.render('delete-list', {
            title: 'Delete List',
            list,
            csrfToken: req.csrfToken(),
        });
    }));


router.post("/:id(\\d+)/delete", csrfProtection, asyncHandler(async (req, res, next) => {
    const listId = parseInt(req.params.id, 10);
    const list = await List.findByPk(listId);
    const tasks = await Task.findAll()
    //delete task, subtask, listtask
    //find out all the tasks associated to the list
    const listTasks = await ListTask.findAll({
        where: {
            listId
        }
    })

    if (list) {
        // // for (let i = 0; i < subtasks.length; i++) {
        // //     await subtasks[i].destroy();
        // // }
        // for (let i = 0; i < listTasks.length; i++) {
        //     await listTasks[i].destroy();
        // }
        await list.destroy();
    } else {
        next(taskNotFoundError(listId));
    }
    res.redirect('/tasks')
})
);

module.exports = router;
