var express = require ('express');
var bodyParser = require ('body-parser');
var Dishes = require ('../models/dishes');
var mongoose = require ('mongoose');
var dishRouter = express.Router();
dishRouter.use(bodyParser.json());
var authenticate = require ('../authenticate');
const cors = require('./cors');


dishRouter.route('/')

.options(cors.corsWithOption, (req,res) =>{ res.statusCode(200);})
.get(cors.cors, (req,res,next) =>{
    Dishes.find(req.query)
    .populate('comments.author')
    .then((dish) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    })
    .catch((err) =>next(err));
  
})

.post(cors.corsWithOption, authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) =>{
    Dishes.create(req.body)
    .then((dishes) =>{
        console.log('dish created:', dishes)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes);
    })
    .catch((err) =>next(err));
  
})

.put(cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) =>{
    res.statusCode = 403;
    res.end('This PUT operation is not suppported on /dishes!!!');
})

.delete(cors.corsWithOption, authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Dishes.remove({})
    .then((dish) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    })
    .catch((err) =>next(err));
  
});

dishRouter.route('/:dishId')

.options(cors.corsWithOption, (req,res) =>{ res.statusCode(200);})
.get(cors.cors, (req,res,next) =>{
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    })
    .catch((err) => next(err));
})

.post(cors.corsWithOption, authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) =>{
    res.statusCode = 403;
    res.end('Post operation is not supported on this particular dish!!!');
})
.put(cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next) =>{
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
         

.delete(cors.corsWithOption, authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next) =>{
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((dish)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    })
    .catch((err) => next(err));

 });

 dishRouter.route('/:dishId/comments')

.options(cors.corsWithOption, (req,res) =>{ res.statusCode(200);})
 .get(cors.cors, (req, res, next)=>{
     Dishes.findById(req.params.dishId)
     .populate('comments.author')
     .then((dish) =>{
         if(dish != null)
         {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments);
         }
         else {
             var err = new Error('The particular dish' +req.params.dishId + 'not found');
            res.statusCode = 404;
            return next(err);
         }
     })
     .catch((err) =>next(err));
 })

 .post(cors.corsWithOption, authenticate.verifyUser, (req, res, next) =>{
     Dishes.findById(req.params.dishId)
     .then((dishes) =>{
         if(dishes !=null){
             req.body.author = req.user._id;
             dishes.comments.push(req.body);
             dishes.save()
             .then((dish) =>{
                 Dishes.findById(dish._id)
                 .populate('comments.author')
                 .then((dish) =>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish.comments);
                 },(err) => next(err))
                
             })
             .catch((err) => next(err))
         }
         else{
            var err = new Error('The particular dish' +req.params.dishId + 'not found');
            res.statusCode = 404;
            return next(err);
         }
     })
     .catch((err)=> next(err));
 })

 .put(cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin,  (req, res, next) =>{
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes/'
        + req.params.dishId + '/comments');
 })
 .delete(cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) =>{
     Dishes.findById(req.params.dishId)
     .then((dish) =>{    
          if (dish != null ){
                                  
             for (var i= (dish.comments.length -1); i>=0; i--){
                 dish.comments.id(dish.comments[i]._id).remove();
             }
             dish.save()
             .then((dish) =>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish.comments);
             },(err) => next (err))
        }
        else {
            var err = new Error('The particular dish' +req.params.dishId + 'not found');
            res.statusCode = 404;
            return next(err);
           }
        
        
     })
     .catch((err) => next(err));
 })

 dishRouter.route('/:dishId/comments/:commentId')
 .options(cors.corsWithOption, (req,res) =>{ res.statusCode(200);})
 .get(cors.cors, (req, res, next) =>{
     Dishes.findById(req.params.dishId)
     .populate('comments.author')
     .then((dish) =>{
         if(dish != null && dish.comments.id(req.params.commentId) != null){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments.id(req.params.commentId));
         }
         else if(dish ==null){
            var err = new Error('The particular dish' +req.params.dishId + 'not found');
            res.statusCode = 404;
            return next(err);
         }
         else if(dish.comments.id(req.params.commentId) == null)
         {
            var err = new Error('The particular comment' +req.params.commentId + 'not found');
            res.statusCode = 404;
            return next(err);
         }
     })
     .catch((err) => next(err));
 })

 .post (cors.corsWithOption, authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) =>{
     res.statusCode = 403;
     res.end('POST method is not supported on /commentId');
 })

 .put(cors.corsWithOption, authenticate.verifyUser, (req, res, next) =>{
    Dishes.findById(req.params.dishId)
    .then((dish) =>{
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            if(!dish.comments.id(req.params.commentId).author.equals(req.user._id)){
                var err = new Error('You are not authorized to update this particular comment');
                res.statusCode = 403;
                return next(err);
            }

            if(req.body.rating){
                dish.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if (req.body.comment) {
                dish.comments.id(req.params.commentId).comment = req.body.comment;                
            }
            dish.save()
            .then((dish) =>{
                Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish) =>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish.comments.id(req.params.commentId));
                }, (err) => next(err))
               
            })
            .catch((err) => next(err))
        
    }
        else if(dish == null){
            var err = new Error('The particular dish' +req.params.dishId + 'not found');
            res.statusCode = 404;
            return next(err);
        }
        else if( dish.comments.id(req.params.commentId) == null){
            var err = new Error('The particular comment' +req.params.commentId + 'not found');
            res.statusCode = 404;
            return next(err);
        }
       
 })
 .catch((err) =>next (err));
})

.delete(cors.corsWithOption, authenticate.verifyUser,(req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            if(!dish.comments.id(req.params.commentId).author.equals(req.user._id)){
                var err = new Error('You are not authorized to delete this particular comment');
                res.statusCode = 403;
                return next(err);
            }

            dish.comments.id(req.params.commentId).remove();
            dish.save()
            .then((dish) => {
                Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish) =>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish); 

                },(err) => next(err))
                               
            })
            .catch((err) =>next (err));
        
    }
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else if(dish.comments.id(req.params.commentId) == null){
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    })
    .catch((err) => next(err));
});



module.exports = dishRouter;