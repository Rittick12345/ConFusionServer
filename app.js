var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require ('body-parser');
var mongoose = require('mongoose');
var session = require ('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require ('./routes/dishRouter');
var dishes = require('./models/dishes');
var User = require ('./models/user')
var authenticate = require('./authenticate');
var config = require('./config');

var app = express();

// Secure traffic only
app.all('*', (req, res, next) => {
  if (req.secure) {
    return next();
  }
  else {
    res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
  }
});

//setting up the mongo server//
const url = config.mongoUrl;

const connect = mongoose.connect(url);
connect.then ((db) =>{
  console.log('server is connected with mongodb database properly');
})
.catch((err) => console.log (err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser('12345-67890-14785-23698'));//
app.use(express.static(path.join(__dirname, 'public')));

/*app.use (session({
  name: 'session-id',
  secret: '12345-67890-14785-23698',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));*/

//initializing the passport middleware//
app.use(passport.initialize());
//app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);
//app.use(auth);

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
//basic authentication process
/*function auth(req, res, next){
  if(!req.user){
    var err = new Error ('You are not authorized');
    err.status = 401;
    res.setHeader('www-authenticate', 'basic');
    return next(err);
  }
  else{
   console.log('req.session: ', req.session);
   res.statusCode = 200;
   next ();
  }
}*/

module.exports = app;
