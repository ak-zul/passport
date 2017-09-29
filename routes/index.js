var express = require('express');
var router = express.Router();

var Mongoose = require('mongoose');
var Hash = require('password-hash');
var passport = require('passport');

//var PassportLocalStrategy = require('passport-local');
//var Schema = Mongoose.Schema;
//var Users = mongoose.model('Users', { username: String ,emailid: String,password: String});


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

/* GET signup page functionality. */
//

module.exports = router;
