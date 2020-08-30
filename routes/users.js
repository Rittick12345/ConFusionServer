var express = require('express');
var passport = require('passport');
var bodyParser = require('body-parser');
const User = require('../models/user');
var authenticate = require('../authenticate');
var cors = require('./cors');

var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
//for administrators//
router.options('*', cors.corsWithOption,(req,res) => { res.statusCode(200);})
router.get('/',cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin, function(req, res) {
  User.find({})
  .then((users) =>{
    res.statusCode = 200; 
    res.setHeader ('Content-Type' , 'application/json');
    res.json(users);
  })
  .catch((err) =>{
    res.statusCode = 500;
    res.json(err);
  })
});

router.post('/signup',cors.corsWithOption, (req, res, next) =>{
  User.register(new User({username: req.body.username}),req.body.password,(err, user) =>{
    if(err){
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else{
      if(req.body.firstname){
        user.firstname = req.body.firstname
      }
      if(req.body.lastname){
        user.lastname = req.body.lastname
      }
      user.save()
      .then((user) =>{
        passport.authenticate('local')(req,res,() =>{
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration Successful!'});
      })
      
      });
    }
    
  });
});


router.post('/login',cors.corsWithOption, (req, res, next) =>{
  passport.authenticate('local',(err, user, info) =>{
    if(err){
      return next(err);
    }
    if(!user){
      res.statusCode = 401;
      res.setHeader('content-type','application/json');
      res.json({success: false, status: 'login unsuccessful', err: info});
    }
    req.logIn(user,(err) =>{
      if(err){
        res.statusCode = 401;
        res.setHeader('content-type','application/json');
        res.json({success: false, status: 'login unsuccessful', err: 'could not login the user'}); 
      }
      var token = authenticate.getToken({_id: req.user._id});
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: true,token: token, status: 'You are successfully logged in !!!'});
    })
  })(req,res,next);
 
});


router.get('/facebook/token',passport.authenticate('facebook-token'), (req, res) =>{
  if(req.user){
    var token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true,token: token, status: 'You are successfully logged in as facebook verified user!!!'});
  }
});
router.get('/checkJWTtoken', cors.corsWithOption,(req, res)=> {
  passport.authenticate('jwt', {session: false}, (err, user, info) => {
    if (err)
      return next(err);
    
    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      return res.json({status: 'JWT invalid!', success: false, err: info});
    }
    else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.json({status: 'JWT valid!', success: true, user: user});

    }
  }) (req, res);
});

router.get('/logout',(req, res,next) =>{
  
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
  
});

module.exports = router;
