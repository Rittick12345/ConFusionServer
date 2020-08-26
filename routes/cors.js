var express = require('express');
var cors = require('cors');
var app = express();

const whitelist = ['http://localhost:3000', 'https://localhost:3443'];
var corsOptionWithDelegate = (req, callback) =>{
    var corsOptions;
    if(whitelist.indexOf(req.header('origin')) !== -1){
        corsOptions ={
            origin: true
        }
    }
    else{
        corsOptions ={
            origin: false
        }
    }
    callback(null,corsOptions);
}
exports.cors = cors();
exports.corsWithOption = cors(corsOptionWithDelegate);