var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var tokenRouter = require('./routes/token');
var searchRouter = require('./routes/search');
var entityRouter = require('./routes/entity');
var sqlRouter = require('./routes/sqldb.js');
var uploadRouter = require('./routes/upload');
var uploadImgRouter = require('./routes/upload_image')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/public', express.static('public'));
app.use('/users', usersRouter);
app.use('/token', tokenRouter);
app.use('/search', searchRouter);
app.use('/entity', entityRouter);
app.use('/sqldb', sqlRouter);
app.use('/upload', uploadRouter);
app.use('/upload_image', uploadImgRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
