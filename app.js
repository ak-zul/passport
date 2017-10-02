var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var Mongoose = require('mongoose');

var app = express();
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');
var PassportLocalStrategy = require('passport-local');
var Hash = require('password-hash');



Mongoose.connect('mongodb://localhost/test', { useMongoClient: true, promiseLibrary: global.Promise });


app.use(session({
    secret: 'djhxcvxfgshjfgjhgsjhfgakjeauytsdfy', // a secret key you can write your own
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: Mongoose.connection })
}));


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




var Schema = Mongoose.Schema;

var UserSchema = new Schema({
    email: { type: String },
    password: { type: String}
});

UserSchema.statics.authenticate = function(email, password, callback) {
    this.findOne({ email: email}, function(error, user) {
        if (user  &&  (Hash.verify(password, user.password))) {
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

var Users = Mongoose.model('Users', UserSchema);

// Mongoose.connect('mongodb://localhost/test', { useMongoClient: true, promiseLibrary: global.Promise });

var authStrategy = new PassportLocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, function(email, password, done) {
    Users.authenticate(email, password, function(error, user){
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
    Users.findById(id, function(error, user) {
        done(error, user);
    });
};

passport.use(authStrategy);
passport.serializeUser(authSerializer);
passport.deserializeUser(authDeserializer);
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/users', users);

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
