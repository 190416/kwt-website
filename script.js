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
const yscrollstart = -50;
const scrollspeed = 0.1;

var platforms = [0];

//Math functions
const lerp = (x, y, a) => x * (1 - a) + y * a;
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

var yofset = 0;
var grounded;

function startGame() {
  myGameArea.start();
  myGamePiece = new component(30, 30, "image.png", 10, 120,"image");
  spawnplatform(score+platformdistance);
}

var myGameArea = {
  canvas: document.createElement("canvas"),
  start: function() {
    this.canvas.width = 480;
    this.canvas.height = 270;
    score = this.canvas.height;
    this.context = this.canvas.getContext("2d");
    this.interval = setInterval(updateGameArea, 20);
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
  },
  clear: function() {
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
  checkspawnplatform();
  Anim();

  //Scroll view

    yofset = lerp(yofset,myGamePiece.y-myGameArea.canvas.height+myGamePiece.height-yscrollstart,scrollspeed);
  
  //Update all platforms
  I = platforms.length;
  while (I > 0) {
    try {
      platforms[I].update();
    } catch { console.log("Object not platform") }
    I--;
  }



}

var score = 0;
const platformdistance = -80;
function checkspawnplatform() {
  console.log("Checking score of " + score);
  if (myGamePiece.y < score - platformdistance) {
    score = score + platformdistance;
    spawnplatform(score + platformdistance);
  }
}

const platformwidth = 40;
const platformsidedistance = 200
var lastplatform = 0;
const extraplatformdistance=60;
function spawnplatform(y = 0) {
  x = lastplatform + (Math.random()-0.5) * platformsidedistance;
  x = clamp(x,0,myGameArea.canvas.width);
  lastplatform = x;
  y = y - extraplatformdistance * Math.random();
  console.log("Spawning platform at " + x + " " + y);
  platforms.push(new component(platformwidth, 10, "gray", x, y,"color"));
}

function startjump() {
  jumping = 1;
  dir = 0;

}
function stopjump() {
  if (grounded == true) {
  myGamePiece.speedY -= jumpforce;
  myGamePiece.speedX = dir * sidejump;
  jumping = 0;
  grounded = false;
  }
}

function moveleft() {
  if (jumping) {
    dir = -1;
  } else {
    myGamePiece.speedX -= speed;
  }
}
function Anim() {

}

function moveright() {
  if (jumping) {
    dir = 1;
  } else {
    dir = 1;
    myGamePiece.speedX += speed;
  }
}

function colCheck() {
  //Floor
  var floorpos = myGameArea.canvas.height - myGamePiece.height;
  if (myGamePiece.y > floorpos) {
    if (myGamePiece.speedY > 0)   myGamePiece.speedY = 0;
    myGamePiece.y = floorpos;
    grounded = true;
  }

  //Check collision with platforms
  I = platforms.length;
  while (I > 0) {
    try {
      var collid = myGamePiece.collide(platforms[I])
      console.log("collision = " + collid);
      if (collid == 1 && myGamePiece.speedY > 0) {

        myGamePiece.speedY = 0;
        myGamePiece.y = platforms[I].y - myGamePiece.height;
        grounded = true;
      }
    } catch { console.log("Object not platform") }
    I--;
  }

}



function gravity() {
  myGamePiece.speedY += gravityconst;
}

function clampmove() {
  myGamePiece.speedX = clamp(myGamePiece.speedX, -maxSpeed, maxSpeed);

  //Drag
  myGamePiece.speedX = lerp(myGamePiece.speedX, 0, drag);


}
function component(width, height, color, x, y, type) {
  this.type = type;
  if (type == "image") {
    this.image = new Image();
    this.image.src = color;
  }
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  this.update = function() {
    ctx = myGameArea.context;
    if (type == "image") {
      ctx.drawImage(this.image,
        this.x,
        this.y-yofset,
        this.width, this.height);
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y-yofset, this.width, this.height);
    }
  }
  this.newPos = function() {
    this.x += this.speedX;
    this.y += this.speedY;
  }
  this.collide = function(otherobj) {
    var myleft = this.x;
    var myright = this.x + (this.width);
    var mytop = this.y +(this.height * 0.9);
    var mybottom = this.y + (this.height);
    var otherleft = otherobj.x;
    var otherright = otherobj.x + (otherobj.width);
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + (otherobj.height);
    var colliding = 1;
    if ((mybottom < othertop) ||
      (mytop > otherbottom) ||
      (myright < otherleft) ||
      (myleft > otherright)) {
      colliding = 0;
    }
    return colliding;
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