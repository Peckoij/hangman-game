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
const userController = require('./controllers/userController');


var fs = require('fs');
var Moniker = require('moniker');
const http = require('http').Server(app);
const io = require('socket.io')(http);
http.listen(3011);

/*
socket.io game logic starts

*/
var currentHangman = 'Evil AI';
var nextHangman = 'Evil AI';
var gameInProgress = false;
var users = [{
    username: 'Evil AI',
    score: 0
}];
var theWord; // The Word audience is trying to guess
var revWord; // Revealed word
var guessLeft;


//'connection'-tapahtuma suoritetaan joka kerta kun joku clientin 
//socket yhdistää serverin socket.io moduliin. Parametrina
//oleva muuttuja socket on viittaus clientin socketiin
io.sockets.on('connection', function (socket) {
    emitHangmanToUser(socket);
    var user;

    // Player disconnects
    socket.on('disconnect', function () {
        removeUser(user);
        endGame();
    });

    // Player joins game 
    socket.on('joinGame', function (data) {
        // console.log(data)
        user = addUser(data.user);
        socket.emit("welcome", user);
        checkGame();
    });


    //Event triggered every time player send new guess
    socket.on('newGuess', function (data) {
        data.input = data.input.toLowerCase();
        var msg;
        console.log(data)
        // if guess is just one letter, test using regex
        if (/^([a-z]{1,1})$/.test(data.input)) {
            //console.log("letter");
            // msg = data.user + ' guessed letter: ' + data.input;
            msg = handleGuessLetter(data.user, data.input);
            // if guess is word
        } else if (/^([a-z]{1,})$/.test(data.input)) {
            //console.log("word");
            addWord('English', data.input);
            // msg = data.user + ' guessed word: ' + data.input;
            msg = handleGuessWord(data.user, data.input);
            // finally if guess it neither single letter nor word
        } else {
            //console.log("neither");
            msg = data.user + 's guess "' + data.input + '" was invalid.';
        }
        emitGameStatus(msg);
    });
});
/*
var resetTheNumber = function () {
    theNumber = Math.floor((Math.random() * 100) + 1);
}
resetTheNumber();
//*/

// check current status of game, start new if no game going on
var checkGame = function () {
    if (gameInProgress) {
        return;
    } else {
        startNewGame();
    }
}
// end current game in no players present
var endGame = async function () {

    // if still users in game do nothing
    if (users.length > 1) {
        // if game is still in progress do nothing
        if (gameInProgress) {
            return;
        }
        await sleep(3000);
        startNewGame();
        return;
    }
    // but if all players have left end game and return to default state
    currentHangman = 'Evil AI';
    nextHangman = 'Evil AI';
    gameInProgress = false;
    // add score to NPC hangman
    userController.updateUserScore(users[arrayObjectIndexOf(users, 'Evil AI', "username")]);
    users[arrayObjectIndexOf(users, 'Evil AI', "username")].score = 0;

}

// Start new game run by AI or player hangman
var startNewGame = async function () {
    gameInProgress = false;
    emitGameStatus('New game will start shortly.')
    currentHangman = nextHangman;
    nextHangman = 'Evil AI';
    emitHangmanToAll();
    // Start game with player hangman
    if (currentHangman != 'Evil AI') {

    } else {
        // Start game with AI hangman
        theWord = await getRandomWord();
        console.log('Evil AI chose word: ' + theWord);
        if(!theWord){
            return endGame();
        }
        await blackoutWord(theWord);
        var msg;
        for (i = 3; i >= 0; i--) {
            msg = 'Game starts in ' + i + ' seconds';
            console.log(msg);
            if (i === 0) {
                gameInProgress = true;
                guessLeft = 5;
                msg = 'New game started, your hangman is ' + currentHangman;
                console.log(" GAME STARTS!!!");
            }
            emitGameStatus(msg);
            await sleep(1000);
        }
        if (users.length <= 1) {
            endGame();
        }


    }
}

/* Emit message to all players
word: current state of revWord variable
gameRunnin: true / false 
message: game status message
*/
var emitGameStatus = function (msg) {
    io.sockets.emit("gameStatus", {
        word: revWord,
        gameRunning: gameInProgress,
        message: msg,
        guessLeft: guessLeft
    });
}

// Make correct length string of asterixes and put it to var revWord to be send to players
var blackoutWord = function () {
    revWord = theWord.replace(/./g, '*');
}

// handle valid guesses for single letters, return message to players
var handleGuessLetter = function (user, guess) {
    var userIndex = arrayObjectIndexOf(users, user, "username"); // 1
    console.log(userIndex);
    //guessLeft--;
    if (revWord.includes(guess)) {
        return user + ' guessed already known letter: ' + guess + '. Stop wasting everyones time!';
    }
    if (theWord.includes(guess)) {
        for (i = 0; i < theWord.length; i++) {
            if (theWord[i] === guess) {
                revWord = revWord.substr(0, i) + guess + revWord.substr(i + 1);
                console.log(revWord);
            }
        }
        users[userIndex].score += 1;
        updateUsers();
        return user + ' guessed correct letter: ' + guess;
    } else {
        guessLeft--;
        if (guessLeft <= 0) {
            var msg = user + ' guessed incorrect letter: ' + guess + '. Hangman ' + currentHangman + ' won the game!';
            // if(currentHangman != 'Evil AI'){
            var hmIndex = arrayObjectIndexOf(users, currentHangman, "username");
            users[hmIndex].score += 10;
            // }
            revWord = theWord;
            updateUsers();
            gameInProgress = false;
            endGame();
            return msg;
        }
        return user + ' guessed incorrect letter: ' + guess;
    }
}
// handle valid guesses for single letters, return message to players
var handleGuessWord = function (user, guess) {
    var userIndex = arrayObjectIndexOf(users, user, "username"); // 1
    console.log(userIndex);
    //guessLeft--;
    if (theWord === guess) {
        users[userIndex].score += 5 + guessLeft;
        revWord = theWord;
        updateUsers();
        gameInProgress = false;
        endGame();
        return user + ' guessed correct word: ' + guess + '. Audience won the game!';

    } else {
        guessLeft--;
        if (guessLeft <= 0) {
            var msg = user + ' guessed incorrect word: ' + guess + '. Hangman ' + currentHangman + ' won the game!';
            // if(currentHangman != 'Evil AI'){
            var hmIndex = arrayObjectIndexOf(users, currentHangman, "username");
            users[hmIndex].score += 10;
            // }
            revWord = theWord;
            updateUsers();
            gameInProgress = false;
            endGame();
            return msg;
        }
        return user + ' guessed incorrect word: ' + guess;
    }
}

// Ingame user management, adding, removing and updating userlist. 
// Also functions attached to managing hangman role and emitting required data to all users
var getRandomWord = async function (lang) {
    if (!lang) {
        lang = 'English';
    }
    var word = await wordController.returnWord(lang);
    console.log(word);
    return word
}
var addWord = function (lang, word) {
    wordController.putWordSocket(lang, word);
}

var emitHangmanToUser = function (socket) {
    socket.emit("emitHangmanData", {
        hangman: currentHangman,
        nextHangman: nextHangman
    });
}
var emitHangmanToAll = function () {
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
    // console.log(users);

    return user;
}

// remove user from array, call database update for score
var removeUser = function (user) {
    if (!user) {
        return
    }
    userController.updateUserScore(user);
    for (var i = 0; i < users.length; i++) {
        if (user && user.username === users[i].username) {

            users.splice(i, 1);
            updateUsers();
            return;
        }
    }
    //console.log(users);

}
var updateUsers = function () {
    /*var str = '';
    for (var i = 0; i < users.length; i++) {
        var user = users[i];
        str += user.username+': ' + user.score ;
    }*/
    io.sockets.emit("updateUsers", {
        users
    });
}
//*/

// sleep function for coundowns
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

function arrayObjectIndexOf(myArray, searchTerm, property) {
    for (var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}

module.exports = app;