var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require ('body-parser');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require ('./routes/dishRouter');
var dishes = require('./models/dishes');

var app = express();
const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);
connect.then ((db) =>{
  console.log('server is connected with mongodb database properly');
})
.catch((err) => next(err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('12345-67890-14785-23698'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(auth);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishRouter);


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

function auth(req, res, next){
if(!req.signedCookies.user){
  var authHeader = req.headers.authorization;
  if(!authHeader){
    var err = new Error ('You are not authorized');
    err.status = 401;
    res.setHeader('www-authenticate', 'basic');
    return next(err);
  }
  var authr = new Buffer.from (authHeader.split(' ')[1], 'Base64').toString().split(':');
  username = authr[0];
  password = authr[1];

  if (username == 'admin' && password == 'password'){
    res.cookie ('user','admin',{signed:true});
    next ();
  }
  else{
    var err = new Error ('Your username or password is incorrect');
    err.status = 404;
    return next(err);
  }
}
else if(req.signedCookies.user!= 'admin'){
    var err = new Error ('You are not authenticated');
    err.status = 401;
    return next(err);
}
else {
  res.statusCode = 200;
  next ();
}
}
module.exports = app;
