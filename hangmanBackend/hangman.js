var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var logger = require('morgan');
const app = express();
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var wordsRouter = require('./routes/words');
const mongoose = require('mongoose');


/// cors säätöjä
var cors = require('cors');
app.use(cors({
}));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('access-Control-Allow-Origin', '*');
    next();
  });

// CORS säädöt loppuu

// kantaan yhdistys
require('./dbconnection');
// mongoose scheemojen haku
require('./models/User');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/words', wordsRouter);


var fs = require('fs');
var Moniker = require('moniker');
const http = require('http').Server(app);
const io = require('socket.io')(http);
http.listen(3011);
var theNumber = 50;

//'connection'-tapahtuma suoritetaan joka kerta kun joku clientin 
//socket yhdistää serverin socket.io moduliin. Parametrina
//oleva muuttuja socket on viittaus clientin socketiin
io.sockets.on('connection', function (socket) {
  var user = addUser();
  socket.emit("welcome", user);
  socket.on('disconnect', function () {
      removeUser(user);
  });
  updateUsers()
  //Kun clientilta tulee 'message to server' -tapahtuma 
  socket.on('message_to_server', function (data) {
      console.log(data)
      var msg = data.user + ": "
      if (isNaN(data.message)) {
          msg = msg + " guess wasn't number"
      } else {
          msg = msg + data.message
          // win scenario
          if (data.message == theNumber) {
              msg = data.user + ' guessed the right number '+ theNumber;
              console.log(msg);
              resetTheNumber();
          } else if (data.message < theNumber) { // smaller than number
              msg = msg + " - too small";
          } else if (data.message > theNumber) { // grater than number
              msg = msg + " - too big"
          }
      }

      //Lähetetään tullut data takaisin kaikille clientin socketeille
      //emitoimalla tapahtuma 'message_to_client' jolla lähtee JSON-dataa
      io.sockets.emit("message_to_client", {
          message: msg
      });
  });
});



var resetTheNumber = function () {
  theNumber = Math.floor((Math.random() * 100) + 1);
}
resetTheNumber();

var users = [];

var addUser = function () {
  var user = {
      name: Moniker.choose(),
      clicks: 0
  }
  users.push(user);
  updateUsers();
  return user;
}
var removeUser = function (user) {
  for (var i = 0; i < users.length; i++) {
      if (user.name === users[i].name) {
          users.splice(i, 1);
          updateUsers();
          return;
      }
  }
}
var updateUsers = function () {
  var str = '';
  for (var i = 0; i < users.length; i++) {
      var user = users[i];
      str += user.name + ' <small>(' + user.clicks + ' clicks)</small>';
  }
  io.sockets.emit("users", {
      users: str
  });
}
//*/

module.exports = app;
