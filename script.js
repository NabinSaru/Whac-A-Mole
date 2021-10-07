//Canvas Setup
const canvas = document.getElementById('canvas1');
const context = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;
context.fillStyle = 'black';
context.fillRect(0, 0, 800, 500);

//IMPORTS

// UI Controls 
const playBtn = new Image();
playBtn.src = 'UI/play.png';
const pauseBtn = new Image();
pauseBtn.src = 'UI/pause.png';
const exitBtn = new Image();
exitBtn.src = 'UI/exit.png';
const muteBtn = new Image();
muteBtn.src = 'UI/mute.png';
const restartBtn = new Image();
restartBtn.src = 'UI/restart.png';
const volumeBtn = new Image();
volumeBtn.src = 'UI/volume.png';
const titleScreen = new Image();
titleScreen.src = 'sky2.jpg';
const fgtitle = new Image();
fgtitle.src = 'titlefg.png';
const fgbase = new Image();
fgbase.src = 'fgbaseparallax.png';
const fgMole = new Image();
fgMole.src = 'mole_walk.png';


//Audio 
const bgm = new Audio('happy.mp3');
const hitfx = new Audio('hit.ogg');
const stunsfx = new Audio('dizzy.wav');
const timeupsfx = new Audio('buzz.wav');
const uiinteractionsfx = new Audio('ui-click.wav');
const openingbgm = new Audio('assets/bgm/449944__x3nus__sunny-theme.wav');

//INITIALIZATION GLOBAL
let score = 0;
let gameFrame = 0;
let gameTime = 60;
// context.font = '50px Georgia';
context.font = '50px HeartSweetHeart-Regular';
let gameSpeed = 1;
let gameOver = false;
let hammerRadius = 10;
let gameStarted = false;
let gamePaused = false;
//Time
let setGameTime;

openingbgm.volume = 0.5;
openingbgm.play();
openingbgm.loop = true;

const BG = {
  x1: 0,
  x2: canvas.width - 5,
  x3: 0,
  x4: -canvas.width + 5,
  y: 0,
  width: canvas.width,
  height: canvas.height,
  parallaxSpeed: 1
}

const MoleFgSprite = {
  width: 275,
  height: 275,
  frameX: 0
}

//Mouse Interactivity
let canvasPosition = canvas.getBoundingClientRect();
const mouse = {
  x: canvas.width/2,
  y: canvas.height/2,
  click: false
}
canvas.addEventListener('mousedown', function(event) {
  mouse.click = true;
  mouse.x = event.x - canvasPosition.left;
  mouse.y = event.y - canvasPosition.top;
})

canvas.addEventListener('mouseup', function() {
  mouse.click = false;
})

//PARALLAX and UI Animation
function handleParallax() {
  BG.x1 -= BG.parallaxSpeed;
  BG.x2 -= BG.parallaxSpeed;
  BG.x3 += BG.parallaxSpeed / 2;
  BG.x4 += BG.parallaxSpeed / 2;
  if(BG.x1 < -BG.width + 5) BG.x1 = BG.width - 5;
  if(BG.x2 < -BG.width + 5) BG.x2 = BG.width - 5;
  if(BG.x3 > BG.width - 5) BG.x3 = -BG.width + 5;
  if(BG.x4 > BG.width - 5) BG.x4 = -BG.width + 5;
  context.drawImage(titleScreen, BG.x1, BG.y, BG.width, BG.height);
  context.drawImage(titleScreen, BG.x2, BG.y, BG.width, BG.height);
  context.drawImage(fgbase, BG.x3, BG.y, BG.width, BG.height);
  context.drawImage(fgbase, BG.x4, BG.y, BG.width, BG.height);
  // context.drawImage(fgbase, 0, 0, BG.width, BG.height);
  context.drawImage(fgtitle, 0, 0, BG.width, BG.height);

  if ( gameFrame % 10 === 0) {
    MoleFgSprite.frameX++;
    if (MoleFgSprite.frameX > 5 ) MoleFgSprite.frameX = 0;
  }

  context.drawImage(fgMole, MoleFgSprite.frameX * MoleFgSprite.width, 0,  MoleFgSprite.width,  MoleFgSprite.height, 400 -100, 350 -100, 200, 200);
}

class UIButton {
  constructor(img1, img2, X, Y, width,  height, event, toggle) {
    this.img1 = img1;
    this.img2 = img2;
    this.x = X;
    this.y = Y;
    this.height = height;
    this.width = width;
    this.click = false;
    this.event = event;
    this.toggle = toggle;
    this.toggleSet = false; 
  }

  control() {
    if (mouse.click && (mouse.x >= this.x) && (mouse.x <= this.x + this.width) && (mouse.y > this.y) && (mouse.y <= this.y + this.height)) {
      if(!this.click) {
        uiinteractionsfx.play();
        this.event();
        this.click = true

        if(this.toggle) {
          this.toggleSet = !this.toggleSet;
        }
      }
    } else if (!mouse.click) {
      this.click = false;
    }

    this.draw();
  }

  draw() {
    if(this.toggle && this.toggleSet) {
      context.drawImage(this.img2, this.x, this.y, this.width, this.height);
    } else {
      context.drawImage(this.img1, this.x, this.y, this.width, this.height);
    }
  }
}

function resetGameSetting() {
  clearInterval(setGameTime);
  gameOver = false;
  gamePaused = false;
  score = 0;
  gameTime = 60;
  nums.clear();
  pauseBtnMini.toggleSet = false;
}

const playGame = () => {
  setTimeout(()=> {
    startGame();
  }, 1000);
}

const playPauseGame = () => {
  gamePaused = !gamePaused;
}

const restartGame = () => {
  resetGameSetting();
  startGame();
}

const toggleAudio = () => {
  if (bgm.volume == 0.5) {
    bgm.volume = 0;
  } else {
    bgm.volume = 0.5;
  }
}

const exitToHome = () => {
  gameStarted = false;
  resetGameSetting();
  bgm.pause();
  openingbgm.play();
}

const playBtnControl = new UIButton(playBtn, playBtn, 550, 380, 100, 100, playGame, false);
const pauseBtnMini = new UIButton(pauseBtn, playBtn, 730, 180, 60, 60, playPauseGame, true);
const restartBtnMini = new UIButton(restartBtn, restartBtn, 730, 340, 60, 60, restartGame, false);
const audioBtnMini = new UIButton(muteBtn, volumeBtn, 730, 260, 60, 60, toggleAudio, true);
const exitBtnMini = new UIButton(exitBtn, exitBtn, 730, 420, 60, 60, exitToHome, false);
const restartBtnCenter = new UIButton(restartBtn, restartBtn, 280, 300, 100, 100, restartGame, false);
const exitBtnCenter = new UIButton(exitBtn, exitBtn, 420, 300, 100, 100, exitToHome, false );
// const pauseBtnControl = new UIButton()

// if(document.readyState === 'loading') {
//   document.addEventListener('DOMContentLoaded',ready());
// } else {
//   ready();
// }

function drawTitleScreen() {
  handleParallax();
  playBtnControl.control();
  // context.drawImage(playBtn, 550, 380, 100, 100);
  context.drawImage(exitBtn, 680, 380, 100, 100);
}

function UI() {
  drawTitleScreen();
}

//GAME ANIMATIONS
//hammar animation
let hammerup = new Image();
hammerup.src = 'hammar up.png';
let hammerdown = new Image();
hammerdown.src = 'hammar down.png';

function mouseAnimation() {
  if (mouse.click) {
    context.drawImage(hammerdown, mouse.x - 80, mouse.y - 80, 160, 160);
  } else {
    context.drawImage(hammerup, mouse.x - 80, mouse.y - 80, 160, 160);
  }
}

//Moles
let previousX = 0;
let previousY = 0;
let mole = new Image();
mole.src = 'sprites.png';
const MoleState = {
  HIDDEN: 0,
  APPEAR: 1,
  FREEZE: 2,
  STUN: 3,
  STUNDISAPPEAR: 4,
  DISAPPEAR: 5
}

class Moles {
  constructor(index) {
    this.index = index;
    this.radius = 60;
    this.frameX = 0;
    this.frameY = 0;
    this.smashed = false;
    this.speed = Math.floor(Math.random()*7 + 1);
    this.delay = Math.floor(Math.random()*2 + 1) * 500;
    this.spriteWidth = 190;
    this.spriteHeight = 144;
    this.x = 0;
    this.y = 0;
    this.state = MoleState.HIDDEN;
  }

  init() {
    if (this.index < 3) {
      this.x = previousX + this.radius+ 110;
      this.y = this.radius + 105;
      previousX = this.x + this.radius;
    } else if (this.index < 5) {
      this.x = Math.floor((moleArray[this.index-3].x + moleArray[this.index -2].x)/2);
      this.y = (this.radius + 105) * 2;
    }
  }

  draw() {
    context.drawImage(mole, this.frameX * this.spriteWidth, this.frameY*this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x-90, this.y-80, this.radius*3, this.radius*2.7);
  }

  update() {
    if (gameFrame % (9 - this.speed) === 0) {
      if (this.state == MoleState.HIDDEN) {
        this.hidden();
      } else if (this.state === MoleState.APPEAR) {
        this.appear();
      } else if (this.state === MoleState.FREEZE) {
        this.freeze();
      } else if (this.state === MoleState.DISAPPEAR) {
        this.disappear();
      } else if (this.state === MoleState.STUN) {
        this.stun();
      } else if (this.state === MoleState.STUNDISAPPEAR) {
        this.stunDisappear();
      }
    }
  }

  hidden() {
  }

  appear() {
    if (this.frameX + 1 > 5) {
      this.frameX = 5;
      this.state = MoleState.FREEZE;
    } else {
      this.frameX ++;
    }
  }

  disappear() {
    if (this.frameX - 1 < 0) {
      this.frameX = 0;
      this.speed = Math.floor(Math.random()*7 + 1);
      if(nums.has(this.index)) DestroyMole(this.index);
      this.state = MoleState.HIDDEN;
    } else {
      this.frameX --;
    }
  }

  freeze() {
    setTimeout(()=> {
      this.state = MoleState.DISAPPEAR;
    },400)
  }

  stun() {
    if (this.frameX + 1 > 2) {
      this.frameX = 0;
    } else {
      this.frameX++;
    }
  }

  stunDisappear() {
    //Adjustment due to empty sprite sheet
    if(this.frameX + 1 > 2) {
      this.frameX = 0;
      this.frameY = 0;
      this.speed = Math.floor(Math.random()*7 + 1);
      if(nums.has(this.index)) DestroyMole(this.index);
      this.state = MoleState.HIDDEN;
    } else {
      this.frameX++;
    }
  }

  handleScore() {
    if (mouse.click && this.smashed === false && this.frameY === 0) {
      hitfx.play();
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if ((distance < hammerRadius + this.radius) && this.frameX >= 4) {
        this.smashed = true;
        score += this.frameX * 5;
        this.frameX = 0;
        this.frameY = 6;
        stunsfx.play();
        this.state = MoleState.STUN;
        setTimeout(()=> {
          this.frameX = 0;
          this.frameY = 7;
          this.state = MoleState.STUNDISAPPEAR;
          //PRE-CALLING EVENT RESET TO PREVENT MULTIPLE SET TIMEOUT IN STUN EVENT
        },400)
      }
    } else if (!mouse.click) {
      this.smashed = false;
    }
  }
}

function activateMoles() {
  let index = Math.floor(Math.random() * 5);
  if (moleArray[index].state === MoleState.HIDDEN) {
    setTimeout(()=> {
        moleArray[index].state = MoleState.APPEAR;
        moleArray[index].delay = Math.floor(Math.random()*2 + 1) * 500;
      }, moleArray[index].delay);
    activeMoles.push(index);
  } else {
    activateMoles();
  }
}

let nums = new Set();
const randomUnique = (range, count) => {
    while (nums.size < count) {
        nums.add(Math.floor(Math.random() * (range + 1)));
    }
    /* return [...nums]; */
}

function InitiateMole() {
  randomUnique(4,Math.floor(Math.random() * (3) + 1));
  nums.forEach((index) => {
    if (moleArray[index].state === MoleState.HIDDEN) {
      setTimeout(()=> {
        moleArray[index].state = MoleState.APPEAR;
        moleArray[index].delay = Math.floor(Math.random()*2 + 1) * 500;
      }, moleArray[index].delay);
    }
  })
}

function DestroyMole(index) {
  nums.delete(index);
}

//Animation Loop
function animate() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  if (gameStarted) {
    if( gameFrame % 100 === 0 && !gameOver) {
      InitiateMole();
    }
  
    for (let i = 0; i < 5; i++) {
      if (!gameOver) {       
        moleArray[i].update();
        moleArray[i].handleScore();
      }
      moleArray[i].draw();
    }
  
    if(gameOver) {
      restartBtnCenter.control();
      exitBtnCenter.control();
    } else {
      mouseAnimation();
      context.fillStyle = 'red';
      context.fillText('score: ' + score, 10, 50);
      context.fillText('time: ' + gameTime, 520,50);
      pauseBtnMini.control();
      audioBtnMini.control();
      restartBtnMini.control();
      exitBtnMini.control();
    }
  } else {
    UI();
  }

  requestAnimationFrame(animate);

  if(!gamePaused) {
    gameFrame ++;
  }
}

var moleArray = [];
let activeMoles = [];

function startGame() {
  openingbgm.pause();
  bgm.volume = 0.5;
  bgm.play();
  bgm.loop = true;
  gameStarted = true;

  for (let i = 0; i < 5; i++) {
    if (moleArray.length <= 5) {
      const mole = new Moles(i);
      moleArray.push(mole);
      mole.init();
    }
    moleArray[i].frameY = 0;
    moleArray[i].frameX = 0;
    moleArray[i].state = MoleState.HIDDEN;
    moleArray[i].draw();
  }

  // TODO: moleArray.length appearing 6 for 2nd or later times
  console.log(moleArray.length);

  setGameTime = setInterval(()=> {
    if(!gamePaused) gameTime--;
    if(gameTime <= 0) {
      gameOver = true;
      timeupsfx.play();
      bgm.pause();
      clearInterval(setGameTime);
    }
  }, 1000);
}

animate();

window.addEventListener('resize', ()=> {
  canvasPosition = canvas.getBoundingClientRect();
})
