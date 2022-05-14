const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const { Task, List, ListTask, User, Subtask } = require('../db/models');
const { csrfProtection, asyncHandler } = require('./utils');


const router = express.Router();

//----------------------ERROR HANDLING-----------------------
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

//-----------------------LIST VALIDATOR-----------------------

const validateList = [
    //  Task name cannot be empty:
    check('title')
        .exists({ checkFalsy: true })
        .withMessage("List can't be empty.")
        .isLength({ max: 255 })
        .withMessage("List can't be longer than 255 characters."),
];

//-----------------------LISTS PAGE-----------------------

router.get('/', csrfProtection, asyncHandler(async (req, res) => {
    const { userId } = req.session.auth;
    console.log("THIS IS USER ID", userId)
    const lists = await List.findAll({
        where: {
            userId
        }
    });
    console.log(lists)
    res.render('list', { lists, csrfToken: req.csrfToken() })
})
);

router.get('/create', csrfProtection, asyncHandler(async (req, res) => {
    res.render('create-list', { csrfToken: req.csrfToken() })
})
);
//-----------------------CREATE LIST PAGE-----------------------
router.post('/create', csrfProtection, validateList, handleValidationErrors, asyncHandler(async (req, res) => {
    const { title, includeWord, excludeWord, smart } = req.body;
    await List.create({
        title,
        userId: req.session.auth.userId,
        includeWord,
        excludeWord,
        smart
    });
    res.redirect('/lists')
})
);

//-----------------------GET LIST DETAIL PAGE----------------------------

router.get('/:id(\\d+)', csrfProtection, asyncHandler(async (req, res) => {
    const { userId } = req.session.auth;
    const listId = parseInt(req.params.id, 10);
    const list = await List.findByPk(listId);
    const listofTasks = await Task.findAll({
        include: List,
            where: {
                userId
            }
        }
    )
    console.log("THIS IS LIST OF TASKS", listofTasks)
    res.render('list-detail', { list, listofTasks, csrfToken: req.csrfToken() })
})
);

//-----------------------GET LIST DETAIL EDIT PAGE----------------------------
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

//-----------------------EDIT LIST DETAIL----------------------------

router.post("/:id(\\d+)/edit", csrfProtection, validateList, handleValidationErrors, asyncHandler(async (req, res, next) => {
    const { userId } = req.session.auth;
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

// -------------------------GET LIST DETAIL DELETE PAGE------------------------
router.get('/:id(\\d+)/delete', csrfProtection,
    asyncHandler(async (req, res) => {
        const listId = parseInt(req.params.id, 10);
        const list = await List.findByPk(listId,{
            include: User
        });
        console.log("THIS IS LIST ", list)
        res.render('delete-list', {
            title: 'Delete List',
            list,
            csrfToken: req.csrfToken(),
        });
    }));

//------------------------LIST DELETE PAGE------------------------------

router.post("/:id(\\d+)/delete", csrfProtection, asyncHandler(async (req, res, next) => {
    const listId = parseInt(req.params.id, 10);
    const list = await List.findByPk(listId);

    if (list) {

        await list.destroy();
    } else {
        next(taskNotFoundError(listId));
    }
    res.redirect('/tasks')
})
);

module.exports = router;
