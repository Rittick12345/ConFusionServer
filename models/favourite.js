var mongoose = require('mongoose');
var Schema  = mongoose.Schema;
var User = require('./user');
var Dish = require('./dishes')

var favouriteSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        
    },
    dishes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish',
        
    }]
},{
    timestamps: true
});
var favourites = mongoose.model('favourite', favouriteSchema);
module.exports = favourites;