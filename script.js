var myGamePiece;
var jumping = 0;
var dir = 0;
//Variables
const speed = 0.5;
const maxSpeed = 5;
const drag = 0.1;
const gravityconst = 0.3;
const jumpforce = 10;
const sidejump = 10;

//Math functions
const lerp = (x, y, a) => x * (1 - a) + y * a;
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

function startGame() {
  myGameArea.start();
  myGamePiece = new component(30, 30, "red", 10, 120);
}

var myGameArea = {
  canvas : document.createElement("canvas"),
  start : function() {
    this.canvas.width = 480;
    this.canvas.height = 270;
    this.context = this.canvas.getContext("2d");
    this.interval = setInterval(updateGameArea, 20);
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
  },
  clear : function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    } 
}

function updateGameArea() {
  myGameArea.clear();
  myGamePiece.newPos();
  myGamePiece.update();
  clampmove();
  colCheck();
  gravity();
}
       

function startjump() {
  jumping = 1;
  dir = 0;
}
function stopjump() {
  myGamePiece.speedY -= jumpforce;
  myGamePiece.speedX = dir*sidejump;
  jumping = 0;
}

function moveleft() {
  if (jumping) {
    dir = -1;
  }else {
  myGamePiece.speedX -= speed;
  }
}

function moveright() {
  if (jumping) {
    dir = 1;
  }else {
  myGamePiece.speedX += speed;
  }
}

function colCheck() {
  var floorpos = myGameArea.canvas.height - myGamePiece.height;
  if (myGamePiece.y > floorpos) {
    if (myGamePiece.speedY > 0) myGamePiece.speedY = 0;
    myGamePiece.y = floorpos;
  }
}

function gravity() {
  myGamePiece.speedY += gravityconst;
}

function clampmove() {
  myGamePiece.speedX = clamp(myGamePiece.speedX,-maxSpeed,maxSpeed);

  //Drag
  myGamePiece.speedX = lerp(myGamePiece.speedX,0,drag);

  
}

function component(width, height, color, x, y) {
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  this.update = function() {
    ctx = myGameArea.context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width,this.height);
    console.log(this.x + " "+this.y)
  }
  this.newPos = function() {
    this.x += this.speedX;
    this.y += this.speedY;
  }
}

document.addEventListener("keydown", keydown);
document.addEventListener("keyup", keyup);

function keydown() {

  switch (event.key) {
    case "w":
      startjump();
      break;
    case "a":
      moveleft();
      break;
    case "d":
      moveright();
      break;
    default:
      console.log(event.key, event.keyCode);
      return; 
  }

  event.preventDefault();
}
function keyup() {

  switch (event.key) {
    case "w":
      stopjump();
      break;
    default:
      console.log(event.key, event.keyCode);
      return; 
  }

  event.preventDefault();
}