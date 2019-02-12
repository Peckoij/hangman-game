var createError = require('http-errors');
var express = require('express');
var path = require('path');
//var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');



var http = require('http');
var fs = require('fs');
var Moniker = require('moniker');

var theNumber = 50;

var app = http.createServer(function (req, res) {
  fs.readFile("client.html", 'utf-8', function (error, data) {
      res.writeHead(200, {
          'Content-Type': 'text/html'
      });
      res.write(data);
      res.end();
  });
}).listen(3010);
//var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'pug');

//app.use(logger('dev'));
//app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);
//app.use('/users', usersRouter);

//http-serveri joka laitetaan muuttujaan app tuottaa sivun client.html

console.log('Http server in port 3010');
// SocketIO
//Socket-serveri kuuntelee http-serveriä
var io = require('socket.io').listen(app);

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


module.exports = app;
