// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 800;
document.body.appendChild(canvas);


// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";
//Sound
const sound = new Audio("sound/Pikaaaa.mp3");
// trainer image
var trainerReady = false;
var trainerImage = new Image();
trainerImage.onload = function () {
	trainerReady = true;
};
trainerImage.src = "images/sprite-animation.png";

// Pikachu image
var pikachuReady = false;
var pikachuImage = new Image();
pikachuImage.onload = function () {
	pikachuReady = true;
};
pikachuImage.src = "images/pikachu.png";


// Game objects
var trainer = {
	speed: 256, // movement in pixels per second
	x: 0,
	y: 0
};
var pikachu = {
	x: 0,
	y: 0
};
var pikachusCaught = 0;

// Handle keyboard controls
var keysDown = {};

//**********************SPRITE ANIMATION*********************

var rows = 4; 
var cols = 4;

var trackRight = 2;
var trackLeft = 1; 
var trackUp = 3; 
var trackDown = 0;

var spriteWidth = 256; 
var spriteHeight = 256; 
var width = spriteWidth/cols;
var height = spriteHeight / rows; 

var curXFrame = 0; 
var frameCount = 4; 
var srcX = 0; 
var srcY = 0; 

var left = false; 
var right = true; 
var up = false; 
var down = false;

var counter = 1;
//**********************SPRITE ANIMATION*********************

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a pikachu
var reset = function () {
	trainer.x = canvas.width / 2;
	trainer.y = canvas.height / 2;

	// Throw the pikachu somewhere on the screen randomly
	pikachu.x = 32 + (Math.random() * (canvas.width - 128));
	pikachu.y = 32 + (Math.random() * (canvas.height - 128));
};

// Update game objects
var update = function (modifier) {
	ctx.clearRect(trainer.x,trainer.y,width,height);
	left = false; 
	right = false; 
	down = false;
	up = false;

	if (38 in keysDown && trainer.y > (32+4)) { // Player holding up (32+4)
		up= true; 
		trainer.y -= trainer.speed * modifier;
	}
	if (40 in keysDown && trainer.y < canvas.height-(96+2)) { // Player holding down canvas.height-(96+2)
		down = true;
		trainer.y += trainer.speed * modifier;
	}
	if (37 in keysDown && trainer.x > (32+4)) { // Player holding left (32+4)
		left = true;
		trainer.x -= trainer.speed * modifier;
	}
	if (39 in keysDown && trainer.x < canvas.width-(96+2)) { // Player holding right canvas.hwidth-(96+2)
		right = true; 
		trainer.x += trainer.speed * modifier;
	}

	// Are they touching?
	if (
		trainer.x <= (pikachu.x + 64)
		&& pikachu.x <= (trainer.x + 64)
		&& trainer.y <= (pikachu.y + 64)
		&& pikachu.y <= (trainer.y + 64)
	) {
		++pikachusCaught;
		sound.play();
		reset();
	}
	
	//To pick frame of sprite
	//curXFrame = ++curXFrame % frameCount; 
	//slow sprite animation 
	if (counter == 5){
		curXFrame = ++curXFrame % frameCount; 
		counter = 0;
	}
	else{ 
		counter++;
	}
	srcX = curXFrame * width;
	if (left){
		srcY = trackLeft * height;
	}
	if (right){ 
		srcY = trackRight * height; 
	}
	if (up){
		srcY = trackUp * height;
	}
	if (down){
		srcY = trackDown * height;
	}
	if (left == false && right == false && up == false && down == false){
		srcX = 1 * width; 
		srcY = 2 * height; 
	}
};

// Draw everything
var render = function () {

	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (trainerReady){
		ctx.drawImage(trainerImage,srcX, srcY, width, height, trainer.x, trainer.y,width, height);
	}

	if (pikachuReady) {
		ctx.drawImage(pikachuImage, pikachu.x, pikachu.y);
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	if (pikachusCaught >= 5) {
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.font = "100px arial";
		ctx.fillStyle = "black";
        ctx.strokeText("YOU WON!", canvas.width / 2, (canvas.height / 2) - 90);
        trainerReady = false;
        pikachuReady = false;
    }
	else {
		ctx.fillStyle = "black";
		ctx.fillText("Goblins caught: " + pikachusCaught, 45, 50);
	}
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};



// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();