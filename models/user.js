var mongoose = require ('mongoose');
var Schema = mongoose.Schema;
const  Passport  = require('passport');
var PassportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    admin:{
        type: Boolean,
        default: false
    }
});
User.plugin(PassportLocalMongoose);

module.exports = mongoose.model('User', User);
