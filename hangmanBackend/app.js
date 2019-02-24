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
    origin: 'http://localhost:4200'
}));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
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
const wordController = require('./controllers/wordController');



var fs = require('fs');
var Moniker = require('moniker');
const http = require('http').Server(app);
const io = require('socket.io')(http);
http.listen(3011);
var currentHangman = 'Evil AI';
nextHangman= 'Evil AI'

//'connection'-tapahtuma suoritetaan joka kerta kun joku clientin 
//socket yhdistää serverin socket.io moduliin. Parametrina
//oleva muuttuja socket on viittaus clientin socketiin
io.sockets.on('connection', function (socket) {
    emitHangmanToUser(socket);
    var user;
    socket.on('disconnect', function () {
        removeUser(user);
    });
    updateUsers()
    //Kun clientilta tulee 'joinGame' -tapahtuma 
    socket.on('joinGame', function (data) {
        console.log(data)
        user = addUser(data.user);
        socket.emit("welcome", user);
        
    });


    //Kun clientilta tulee 'message to server' -tapahtuma 
    socket.on('newQuess', function (data) {
        data.input = data.input.toLowerCase();
        var msg;
        console.log(data)
        if(/^([a-z]{1,1})$/.test(data.input)){
            console.log("letter");
            msg = data.user + ' quessed letter: '+ data.input;
        } else if (/^([a-z]{1,})$/.test(data.input)){
            //console.log("word");
            addWord('English', data.input);
            msg = data.user + ' quessed word: '+ data.input;
        }  else {         console.log("neither");    msg = data.user + 's quess was invalid.';
    }
       
        //Lähetetään tullut data takaisin kaikille clientin socketeille
        //emitoimalla tapahtuma 'message_to_client' jolla lähtee JSON-dataa
        io.sockets.emit("message_to_client", {
            message: msg
        });
    });
});
/*
var resetTheNumber = function () {
    theNumber = Math.floor((Math.random() * 100) + 1);
}
resetTheNumber();
//*/

// Pelissä olevien käyttäjien hallinnointi (lisäys, poisto ja listaus)
var users = [];

var getRandomWord = function (lang){
    return wordController.returnWord(lang);
}
var addWord = function (lang, word){
    wordController.putWordSocket(lang, word);
}

var emitHangmanToUser = function (socket){
    socket.emit("emitHangmanData", {
        hangman: currentHangman,
        nextHangman: nextHangman
    });
}
var emitHangmanToAll = function (){
    io.sockets.emit("emitHangmanData", {
        hangman: currentHangman,
        nextHangman: nextHangman
    });
}

var addUser = function (name) {
    var user = {
        username: name,
        score: 0
    }
    users.push(user);
    updateUsers();
    return user;
}
var removeUser = function (user) {
    for (var i = 0; i < users.length; i++) {
        if (user.username === users[i].username) {
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
        str += user.username+': ' + user.score ;
    }
    io.sockets.emit("users", {
        users: str
    });
}
//*/

module.exports = app;