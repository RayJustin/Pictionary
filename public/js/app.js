var socket = io();
var guesses = $('#guesses');
var word;

var addGuess = function(guess, name){
	if(name === undefined){
		name = 'You';
	}
	
	guesses.append('<div class="guess">'+ name + ': ' + guess + '</div>');

	if(guess === word){
		alert('Got it right');
	}
}

var pictionary = function(drawer) {
	var canvas, context;
	var drawing = false;
	var guessbox;

	var draw = function(position) {
		context.beginPath();
		context.arc(position.x, position.y, 6, 0, 2 * Math.PI);
		context.fill();
	};

	var onKeyDown = function(event){
		if(event.keyCode != 13){
			return;
		}
		var guess = guessbox.val()
		addGuess(guess);
		guessbox.val('');
		socket.emit('guess', guess);
	};
	
	guessbox = $('#guess input');
	guessbox.on('keydown', onKeyDown);

	canvas = $('#canvas');
	context = canvas[0].getContext('2d');
	canvas[0].width = canvas[0].offsetWidth;
	canvas[0].height = canvas[0].offsetHeight;

	if(drawer === true){

		//Allows drawing
		canvas.on('mousedown', function(){
			drawing = true;
		});

		//Stops drawing
		canvas.on('mouseup', function(){
			drawing = false;
		});

		//Handles drawing
		canvas.on('mousemove', function(event){
			if(drawing === false){
				return;
			}
			var offset = canvas.offset();
			var position = {
				x: event.pageX - offset.left,
				y: event.pageY - offset.top
			}
			socket.emit('draw', position);
			draw(position);
		});
	}

	socket.on('sendDraw', draw);
};


socket.on('connect', function(){
	var user = prompt('Enter your name!');
	socket.emit('newUser', user);
});

socket.on('addUser', function(user, role, draw){

	if(role === 'drawer'){
		drawer = true;
		word = draw;
		$('#word').text(draw);
	}

	else {
		drawer = false;
		$('#guess').show();
		$('#word').text('???');
	}

	pictionary(drawer);
});

socket.on('makeGuess', addGuess);


