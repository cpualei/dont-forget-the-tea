const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { sequelize } = require('./db/models');
const session = require('express-session');
const { sessionSecret } = require('./config');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const tasksRouter = require('./routes/tasks');
const listsRouter = require('./routes/lists');
const subtasksRouter = require('./routes/subtasks');
const aboutUsRouter = require('./routes/aboutus.js')
const { restoreUser, requireAuth } = require('./auth');

const app = express();

// view engine setup
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// set up session middleware
const store = new SequelizeStore({ db: sequelize });

app.use(
  session({
    name: 'dont-forget-the-tea.sid',
    secret: sessionSecret,
    store,
    saveUninitialized: false,
    resave: false,
  })
  );
  
  // create Session table if it doesn't already exist
  store.sync();

app.use(restoreUser);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/aboutus',aboutUsRouter)

app.use(requireAuth);

app.use('/tasks', tasksRouter);
app.use('/lists', listsRouter);
app.use('/subtasks', subtasksRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  console.log("THIS IS THE ERROR MSG: ", err.message)
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
