var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var _ = require('underscore');
var cookieSession = require('cookie-session')

var app = express();

port = 3000;

var passport = require('passport')
  , util = require('util')
  , crypto = require('crypto')
  , RedditStrategy = require('passport-reddit').Strategy;

var REDDIT_CONSUMER_KEY = "l1XvvzL9PfQ4eA";
var REDDIT_CONSUMER_SECRET = "bkIGUIIWywbsa028C3RxNOR6YC0";


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Reddit profile is
//   serialized and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


// Use the RedditStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Reddit
//   profile), and invoke a callback with a user object.
passport.use(new RedditStrategy({
    clientID: REDDIT_CONSUMER_KEY,
    clientSecret: REDDIT_CONSUMER_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/reddit/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ redditId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));

// app.set('port', process.env.PORT || 3000);

var io = require('socket.io').listen(app.listen(port));

// var users = require('./routes/users');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieSession({
    keys: ['secret1', 'secret2']
}))

app.post('/message', function(req, res) {
  var message = req.body.message;

  console.log('working over here with message')
  if(_.isUndefined(message) || _.isEmpty(message.trim())) {
    return res.json(400, {error: "invalid message"})
  }

  // this below can be problematic. it should not be to all sockets emit this message,
  // but instead only some of them

  console.log('working over here')

  io.sockets.emit('incomingMessage', {message: message})

  res.json(200, {message: 'recieved'})
})

app.post('/login',
  passport.authenticate('reddit', {
    successRedirect: '/loginSuccess',
    failureRedirect: '/loginFailure'
  })
);

// GET /auth/reddit
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Reddit authentication will involve
//   redirecting the user to reddit.com.  After authorization, Reddit
//   will redirect the user back to this application at /auth/reddit/callback
//
//   Note that the 'state' option is a Reddit-specific requirement.
// app.get('/auth/reddit', function(req, res, next){
//   req.session.state = crypto.randomBytes(32).toString('hex');
//   passport.authenticate('reddit', {
//     state: req.session.state,
//     duration: 'permanent',
//   })(req, res, next);
// });

// app.get('/auth/reddit/callback', function(req, res, next){
//   // Check for origin via state token
//   if (req.query.state == req.session.state){
//     passport.authenticate('reddit', {
//       successRedirect: '/',
//       failureRedirect: '/login'
//     })(req, res, next);
//   }
//   else {
//     next( new Error(403) );
//   }
// });

app.get('/auth/reddit', function(req, res, next){
  req.session.state = crypto.randomBytes(32).toString('hex');
  passport.authenticate('reddit', {
    state: req.session.state,
  })(req, res, next);
});

// GET /auth/reddit/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/reddit/callback', function(req, res, next){
  // Check for origin via state token
  if (req.query.state == req.session.state){
    passport.authenticate('reddit', {
      successRedirect: '/',
      failureRedirect: '/login'
    })(req, res, next);
  }
  else {
    next( new Error(403) );
  }
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}


// io.on('connection', function(socket){
//     socket.on('newUser', function(data) {
//         console.log('new user joined' + data.name)
//     })
// })

var routes = require('./routes/index');

app.use('/', routes);
// app.use('/users', users);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

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


module.exports = app;
