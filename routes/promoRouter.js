var express = require ('express');
var bodyParser = require ('body-parser');
var mongoose = require ('mongoose');
var Promotions = require('../models/promotions');
var promoRouter = express.Router();
promoRouter.use(bodyParser.json());
var authenticate = require ('../authenticate');
const cors = require('./cors');

promoRouter.route('/')
.options(cors.corsWithOption, (req,res) =>{ res.statusCode(200);})
.get(cors.cors, (req,res,next) =>{
    Promotions.find({})
    .then((promotions) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions);
    })
    .catch((err) =>next(err));
  
})

.post(cors.corsWithOption, authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) =>{
    Promotions.create(req.body)
    .then((promotions) =>{
        console.log('promotion created:', promotions)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions);
    })
    .catch((err) =>next(err));
  
})

.put(cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) =>{
    res.statusCode = 403;
    res.end('This PUT operation is not suppported on /promotions!!!');
})

.delete(cors.corsWithOption, authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Promotions.remove({})
    .then((promotions) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions);
    })
    .catch((err) =>next(err));
  
});

promoRouter.route('/:promoId')

.options(cors.corsWithOption, (req,res) =>{ res.statusCode(200);})
.get(cors.cors, (req,res,next) =>{
    Promotions.findById(req.params.promoId)
    .then((promotion) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    })
    .catch((err) => next(err));
})

.post(cors.corsWithOption, authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) =>{
    res.statusCode = 403;
    res.end('Post operation is not supported on this particular promotion!!!');
})
.put(cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next) =>{
    Promotions.findByIdAndUpdate(req.params.promoId,
        {$set:req.body},
        {new: true})
        .then((promotion) =>{
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promotion);
        })
        .catch((err) => next(err));
    })
         

.delete(cors.corsWithOption, authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next) =>{
    Promotions.findByIdAndRemove(req.params.promoId)
    .then((promotion)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    })
    .catch((err) => next(err));

 });

 module.exports = promoRouter;