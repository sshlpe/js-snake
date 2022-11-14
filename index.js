
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const botButton = document.getElementById('botButton');
document.body.addEventListener('keydown', keyDown);

const size = 25; // size of each pixel
const tileCount = canvas.clientWidth/size; // Number of pixels

let snake = [{x:tileCount/2*size, y: tileCount/2*size}];

let speed = 10; // fps
let velx = 0;
let vely = 0;

let apX = 0;
let apY = 0;

let bot = false;
let maxScore = 0;

const iq = 1;

function drawGame() {
	clearScreen();
	drawSnake();
	drawApple();
	changeSnakePosition();
	checkCollision(snake[0], true);
	if (bot) {
		botMove();
	}
	console.log(snake);
	drawScore();
	setTimeout(drawGame, 1000/speed); // speed times a second refresh 
}

function drawSnakePart(snakePart) {
	ctx.fillStyle = 'lightblue';  
  	ctx.strokestyle = 'darkblue';
  	ctx.fillRect(snakePart.x, snakePart.y, size, size);  
  	ctx.strokeRect(snakePart.x, snakePart.y, size, size);
}

function drawSnake() {
	snake.forEach(drawSnakePart);
}

function snakeGrow() {
	tail = snake.pop();
	snake.push(tail);
	snake.push(tail);
	if (snake.length - 1 > maxScore) {
		maxScore = snake.length - 1;
	}
}

function drawScore() {
	str = `Score: ${snake.length - 1} / Max score: ${maxScore}`;
	document.getElementById('score').innerHTML = str;
}

function drawApple() {
	ctx.fillStyle = 'red';
	ctx.fillRect(apX, apY , size, size);
}

function spawnApple() {
	apX = Math.floor(Math.random() * tileCount) * size;
	apY = Math.floor(Math.random() * tileCount) * size;
	let out_body = true;
	for (let elm of snake) {
		if (apX == elm.x && apY == elm.y){
			out_body = false;
		}
	}
	while (!out_body) {
		out_body = true;
     	for (let elm of snake) {
     		if (apX == elm.x && apY == elm.y){
     			out_body = false;
     		}
     	}
		apX = Math.floor(Math.random() * tileCount) * size;
		apY = Math.floor(Math.random() * tileCount) * size;		
	}
	return
}

function clearScreen() {
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight)
}

function changeSnakePosition() {
	let head = {x: snake[0].x + velx*size, y: snake[0].y + vely*size};
	snake.unshift(head);
	snake.pop();
}

function checkCollision(head, main) {
     if (head.x < 0 || head.x > canvas.clientWidth-size || head.y < 0 || head.y > canvas.clientHeight-size) {
		if (main) {
			reset();
		}
		return true
	}
	if (head.x == apX && head.y == apY) {
		if (main){
			spawnApple();
			snakeGrow();
		}
		return 1;
	}
	for (i in snake){
		//head = snake[0];
		if (i != 0 && head.x == snake[i].x && head.y == snake[i].y) {
			if (main) {
				reset();
			}
			return true
		}
	}
}

function keyDown(event) {
	if (event.keyCode == 38 || event.keyCode == 40){
		velx = 0;
		if (event.keyCode == 38 && vely != 1){
			vely = -1;
		} else if (event.keyCode == 40 && vely != -1) {
			vely = 1;
		}
	}
	if (event.keyCode == 37 || event.keyCode == 39){
		vely = 0;
		if (event.keyCode == 39 && velx != -1){
			velx = 1;
		} else if (event.keyCode == 37 && velx != 1) {
			velx = -1;
		}
	}
	if (event.keyCode == 80){//'p'.charCodeAt(0)){
		console.log(snake);
	}
	if (event.key == 'b') {
		bot = bot != true;
	}
}

function reset() {
	console.log('reset');
	snake = [{x:tileCount/2*size, y: tileCount/2*size}];
	velx = 0;
	vely = 0;
}

function botMove() {
	var botsnake = {...snake}; // {[x: v, y: v],...}
	
	if (vely != 0) {
		var possibles = [{dx: 0, dy: vely}, {dx: 1, dy: 0}, {dx: -1, dy: 0}];
	} else {
		var possibles = [{dx: velx, dy: 0}, {dx: 0, dy: 1}, {dx: 0, dy: -1}];
	}

	let minMove = {};
	let minValue = Math.pow(10,10);
	for (let vel of possibles) {
		let val = getValue(botsnake[0], vel.dx, vel.dy);
		if (val < minValue) {
			minValue = val;
			minMove = vel;
		}
	}
	velx = minMove.dx; 
	vely = minMove.dy;
}

function getValue(head, velx, vely) {
	newHead = {x: head.x + velx*size, y: head.y + vely*size};
	col = checkCollision(newHead, false)
	if (col === 1) {
		return -Infinity;
	} else if (col) {
		return Infinity
	}
	return Math.abs(apX - newHead.x) + Math.abs(apY - newHead.y);
}



botButton.onclick = () =>{
	bot = bot != true;
	str = botButton.innerHTML
	if (bot) {
		newStr = str.replace('Off', 'On');
	} else {
		newStr = str.replace('On', 'Off');
	}
	botButton.innerHTML = newStr;
}

drawGame();

