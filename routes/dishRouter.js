var express = require ('express');
var bodyParser = require ('body-parser');
var Dishes = require ('../models/dishes');
var mongoose = require ('mongoose');
var dishRouter = express.Router();
dishRouter.use(bodyParser.json());

dishRouter.route('/')


.get((req,res,next) =>{
    Dishes.find({})
    .then((dish) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    })
    .catch((err) =>next(err));
  
})

.post((req,res,next) =>{
    Dishes.create(req.body)
    .then((dishes) =>{
        console.log('dish created:', dishes)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes);
    })
    .catch((err) =>next(err));
  
})

.put((req,res,next) =>{
    res.statusCode = 403;
    res.end('This PUT operation is not suppported on /dishes!!!');
})

.delete((req, res, next) => {
    Dishes.remove({})
    .then((dish) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    })
    .catch((err) =>next(err));
  
});

dishRouter.route('/:dishId')

.get( (req,res,next) =>{
    Dishes.findById(req.params.dishId)
    .then((dish) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    })
    .catch((err) => next(err));
})

.post( (req,res,next) =>{
    res.statusCode = 403;
    res.end('Post operation is not supported on this particular dish!!!');
})
.put((req,res,next) =>{
    Dishes.findByIdAndUpdate(req.params.dishId,
        {$set:req.body},
        {new: true})
        .then((dishes) =>{
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dishes);
        })
        .catch((err) => next(err));
    })
         

.delete( (req,res,next) =>{
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((dish)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    })
    .catch((err) => next(err));

 });


module.exports = dishRouter;