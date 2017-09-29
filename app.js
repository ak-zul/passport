var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var passport = require('passport');

var users = require('./routes/users');
var PassportLocalStrategy = require('passport-local');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
//app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('connect-flash')()); // see the next section



app.use('/', index);
app.use('/users', users);


var Mongoose = require('mongoose');
var Hash = require('password-hash');
var passport = require('passport');



var PassportLocalStrategy = require('passport-local');
var Schema = Mongoose.Schema;



Mongoose.connect('mongodb://localhost/test', { useMongoClient: true, promiseLibrary: global.Promise });

var authStrategy = new PassportLocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, function(email, password, done) {
    User.authenticate(email, password, function(error, user){
        // You can write any kind of message you'd like.
        // The message will be displayed on the next page the user visits.
        // We're currently not displaying any success message for logging in.
        done(error, user, error ? { message: error.message } : null);
    });
});

var authSerializer = function(user, done) {
    done(null, user.id);
};

var authDeserializer = function(id, done) {
    User.findById(id, function(error, user) {
        done(error, user);
    });
};

passport.use(authStrategy);
passport.serializeUser(authSerializer);
passport.deserializeUser(authDeserializer);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
