// Dom Elements
const gameGrid = document.querySelector('.game');
const score = document.querySelector('.score');
const startScreen = document.querySelector('.start-screen');
const startButton = document.querySelector('.play-button');
const restartButton = document.querySelector('.restart-button');
const gameOverScreen = document.querySelector('.game-over-screen');
const gameOverStatus = document.querySelector('.game-over');
const exitButton = document.querySelector(".exit-button");
const rlButton = document.querySelector(".rl-button");
const instructionButton = document.querySelector(".instructions-button");
const instructions = document.querySelector(".instructions");
const menuButton = document.querySelector(".menu-button");
const homeButton = document.querySelector(".home-button");
const menu = document.querySelector(".menu");
const rlStats = document.querySelector(".rl-stats");
const stats = document.querySelector(".stats");
const foodWeight = document.querySelector(".food-weight");
const pillWeight = document.querySelector(".pill-weight");
const ghostWeight = document.querySelector(".ghost-weight");
const foodDist = document.querySelector(".food-dist");
const pillDist = document.querySelector(".pill-dist");
const ghostDist = document.querySelector(".ghost-dist");
const runningEpisode = document.querySelector(".runningepisode");
const state = document.querySelector(".state");
let mode= GAMEMODE.PLAYGAME;

// Game constants
const GLOBAL_SPEED = 80; //80 ms

const gameBoard = GameBoard.createGameBoard(gameGrid, LAYOUT);


soundDot='./sounds/munch.wav';
soundPill= './sounds/pill.wav';
soundGameStart= './sounds/game_start.wav';
soundGameOver= './sounds/death.wav';
soundGhost ='./sounds/eat_ghost.wav';


function showGameStatus(gameWin) {
  // Create and show game win or game over
  gameOverStatus.innerHTML = `${gameWin ? 'WIN!' : 'GAME OVER!'}`;
}

function playAudio(audio) {
    const soundEffect = new Audio(audio);
    soundEffect.play();
  }

function gameOver(mode){
  clearInterval(timer);
  if(!gameBoard.isComplete){
    resume=setTimeout(function(){
      timer = setInterval(() => gameLoop(), GLOBAL_SPEED);
    }, 500)
  }


  if(!gameBoard.gameWin){
    playAudio(soundGameOver);
  }

  gameBoard.gameOver();

  if(gameBoard.isComplete){

    //TODO: for text summarizing window 
  // if(mode===GAMEMODE.PLAYGAME){
  clearTimeout(resume);
  showGameStatus(gameBoard.gameWin);
  gameOverScreen.classList.remove('hide');
  stats.classList.add("hide");
  homeButton.classList.add("hide");
  // }

  // else{
    // gameOverScreen.classList.add('hide');
    // startScreen.classList.remove("hide");
    // homeButton.classList.add("hide");
    // stats.classList.add("hide");
    // clearInterval(timer);
    //show summarizing bar 
  // }
 
  }

}

function showInstructions(){
  instructions.classList.remove("hide");
  menu.classList.add("hide");
}

function showMenu(){
  instructions.classList.add("hide");
  menu.classList.remove("hide");
}


function gameLoop(){
  const {dotEatenSound, pillEatenSound, eatsGhost} = gameBoard.updatePacman();  
  const {ghostIsEaten} = gameBoard.updateGhost();  

    if (dotEatenSound) playAudio(soundDot);
    if (pillEatenSound) playAudio(soundPill);
    if (ghostIsEaten|| eatsGhost) playAudio(soundGhost);

  gameBoard.renderUpdate();
  gameBoard.updateStats(score,foodWeight,pillWeight,ghostWeight,foodDist,pillDist,ghostDist,runningEpisode, state)

  if (gameBoard.isGameOver) {
    gameOver();
  }

}



function showStartScreen(){
  gameOverScreen.classList.add('hide');
  startScreen.classList.remove("hide");
  homeButton.classList.add("hide");
  stats.classList.add("hide");
  clearInterval(timer);

}

function startGame(){
  mode= GAMEMODE.PLAYGAME;
  rlStats.classList.add("hide");
  Game(mode);
}

function rlSimulate(){
  mode = GAMEMODE.RL;
  rlStats.classList.remove("hide");
  Game(mode);
}

function Game(mode){ 
  gameOverScreen.classList.add('hide');
  startScreen.classList.add('hide');
  playAudio(soundGameStart);
  stats.classList.remove('hide');
  homeButton.classList.remove('hide');
  gameBoard.init(mode); 
  gameBoard.updateStats(score,foodWeight,pillWeight,ghostWeight,foodDist,pillDist,ghostDist,runningEpisode, state)
  timer = setInterval(() => gameLoop(), GLOBAL_SPEED);
}


startButton.addEventListener('click', startGame); // restarts the game by first setting the game mode to playing 
exitButton.addEventListener("click", showStartScreen);
restartButton.addEventListener("click", function(){
  Game(mode);
}); //restarts the game without changing the game mode 

rlButton.addEventListener("click", rlSimulate); 
instructionButton.addEventListener("click", showInstructions); 
menuButton.addEventListener("click", showMenu); 
homeButton.addEventListener("click", showStartScreen); 