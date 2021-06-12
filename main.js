const fieldCanvas = document.getElementById('field');
const ctx = fieldCanvas.getContext("2d");

const timerCanvas = document.getElementById('timer');
const ctxt = timerCanvas.getContext("2d");

const scoreCanvas = document.getElementById('score');
const ctxs = scoreCanvas.getContext("2d");
ctxs.font = "40px Comic Sans MS";
ctxs.fillStyle = "white";
ctxs.textAlign = "center";

let windowHeight = window.innerHeight;
let windowWidth = window.innerWidth;

// number of rows ond columns in the fieldCanvas
const ROW = 30;
const COL = 30;

const VACANT = "black";
const FOOD = "#d65522";
const BFOOD = "orange";
const HEAD = "#10cc52";   
const BODY = "#2261d6";
const WALL = "#99000f"

// size of square
var SQ = 25;

// delay in between setInterval calls
var delay = 200;

if(windowWidth < windowHeight) {
	SQ = Math.floor((windowHeight*0.8)/30);
	fieldCanvas.height = SQ*ROW;
	fieldCanvas.width = SQ*COL;
	document.querySelector('.instructions').style.display = 'none';
	document.querySelector('.score').style.display = 'none';
}
else {
	SQ = Math.floor((windowHeight*0.8)/30);
	fieldCanvas.height = SQ*ROW;
	fieldCanvas.width = SQ*COL;
}

console.log('canvas height', fieldCanvas.height);
console.log('canvas width', fieldCanvas.width);





// Function to draw a square tile
function drawSquare(x, y, color) {
	ctx.fillStyle = color;
	ctx.fillRect(x*SQ, y*SQ, SQ, SQ);
	// ctx.strokeRect(x*SQ, y*SQ, SQ, SQ);
}


function drawCircle(x, y, color) {
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc((x*SQ)+(SQ/2), (y*SQ)+(SQ/2), SQ/2, 0, 2*Math.PI, false);
	ctx.fill();
}

function drawBigCircle(y, x, color) {
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc((x*SQ)+(SQ/2), (y*SQ)+(SQ/2), SQ/1.5, 0, 2*Math.PI, false);
	ctx.fill();
}

// Class for Board
class Board {
	constructor() {
		this.row = ROW;
		this.col = COL;
		this.board = [];
		this.color = VACANT;
	}

	setup() {
		for(let r = 0; r < this.row; r++) {
			this.board[r] = [];
			for(let c = 0; c < this.col; c++) {
				if(r == 0 || c == 0 || r == this.row-1 || c == this.col-1) {
					this.board[r][c] = WALL;
				}
				else {
					this.board[r][c] = this.color;
				}
			} 
		}
	}
	
	draw() {
		for(let r = 0; r < this.row; r++) {
			for(let c = 0; c < this.col; c++) {
				drawSquare(c, r, VACANT);
			}
		}
		for(let r = 0; r < this.row; r++) {
			for(let c = 0; c < this.col; c++) {
				if(!(this.board[r][c] == BFOOD)) {
					drawCircle(c, r, this.board[r][c]);
				}
			}
		}
		if(food.bigFoodPresent) {
			drawBigCircle(food.bx, food.by, BFOOD);
		}
		if(!document.hasFocus()) {
			console.log("Document has lost focus.");
			game.pause();
		}
	}
}

// Class for Snake
class Snake {
	constructor() {
		this.length = 1;
		this.headx = Math.floor(Math.random() * (board.row - 3)) +1;
		this.heady = Math.floor(Math.random() * (board.col - 3)) +1;
		this.tailx = this.headx;
		this.taily = this.heady;
		this.color = HEAD;
		this.collider = VACANT;
		this.foodEaten = 0;
		this.bigFoodEaten = 0;
		// 0 -> right, 1 -> down, 2 -> left, 3 -> up
		if(this.heady <= board.col - this.heady) {
			if(this.headx <= this.heady) {
				this.direction = 1;
			}
			else {
				this.direction = 0;
			}
		}
		else {
			if(this.heady <= this.headx) {
				this.direction = 3;
			}
			else {
				this.direction = 2;
			}
		}

		this.foodPoint = [];
		this.turnPoint = [];
		this.lastTail = [];
	}

	draw() {
		board.board[this.headx][this.heady] = HEAD;
		if(this.length == 2) {
			switch(this.direction) {
				case 0:
					this.taily = this.heady - 1;
					this.tailx = this.headx;
					break;
				case 1:
					this.tailx = this.headx - 1;
					this.taily = this.heady;
					break;
				case 2:
					this.taily = this.heady + 1;
					this.tailx = this.headx;
					break;
				case 3:
					this.tailx = this.headx + 1;
					this.taily = this.heady;
					break;
				default:
					break;
			}
			board.board[this.tailx][this.taily] = BODY;
		}
		else if(this.length > 2){
			if(this.turnPoint.length > 0) {
				let previousPoint = new Array(this.headx, this.heady);
				let start = 0;
				let end = 0;
				this.turnPoint.reverse();
				this.turnPoint.forEach((point, index) => {
					board.board[point[0]][point[1]] = BODY;
					if(point[0] == previousPoint[0]) {
						if(point[1] > previousPoint[1]) {
							start = previousPoint[1];
							end = point[1];
						}
						else {
							start = point[1];
							end = previousPoint[1];
						}
						for(let i = start + 1; i < end; i++) {
							board.board[point[0]][i] = BODY;
						}
					}
					else {
						if(point[0] > previousPoint[0]) {
							start = previousPoint[0];
							end = point[0];
						}
						else {
							start = point[0];
							end = previousPoint[0];
						}
						for(let i = start + 1; i < end; i++) {
							board.board[i][point[1]] = BODY;
						}
					}
					previousPoint = point;
				});
				this.turnPoint.reverse();
				start = 0;
				end = 0;
				let point = this.turnPoint[0];
				if(point[0] == this.tailx) {
					if(point[1] > this.taily) {
						start = this.taily;
						end = point[1];
					}
					else {
						start = point[1];
						end = this.taily;
					}
					for(let i = start + 1; i < end; i++) {
						board.board[this.tailx][i] = BODY;
					}
				}
				else {
					if(point[0] > this.tailx) {
						start = this.tailx;
						end = point[0];
					}
					else {
						start = point[0];
						end = this.tailx;
					}
					for(let i = start + 1; i < end; i++) {
						board.board[i][this.taily] = BODY;
					}
				}
			}
			else {
				switch(this.direction) {
					case 0:
						this.taily = this.heady - (this.length - 1);
						this.tailx = this.headx;
						break;
					case 1:
						this.tailx = this.headx - (this.length - 1);
						this.taily = this.heady;
						break;
					case 2:
						this.taily = this.heady + (this.length - 1);
						this.tailx = this.headx;
						break;
					case 3:
						this.tailx = this.headx + (this.length - 1);
						this.taily = this.heady;
						break;
					default:
						break;
				}
				board.board[this.tailx][this.taily] = BODY;
				if(this.headx == this.tailx) {
					let start = 0;
					let end = 0;
					if(this.heady > this.taily) {
						start = this.taily;
						end = this.heady;
					}
					else {
						start = this.heady;
						end = this.taily;
					}
					for(let i = start + 1; i < end; i++) {
						board.board[this.headx][i] = BODY;
					}
				}
				else {
					let start = 0;
					let end = 0;
					if(this.headx > this.tailx) {
						start = this.tailx;
						end = this.headx;
					}
					else {
						start = this.headx;
						end = this.tailx;
					}
					for(let i = start + 1; i < end; i++) {
						board.board[i][this.heady] = BODY;
					}
				}
			}
		}
		return this;
	}

	move() {
		this.lastTail = new Array(this.tailx, this.taily);
		board.board[this.tailx][this.taily] = VACANT;
		if(this.length == 1) {
			switch(this.direction) {
				case 0:
					this.heady++;
					this.taily++;
					break;
				case 1:
					this.headx++;
					this.tailx++;
					break;
				case 2:
					this.heady--;
					this.taily--;
					break;
				case 3:
					this.headx--;
					this.tailx--;
					break;
				default:
					break;
			}
		}
		else if(this.length == 2) {
			this.tailx == this.headx;
			this.taily == this.heady;
			switch(this.direction) {
				case 0:
					this.heady++;
					break;
				case 1:
					this.headx++;
					break;
				case 2:
					this.heady--;
					break;
				case 3:
					this.headx--;
					break;
				default:
					break;
			}
		}
		else {
			if(this.turnPoint.length > 0) {
				switch(this.direction) {
					case 0:
						this.heady++;
						break;
					case 1:
						this.headx++;
						break;
					case 2:
						this.heady--;
						break;
					case 3:
						this.headx--;
						break;
					default:
						break;
				}
				let point = this.turnPoint[0];
				if(point[0] == this.tailx) {
					if(point[1] > this.taily) {
						this.taily++;
					}
					else {
						this.taily--;
					}
				}
				else {
					if(point[0] > this.tailx) {
						this.tailx++;
					}
					else {
						this.tailx--;
					}
				}
			}
			else {
				switch(this.direction) {
					case 0:
						this.heady++;
						this.taily++;
						break;
					case 1:
						this.headx++;
						this.tailx++;
						break;
					case 2:
						this.heady--;
						this.taily--;
						break;
					case 3:
						this.headx--;
						this.tailx--;
						break;
					default:
						break;
				}	
			}
		}
		return this;
	}

	checkTail() {
		if(this.turnPoint.length > 0) {
			let point = this.turnPoint.shift();
			if(!(this.tailx == point[0] && this.taily == point[1])) {
				this.turnPoint.unshift(point);
			}
		}
		return this;
	}

	checkCollision() {
		if(board.board[this.headx][this.heady] != VACANT) {
			this.collider = board.board[this.headx][this.heady];
			if(this.collider == FOOD) {
				let temp = new Array(this.headx, this.heady);
				this.foodPoint.push(temp);
				this.foodEaten++;
				game.updateScore();
				this.collider = VACANT;
				food.draw();
			}
			else if(this.collider == BFOOD) {
				let temp = new Array(this.headx, this.heady);
				this.foodPoint.push(temp);
				this.bigFoodEaten++;
				game.updateScore();
				drawBigCircle(this.headx, this.heady, VACANT);
				food.bigFoodPresent = false;
				this.collider = VACANT;
				// clearInterval(loop1);
				// clearInterval(loop2)
				food.bigFood();
				// timer.draw();
				timer.reset();
				// loop1 = setInterval("food.bigFood()", 1000 * 10);
				// loop2 = setInterval("timer.draw()", 1000);

			}
			else {
				menuContainer.getElementsByTagName("p")[0].innerHTML = "Game Over";
				menu[0].innerHTML = "Play Again";
				menuContainer.classList.remove("hide");
				game.over = true;
				return;
			}
		}
		return this;
	}

	changeDirection(direction) {
		clearInterval(loop);
		if(snake.length > 2) {
			let temp = new Array(this.headx, this.heady);
			this.turnPoint[this.turnPoint.length] = temp;
		}
		this.direction = direction;
		game.play();
		loop = setInterval("game.play()", delay);
	}

	grow() {
		if(this.foodPoint.length > 0) {
			let temp = this.foodPoint.shift();
			if(this.tailx == temp[0] && this.taily == temp[1]) {
				this.length++;
				this.tailx = this.lastTail[0];
				this.taily = this.lastTail[1];
				this.turnPoint.unshift(temp);
			}
			else {
				this.foodPoint.unshift(temp);
			}
		}
	}
}

// Class for Food
class Food {
	constructor() {
		this.x = Math.floor(Math.random() * (board.row - 3)) +1;
		this.y = Math.floor(Math.random() * (board.col - 3)) +1;
		this.bx = 0;
		this.by = 0;
		this.color = FOOD;
		this.wait = false;
		this.bigFoodPresent = false;
	}

	draw() {
		while(board.board[this.x][this.y] != VACANT) {
			this.x = Math.floor(Math.random() * (board.row - 3)) +1;
			this.y = Math.floor(Math.random() * (board.col - 3)) +1;
		}
		board.board[this.x][this.y] = this.color;
	}

	bigFood() {
		if(this.wait) {
			board.board[this.bx][this.by] = VACANT;
			this.bigFoodPresent = false;
			this.wait = false;
		}
		else {
			if(!this.bigFoodPresent) {
				do {
					this.bx = Math.floor(Math.random() * (board.row - 3)) +1;
					this.by = Math.floor(Math.random() * (board.col - 3)) +1;
				} while(board.board[this.bx][this.by] != VACANT);
				board.board[this.bx][this.by] = BFOOD;
				drawBigCircle(this.bx, this.by, BFOOD);
				this.bigFoodPresent = true;
				this.wait = true;
			}
		}
	}
}

// Class for Timer
class Timer {
	constructor() {
		this.timeLeft = 1;
		this.division = 20;
	}

	reset() {
		this.timeLeft = 1;
	}

	draw() {
		if(this.timeLeft >= 400/(delay/this.division) || this.timeLeft <= 0) {
			food.bigFood();
		}
		ctxt.fillStyle = VACANT;
		ctxt.fillRect(0, 0, 400, 40);
		ctxt.fillStyle = BFOOD;
		for(let i = 0; i < this.timeLeft; i++) {
			ctxt.fillRect(i * delay/this.division, 0, delay/this.division, 40);
		}
		ctxt.lineWidth = 10;
		ctxt.strokeRect(0, 0, 400, 40);
		if(food.bigFoodPresent) {
			this.timeLeft--;
		}
		else {
			this.timeLeft++;
		}
	}
}

// Class for Game
class Game {
	constructor() {
		this.score = -5;
		this.over = false;
		this.paused = true;
	}

	init() {
		initialSetup();
	}

	play() {
		snake.move().checkTail().checkCollision();
		if(!this.over) {
			snake.draw().grow();
			board.draw();
		}
		else {
			clearInterval(loop);
			clearInterval(loop2);
			console.log("Snake has hit the", snake.collider);
			console.log('Game Over!!!');
		}
	}

	updateScore() {
		if(snake.collider == BFOOD) {
			this.score += 10;
		}
		else {
			this.score += 5;
		}
		ctxs.textAlign = "center";
		ctxs.fillStyle = "rgb(18, 80, 131)";
		ctxs.fillRect(0, 0, scoreCanvas.width, scoreCanvas.height);
		ctxs.fillStyle = food.color;
		
		
		
		ctxs.beginPath();
		ctxs.arc(100-SQ/2, 50-SQ/2, SQ/2, 0, 2*Math.PI, false);
		ctxs.fill();
		ctxs.font = "30px Comic Sans MS";
		ctxs.fillStyle = "white";
		ctxs.fillText(snake.foodEaten, scoreCanvas.width/2, 50);
		ctxs.fillStyle = BFOOD;
		ctxs.beginPath();
		ctxs.arc(100-SQ/2, 100-SQ/2, SQ/1.5, 0, 2*Math.PI, false);
		ctxs.fill();
		ctxs.fillStyle = "white";
		ctxs.fillText(snake.bigFoodEaten, scoreCanvas.width/2, 100);
		let text = "Length: " + snake.length;
		ctxs.fillText(text, scoreCanvas.width/2, 200);
		ctxs.font = "40px Comic Sans MS";
		ctxs.fillStyle = "white";
		text = "Score: " + this.score;
		ctxs.fillText(text, scoreCanvas.width/2, scoreCanvas.height - 10);
	}

	pause() {
		console.log("Game Paused");
		clearInterval(loop);
		clearInterval(loop2);
		this.paused = true;
		menuContainer.classList.remove("hide");
		menu[0].innerHTML = "Resume";
	}

	quit() {
		console.log("Quitting...");
	}
}

// Event listener for keydown event
document.addEventListener("keydown", CONTROL);
function CONTROL(event) {
	if(typeof game != "undefined") {
		if(!game.paused) {
			switch(event.keyCode) {
				case 37:	// For left-key
				if(snake.direction %2 == 1) {
					snake.changeDirection(2);
				}
				break;
				case 38:	// For up-key
				if(snake.direction %2 == 0) {
					snake.changeDirection(3);
				}
				break;
				case 39:	// For right-key
				if(snake.direction %2 == 1) {
					snake.changeDirection(0);
				}
				break;
				case 40:	// For down-key
				if(snake.direction %2 == 0) {
					snake.changeDirection(1);
				}
				break;
				default:
					break;
			}
		}
	}
}

var menuContainer = document.getElementsByClassName("menuContainer")[0];
var menu = menuContainer.getElementsByClassName("menu")[0].getElementsByTagName("div");
menu[0].addEventListener("click", run);
menu[1].addEventListener("click", end);

function initialSetup() {
	board = new Board();
	snake = new Snake();
	food = new Food();
	timer = new Timer();
	board.setup();
	snake.draw();
	food.draw();
	board.draw();
	timer.draw();
	game.updateScore();
}


function run() {
	if(menu[0].innerHTML == "Play" || menu[0].innerHTML == "Play Again") {
		game = new Game();
		game.init();
		console.log("Starting game...");
	}
	else {
		console.log("Resuming game");
	}
	menuContainer.classList.add("hide");
	loop = setInterval("game.play()", delay);
	loop2 = setInterval("timer.draw()", delay);
	game.paused = false;
}

function end() {
	console.log("This needs some work to be done...");
}
