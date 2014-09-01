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

var messages = {};
var rooms = [];

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

var mysocket = null

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

app.use(cookieSession({
    keys: ['secret1', 'secret2']
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash())

app.use(function (req, res, next) {
  var format = req.param('format');

  if (format) {
    req.headers.accept = 'application/' + format;
  }

  next();
});

app.locals._ = require('underscore');
app.locals._.str = require('underscore.string');
app.locals.date_today = new Date().getHours();
app.locals.need_rooms = true;

var userCount = 0

app.get('/contact', function(req,res) {
  res.render('contact')
})

app.get('/rooms', function(req, res) {
  res.render('rooms', {rooms: rooms})
})

app.post('/fileupload', function(req, res) {
    var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function(fieldname, file, filename) {

        fstream = fs.createWriteStream(__dirname + '/public/images/' + filename);
        file.pipe(fstream);
        fstream.on('close', function () {
            User.findOne({
            redditId: req.user.redditId },
            function(err, user) {
              if (err) {
                res.render('index', {user: req.user, onlineNow: userCount})
              }
              var image = ('/images/' + filename).toString()
              user.image = '/images/IMG_0613.jpg'
            })
            res.render('index', {user: req.user, onlineNow: userCount})
        });
    });
});

function userCounting() {
  User.count({online: true}, function(err, c) {

     userCount = c
  });
  return userCount
}

userCounting()

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
            if (err)
            return done(err, user);
          });

          return done(err, user)
        } else {
          return done(err, user);
        }
      });
    }
));

app.get('/messages', function(req, res) {
  var room = req.query.room
  io.sockets.in(room).emit('gettingMessages', {room: room, messages: messages[room]})
  res.json(200, {messages: 'sent'})
})

io.sockets.on('connection', function(socket) {

  socket.on('leaveRoom', function(roomName) {
    var roomName = roomName.roomName
    socket.leave()
  })

  socket.on('room', function(room) {
    room = room
    socket.join(room);
  })
})

app.post('/message', function(req, res) {
  var message = req.body.message;
  var userName = req.body.userName
  var messageTime = req.body.timeSubmit
  var messageImage = req.body.image
  var room = req.body.room

  if(_.isUndefined(message) || _.isEmpty(message.trim())) {
    return res.json(400, {error: "invalid message"})
  }

  io.sockets.in(room).emit('incomingMessage', {room: room, message: message, userName: userName, messageTime: messageTime, messageImage: messageImage})
  messages[room] = messages[room] || []
  rooms.push(room)
  messages[room].push({room: room, message: message, userName: userName, messageTime: messageTime})
  res.json(200, {message: 'gotchya'})
})

app.get('/auth/reddit', function(req, res, next){
  req.session.state = crypto.randomBytes(32).toString('hex');
  passport.authenticate('reddit', {
    state: req.session.state,
    duration: 'permanent',
  })(req, res, next);
});

app.get('/auth/reddit/callback', function(req, res, next){

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

var routes = require('./routes/index');

app.get('/rooms/:room_id', function(req,res) {
  var room = req.params.room_id

  //note: res.render renders the html so can just put there if want
  res.format({
    json: function() {
      res.json(200, {user: req.user, onlineNow: userCount, room: room, messages: messages[room]})
    },

    html: function() {
      res.render('room', {user: req.user, onlineNow: userCount, room: room, messages: messages[room]})
    }

  })
})

app.get('/', function(req,res) {

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
    res.render('index', {user: req.user, onlineNow: userCount, rooms: rooms.slice(3)})
  } else {
    userCount = userCounting()
    res.render('index', {onlineNow: userCount, rooms: rooms.slice(3)})
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