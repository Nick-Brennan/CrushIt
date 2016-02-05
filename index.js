var express = require('express');
var app = express();
var session = require('express-session');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var nodemailer = require('nodemailer');
var async = require('async');
var crypto = require('crypto');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var db = require('./models');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({secret: 'hide this later'}));
app.use(express.static(path.join(__dirname, 'public')));

//passport configuration
passport.use(new Strategy(function(username, password, done){
  db.User.findOne({username: username}, function(err, user){
    if(err) return done(err);
    if(!user) return done(null, false, {message: "Wrong Username"});
    user.comparePassword(password, function(err, isMatch){
      if(isMathch){
        return doe(null, user);
      }else{
        return done(null, false, {message: "Wrong Password"});
      }
    });
  });
}));

passport.serializeUser(function(user, done){
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  db.User.findById(id, function(err, user){
    done(err, user);
  });
});

app.use(passport.initialize());
app.use(passport.session());

//routes
app.get('/', function(req, res){
  res.render('index', {
    title: 'Crush',
    user: req.user
  });
});

app.get('/login', function(req, res){
  res.render('login', {
    user: req.user
  });
});



// error handlers

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(process.env.PORT || 3000, function(req, res){
  console.log("Crush Is On port " + (process.env.PORT || 3000));
});
