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


router.post('/login',cors.corsWithOption, passport.authenticate('local'),(req, res, next) =>{
  var token = authenticate.getToken({_id: req.user._id});
  if(req.user.admin == true){
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({status: 'you are successfully logged in as admin user!!!',token: token, success: true})
  }
  else{
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true,token: token, status: 'You are successfully logged in as verified user!!!'});
  }
});

router.get('/logout',(req, res,next) =>{
  
    req.logout();
    res.redirect('/');
  
});

module.exports = router;
