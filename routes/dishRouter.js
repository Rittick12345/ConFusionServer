var express = require ('express');
var bodyParser = require ('body-parser');
var dishRouter = express.Router();
dishRouter.use(bodyParser.json());

dishRouter.route('/')

.all((req,res,next) =>{
    res.statusCode =200;
    res.setHeader('Content-type', 'plain/text');
    next();
})
.get((req,res,next) =>{
    res.end ('This request will send all the dishes to you!!!');
})

.post((req,res,next) =>{
    res.end('This request will create the dish ' +req.body.name +' with description '+req.body.description+ ' for you!!!');
})

.put((req,res,next) =>{
    res.end('This PUT operation is not suppported on /dishes!!!');
})

.delete((req, res, next) => {
    res.end('Deleting all dishes!!!');
});

dishRouter.route('/:dishId')

.get( (req,res,next) =>{
    res.end('This will give the dish ' +req.params.dishId+ ' to you!!!');
})

.post( (req,res,next) =>{
    res.end('Post operation is not supported on this particular dish!!!');
})
.put((req,res,next) =>{
    res.write('This will update the dish ' +req.params.dishId +'\n');
    res.end ('This will update the dish ' +req.body.name+ ' with details ' +req.body.description);
})

.delete( (req,res,next) =>{
    res.end('This will delete the particular dish '+req.params.dishId)
});


module.exports = dishRouter;