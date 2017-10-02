var express = require('express');
var router = express.Router();

var Mongoose = require('mongoose');
var Hash = require('password-hash');
var passport = require('passport');




var Schema = Mongoose.Schema;





// ... continue with Express.js app initialization ...



var UserSchema = new Schema({
    email: { type: String },
    password: { type: String}
    // ... add any other properties you want to save with users ...
});

var Users = Mongoose.model('Users', UserSchema);




UserSchema.statics.authenticate = function(email, password, callback) {
    this.findOne({ email: email }, function(error, user) {
        if (user  && Hash.verify(password, user.password)) {
            callback(null, user);
        } else if (user || !error) {
            // Email or password was invalid (no MongoDB error)
            error = new Error("Your email address or password is invalid. Please try again.");
            callback(error, null);
        } else {
            // Something bad happened with MongoDB. You shouldn't run into this often.
            callback(error, null);
        }
    });
};


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});


router.get('/dashboard', function(req, res, next) {
    res.render('dashboard', { title: 'Express' });
});

/* GET signup page functionality. */
router.post('/signup', function(req, res, next) {
    var Users = Mongoose.model('Users');
    var Hpwd = Hash.generate(req.body.password);
    var user = new Users({ email:req.body.email, password:Hpwd})
    user.save(function (err) {
        if (err){
            console.log(err);
            res.render('error', { error:err });
        }else{
            console.log('sucess!!');
            res.render('dashboard', {data:req.body});
        }
    })
    //res.render('dashborad', { title: 'Express' });

});

router.get('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/',
    failureFlash: true
}));

router.get('/logout', function(req, res) {
    req.session.destroy(function(err){
        if(err){
            console.log(err);
            //console.log(req.sessionID );
            //Response.errorResponse(err.message,res);
        }
        else
        {
            //Response.successResponse('User logged out successfully!',res,{});
            res.render('index', { title: 'Express' });
        }
    });
});
module.exports = router;
