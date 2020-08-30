var express = require ('express');
var bodyParser = require ('body-parser');
var mongoose = require ('mongoose');
var Leaders = require('../models/leaders');
var leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());
var authenticate = require ('../authenticate');
const cors = require('./cors');

leaderRouter.route('/')
.options(cors.corsWithOption, (req,res) =>{ res.statusCode(200);})
.get(cors.cors, (req,res,next) =>{
    Leaders.find(req.query)
    .then((leaders) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leaders);
    })
    .catch((err) =>next(err));
  
})

.post(cors.corsWithOption, authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) =>{
    Leaders.create(req.body)
    .then((leaders) =>{
        console.log('leaders created:', leaders)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leaders);
    })
    .catch((err) =>next(err));
  
})

.put(cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) =>{
    res.statusCode = 403;
    res.end('This PUT operation is not suppported on /leaders!!!');
})

.delete(cors.corsWithOption, authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Leaders.remove({})
    .then((leaders) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leaders);
    })
    .catch((err) =>next(err));
  
});

leaderRouter.route('/:leaderId')

.options(cors.corsWithOption, (req,res) =>{ res.statusCode(200);})
.get(cors.cors, (req,res,next) =>{
    Leaders.findById(req.params.leaderId)
    .then((leader) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    })
    .catch((err) => next(err));
})

.post(cors.corsWithOption, authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) =>{
    res.statusCode = 403;
    res.end('Post operation is not supported on this particular leader!!!');
})
.put(cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next) =>{
    Leaders.findByIdAndUpdate(req.params.leaderId,
        {$set:req.body},
        {new: true})
        .then((leader) =>{
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leader);
        })
        .catch((err) => next(err));
    })
         

.delete(cors.corsWithOption, authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next) =>{
    Leaders.findByIdAndRemove(req.params.leaderId)
    .then((leader)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    })
    .catch((err) => next(err));

 });

 module.exports = leaderRouter;