var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var _ = require('underscore');
var cookieSession = require('cookie-session')
var session = require('express-session');
var mongoose = require('mongoose');
var flash = require('connect-flash');
var db = mongoose.connect('mongodb://@localhost/MyDatabase');
var fs = require('fs');
var busboy = require('connect-busboy');

var messages = [];

var Schema = mongoose.Schema;
var UserSchema = new Schema({
      name: String,
      redditId: String,
      online: Boolean,
      image: String,
    }, {
      collection: 'users'
    });
var User = mongoose.model('users', UserSchema);

var app = express();

port = 3000;

var passport = require('passport')
  , util = require('util')
  , crypto = require('crypto')
  , RedditStrategy = require('passport-reddit').Strategy;

var io = require('socket.io').listen(app.listen(port));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(busboy());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// stpid -> must be before passport middlewares.
app.use(cookieSession({
    keys: ['secret1', 'secret2']
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash())

var userCount = 0

// User.find({online: true}, function(err, users) {
//   // User.count({}, function( err, count) {
//   //    console.log( "userCount of users:", count );
//   //    userCount = count
//   // })
// })

app.post('/fileupload', function(req, res) {
    var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function(fieldname, file, filename) {
        console.log("Uploading: " + filename);
        fstream = fs.createWriteStream(__dirname + '/public/images/' + filename);
        file.pipe(fstream);
        fstream.on('close', function () {
            User.findOne({
            redditId: req.user.redditId },
            function(err, user) {
              // console.log(user)
              if (err) {
                // console.log(err)
                res.render('index', {user: req.user, onlineNow: userCount})
              }
              var image = ('/images/' + filename).toString()
              user.image = '/images/IMG_0613.jpg'
              console.log(image)
              // user.save(function(err) {
              //   // console.log(err)
              //   // if (err) { return next(err)}
              // })
            })
            res.render('index', {user: req.user, onlineNow: userCount})
        });
    });
});

function userCounting() {
  User.count({online: true}, function(err, c) {
     console.log('Count is ' + c);
     userCount = c
  });
  return userCount
}

userCounting()

// count = User.where('online').equals(true)
// this actually isn't querying the collection of users who are online now.

var REDDIT_CONSUMER_KEY = "l1XvvzL9PfQ4eA";
var REDDIT_CONSUMER_SECRET = "bkIGUIIWywbsa028C3RxNOR6YC0";

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new RedditStrategy({
    clientID: REDDIT_CONSUMER_KEY,
    clientSecret: REDDIT_CONSUMER_SECRET,
    callbackURL: "http://localhost:3000/auth/reddit/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({
      redditId: profile.id },
      function (err, user) {
        if (err) {
          return done(err, user);
        }
        if (!user) {
          user = new User({
            name: profile._json.name,
            redditId: profile.id,
            provider: 'reddit',
            online: true,
            image: '/images/reddit-black.png',
            reddit: profile._json
          });
          user.save(function(err) {
            if (err) console.log(err);
            return done(err, user);
          });
          console.log(user)
          return done(err, user)
        } else {
          //found user. Return
          console.log(user)
          return done(err, user);
        }
      });
    }
));

app.get('/messages', function(req, res) {
  io.sockets.emit('gettingMessages', {messages: messages})
  res.json(200, {messages: 'sent'})
})

app.post('/message', function(req, res) {
  var message = req.body.message;
  var userName = req.body.userName
  var messageTime = req.body.timeSubmit
  var messageImage = req.body.image

  console.log('working over here with message')
  if(_.isUndefined(message) || _.isEmpty(message.trim())) {
    return res.json(400, {error: "invalid message"})
  }

  // this below can be problematic. it should not be to all sockets emit this message,
  // but instead only some of them

  console.log('working over here')

  io.sockets.emit('incomingMessage', {message: message, userName: userName, messageTime: messageTime, messageImage: messageImage})
  messages.push({message: message, userName: userName, messageTime: messageTime})
  // message should be  sorted by time, where most recent is last
  // ex: [{user: 'raksonibs', time: Date.time.whenever+1, message: 'daadsasd'}]

  res.json(200, {message: 'recieved'})
})

app.get('/auth/reddit', function(req, res, next){
  req.session.state = crypto.randomBytes(32).toString('hex');
  passport.authenticate('reddit', {
    state: req.session.state,
    duration: 'permanent',
  })(req, res, next);
});

app.get('/auth/reddit/callback', function(req, res, next){
  // Check for origin via state token
  if (req.query.state == req.session.state) {
    passport.authenticate('reddit', {
      successRedirect: '/',
      failureRedirect: '/login'
    })(req, res, next);
  }
  else {
    next( new Error(403) );
  }
});

app.get('/logout', function(req, res) {
 if ( req.user !== undefined ) {
    User.findOne({
      redditId: req.user.redditId },
      function(err, user) {
         if (user === null || err) {
          res.render('index', {onlineNow: userCount})
        }
        if (user !== null) {
          user.online = false
          user.save(function(err) {
            if (err) { return next(err)}
          })
        }
      })
    userCount = userCounting()
    req.logout()
    res.render('index', {user: req.user, onlineNow: userCount})
  } else {
    userCount = userCounting()
    req.logout()
    res.render('index', {onlineNow: userCount})
  }
});

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

app.get('/', function(req,res) {
  console.log(req.user)
  if ( req.user !== undefined ) {
    User.findOne({
      redditId: req.user.redditId },
      function(err, user) {
        if (user === null || err) {
          res.redirect('/')
        }
        if (user !== null) {
          user.online = true
          user.save(function(err) {
            if (err) { return next(err)}
          })
        }
      })
    userCount = userCounting()
    res.render('index', {user: req.user, onlineNow: userCount})
  } else {
    userCount = userCounting()
    res.render('index', {onlineNow: userCount})
  }
})

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