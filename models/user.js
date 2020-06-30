var mongoose = require ('mongoose');
var Schema = mongoose.Schema;
var PassportLocalMongoose = require('passport-local-mongoose');
const { Passport } = require('passport');
var User = new Schema({
    admin:{
        type: Boolean,
        default: false
    }
});
User.plugin(PassportLocalMongoose);

module.exports = mongoose.model('User', User);
