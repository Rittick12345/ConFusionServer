var express = require('express');
var mongoose = require ('mongoose');
var bodyParser = require ('body-parser');
var favouriteRouter = express.Router();
favouriteRouter.use(bodyParser.json());
var authenticate = require ('../authenticate');
const cors = require('./cors');

var Dishes = require ('../models/dishes');
var User = require('../models/user');
var Favourites = require('../models/favourite');

favouriteRouter.route('/')
.options(cors.corsWithOption, (req,res) =>{ res.statusCode(200);})

.get(cors.corsWithOption, authenticate.verifyUser, (req, res,next) =>{
    Favourites.findOne({user: req.user._id})
    .populate('user')
    .populate('dishes')
    .then((favourite) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favourite);
    })
    .catch((err) =>{
        return next(err);
    })
})
.post(cors.corsWithOption, authenticate.verifyUser, (req, res,next) =>{
    
    Favourites.findOne({user: req.user._id}, (err, favourite) =>{
        if(err){
            return next(err);
        }
        if(!favourite){
            Favourites.create({user: req.user._id})
            .then((favourite)=>{
                for(i=0; i<req.body.length; i++){
                    if(favourite.dishes.indexOf(req.body[i]._id) <0){
                        favourite.dishes.push(req.body[i]);
                    }
                }
                favourite.save()
                .then((favourite) =>{
                    Favourites.findOne({user: req.user._id})
                    .populate('user')
                    .populate('dishes')
                    .then((favourite) =>{
                        console.log('favourite created')
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favourite);
                    })
                    .catch((err) =>{
                        return next(err)
                    })
                   
                })
                .catch((err) =>{
                     return next(err);
                 })
                .catch((err) =>{
                    return next(err);
                })
            })
            .catch((err) =>{
                return next(err);
            })
        }
    
        else{
            for (i=0; i<req.body.length;i++){
                if(favourite.dishes.indexOf(req.body[i]._id) <0){
                    favourite.dishes.push(req.body[i]);
                }
            }
            favourite.save()
            .then((favourite) =>{
                Favourites.findOne({user: req.user._id})
                    .populate('user')
                    .populate('dishes')
                    .then((favourite) =>{
                        console.log('favourite created')
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favourite);
                    })
                    .catch((err) =>{
                        return next(err)
                    })
            })
            .catch((err) =>{
                return next(err);
            })
        }
    })
    .catch((err) =>{
        return next(err);
    })
})
.put(cors.corsWithOption, authenticate.verifyUser, (req, res,next) =>{
    res.statusCode =403;
    res.setHeader('Content-Type','application/json');
    res.json('PUT method not supported on /favourites');
})
.delete(cors.corsWithOption, authenticate.verifyUser, (req, res,next) =>{
    Favourites.findOneAndRemove({user: req.user._id})
    .then((favourite) =>{
        res.statusCode=200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favourite);
    })
    .catch((err) =>{
        return next(err);
    })
});

favouriteRouter.route('/:dishId')
.options(cors.corsWithOption, (req,res) =>{ res.statusCode(200);})

.get(cors.corsWithOption, authenticate.verifyUser, (req, res,next) =>{
    Favourites.findOne({user: req.user._id},(err, favourite) =>{
        if(err){
            return next(err);
        }
        if(!favourite){
            res.statusCode = 200;
            res.setHeader('content-type','application/json');
            res.json({'success': false, "favourites": favourite});
            return;
        }
        else if(favourite.dishes.indexOf(req.params.dishId) < 0){
            res.statusCode = 200;
            res.setHeader('content-type','application/json');
            res.json({'success': false, "favourites": favourite});
            return;
        }
        else{
            res.statusCode = 200;
            res.setHeader('content-type','application/json');
            res.json({'success': true, "favourites": favourite});
            return;
        }  
    });
})

.post(cors.corsWithOption, authenticate.verifyUser, (req, res,next) =>{
   
    Favourites.findOne({user: req.user._id},(err,favourite) =>{
        if(err){
            return next(err);
        }
        if(!favourite){
            Favourites.create({user: req.user._id})
            .then((favourite)=>{   
                if(favourite.dishes.indexOf(req.params.dishId) < 0){
                        favourite.dishes.push(req.params.dishId);
                }               
                favourite.save()
                .then((favourite) =>{
                    Favourites.findOne({user: req.user._id})
                    .populate('user')
                    .populate('dishes')
                    .then((favourite)=>{
                        console.log('favourite created');
                        res.statusCode = 200;
                        res.setHeader('Content-type','application/json');
                        res.json(favourite);
                    })
                    .catch((err) =>{
                        return next(err);
                    })
                    
                })
                .catch((err) =>{
                    return next(err);
                })
            })
            .catch((err) =>{
                return next(err);
            })
        }
        else{       
            if(favourite.dishes.indexOf( req.params.dishId) > -1){
                res.statusCode = 403;
                res.setHeader('content-type', 'application/json');
                res.json({success: false, staus: 'dish already exists to your favourite'});
                return;
            }
            favourite.dishes.push(req.params.dishId);
            favourite.save()
            .then((favourite) =>{
                Favourites.findOne({user: req.user._id})
                .populate('user')
                .populate('dishes')
                .then((favourite) =>{
                    console.log('favourite dish added');
                    res.statusCode = 200;
                    res.setHeader('Content-type','application/json');
                    res.json(favourite);
                })
                .catch((err) =>{
                    return next(err);
                })  
            })
            .catch((err) =>{
                return next(err);
            })
        }
    })
    .catch((err) =>{
        return next(err);
    })
 })

.put(cors.corsWithOption, authenticate.verifyUser, (req, res,next) =>{
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    res.json('PUT operation not supported by /favourite/'+req.params.dishId);
})

.delete(cors.corsWithOption, authenticate.verifyUser, (req, res,next) =>{
    Favourites.findOne({user: req.user._id}, (err, favourite) =>{
        if(err){
            return next(err);
        }
        var position = favourite.dishes.indexOf(req.params.dishId);
        if(position != -1){
            favourite.dishes.splice(position,1);
            favourite.save()
            .then((favourite) =>{
                console.log('favourite dish deleted', favourite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favourite);
            })
            .catch((err) =>{
                return next (err);
            })
        }
        else{
            res.statusCode=404;
            res.setHeader('content-type','application/json');
            res.json({success: false, status: 'dish is not added to your favourite list' })
        }
    });
});
module.exports = favouriteRouter;


