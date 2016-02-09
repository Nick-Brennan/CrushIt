var express = require('express');
require('dotenv').config();
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session')
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var crypto = require('crypto');
var flash = require('express-flash');
var db = require('./models');
var app = express();

// Middleware
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({ secret: process.env.SESSION_KEY }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', function(req, res){
  res.render('index', {
    title: 'Crush',
    user: req.user
  });
});

app.get('/login', function(req, res) {
  res.render('login', {
    user: req.user
  });
});

app.get('/signup', function(req, res) {
  res.render('signup', {
    user: req.user
  });
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/forgot', function(req, res){
  res.render('forgot', {
    user: req.user
  });
});

app.get('/test', function(req, res){
  res.sendFile(path.join(__dirname, 'views') + "/test.html");
});

app.get('/reset/:token', function(req, res){
  User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now()}}, function(err, user){
    if(!user){
      req.flash('error', 'Your password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', {
      user: req.user
    });
  });
});

app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) return next(err)
    if (!user) {
      req.flash('error', 'Incorrect Username or Password');
      return res.redirect('/login');
    }
    req.logIn(user, function(err) {
      if (err) return next(err);
      return res.redirect('/');
    });
  })(req, res, next);
});

app.post('/signup', function(req, res) {
  var user = new db.User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });

  user.save(function(err){
    req.logIn(user, function(err){
      res.redirect('/');
    });
  });
});

app.post('/forgot', function(req, res, next){
  async.waterfall([
    function(done){
        crypto.randomBytes(20, function(err, buf){
          var token = buf.toString('hex');
          done(err, token);
        });
    },
    function(token, done){
      db.User.findOne({email: req.body.email}, function(err, user){
        if(!user){
          req.flash('error', "Email Not Found");
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 1800000; //30 Min

        user.save(function(err){
          done(err, token, user);
        });
      });
    },
    function(token, user, done){
      var smtpTransport = nodemailer.createTransport('SMTP', {
        service: 'Gmail',
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'passwordreset@crush.it',
        subject: 'Crush Password Reset Request',
        text: 'If you requested to reset your Crush password please click the following link: \n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' + 
          'If you did not request to change you password, please ignore this email.'
      };
      smtpTransport.sendMail(mailOptions, function(err){
        req.flash('info', 'An email has been sent to ' + user.email + ' with instructions to reset your password.');
        done(err, 'done');
      });
    }
  ], function(err){
    if(err) return next(err);
    res.redirect('/forgot');
  });
});

app.post('/reset/:token', function(req, res){
  async.waterfall([
      function(done){
        db.User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}}, function(err, user){
          if(!user){
            req.flash('error', 'Your password reset token is invalid or has expired.');
            return res.redirect('back');
          }
          user.password = req.body.password;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;
          user.save(function(err){
            req.logIn(user, function(err){
              done(err, user);
            });
          });
        });
      },
      function(user, done){
        var smtpTransport = nodemailer.createTransport('SMTP', {
            auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'passwordreset@crush.it',
          subject: 'Password Changed',
          text: 'Hi!\n\n This email is to confirm that your Crush password has been changed'
        };
        smtpTransport.sendMail(mailOptions, function(err){
          req.flash('success', 'Password Changed Successfully');
          done(err);
        });
      }
    ], function(err){
      res.redirect('/');
    });
});

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});




