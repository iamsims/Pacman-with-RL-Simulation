// Dom Elements
const gameGrid = document.querySelector('.game');
const scoreTable = document.querySelector('.score');
const startScreen = document.querySelector('.start-screen');
const startButton = document.querySelector('.play-button');
const restartButton = document.querySelector('.restart-button');
const gameOverScreen = document.querySelector('.game-over-screen');
const gameOverStatus = document.querySelector('.game-over');
const exitButton = document.querySelector(".exit-button");
const rlButton = document.querySelector(".rl-button");

let mode= GAMEMODE.PLAYGAME;

// Game constants
const GLOBAL_SPEED = 80; // ms
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

function gameOver(){
    if(!gameBoard.gameWin){
        playAudio(soundGameOver);
    }
    gameBoard.gameOver();

  showGameStatus(gameBoard.gameWin);
  gameOverScreen.classList.remove('hide');
  scoreTable.classList.add("hide");
  clearInterval(timer);

}

function gameLoop(pacman, ghosts){
    const {dotEatenSound, pillEatenSound, finishedDots} = gameBoard.updatePacman();  //changed in state
    const {eatsPacman} = gameBoard.updateGhost();

    if (dotEatenSound) playAudio(soundDot);
    if (pillEatenSound) playAudio(soundPill);


  scoreTable.innerHTML = gameBoard.score;
  gameBoard.render();
  // console.log("out of rendering")

  let isGameOver = finishedDots||eatsPacman;

  if (isGameOver) {
    gameOver();
  }

}

function restore(){
  gameOverScreen.classList.add('hide');
  startScreen.classList.add('hide');
}

function showStartScreen(){
  gameOverScreen.classList.add('hide');
  startScreen.classList.remove("hide");
  scoreTable.classList.remove("hide");
}

function startGame(){
  mode= GAMEMODE.PLAYGAME;
  Game();
}

function Game(){ 
  restore();
  playAudio(soundGameStart);
  gameBoard.init(); 
  timer = setInterval(() => gameLoop(), GLOBAL_SPEED);
}

// Initialize game
startButton.addEventListener('click', startGame); // restarts the game by first setting the game mode to playing 
exitButton.addEventListener("click", showStartScreen);
restartButton.addEventListener("click", Game); //restarts the game without changing the game mode 
rlButton.addEventListener("click", rlSimulate); // now define rlsimulate