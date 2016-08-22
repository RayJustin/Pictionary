var http = require('http');
var express = require('express');
var socket_io = require('socket.io');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

var userList = [];

io.on('connection', function(socket){

	socket.on('draw', function(position){
		socket.broadcast.emit('sendDraw', position);
	});

	socket.on('guess', function(guess){
		socket.broadcast.emit('makeGuess', guess, socket.username);
	});

	socket.on('newUser', function(user){
		userList.push(user);
		var role;
		var WORDS = [
    "word", "letter", "number", "person", "pen", "class", "people",
    "sound", "water", "side", "place", "man", "men", "woman", "women", "boy",
    "girl", "year", "day", "week", "month", "name", "sentence", "line", "air",
    "land", "home", "hand", "house", "picture", "animal", "mother", "father",
    "brother", "sister", "world", "head", "page", "country", "question",
    "answer", "school", "plant", "food", "sun", "state", "eye", "city", "tree",
    "farm", "story", "sea", "night", "day", "life", "north", "south", "east",
    "west", "child", "children", "example", "paper", "music", "river", "car",
    "foot", "feet", "book", "science", "room", "friend", "idea", "fish",
    "mountain", "horse", "watch", "color", "face", "wood", "list", "bird",
    "body", "dog", "family", "song", "door", "product", "wind", "ship", "area",
    "rock", "order", "fire", "problem", "piece", "top", "bottom", "king",
    "space"
		];
		var randWord = WORDS[Math.floor((Math.random() * 100) + 1)];
		if(user === userList[0]){
			role = 'drawer';
		}
		else {
			role = 'guesser';
		}
		socket.username = user;
		socket.emit('addUser', socket.username, role, randWord);
	});

	socket.on('disconnect', function(){
		userList.splice(userList.indexOf(socket.username), 1);
	});


});

server.listen(process.env.PORT || 8080, function(){
	console.log('Listening on Port: 8080');
});