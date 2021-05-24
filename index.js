// const gameGrid = document.querySelector(".game");
// const scoreTable = document.querySelector(".score");
// const startScreen = document.querySelector(".start-screen");
// const startButton = document.querySelector(".play-button");
// const restartButton = document.querySelector(".restart-button");
// const gameOverScreen = document.querySelector(".game-over-screen");
// const gameOverStatus = document.querySelector(".game-over");
// const exitButton = document.querySelector(".exit-button");
// const rlButton = document.querySelector(".rl-button");

// soundDot = "./sounds/munch.wav";
// soundPill = "./sounds/pill.wav";
// soundGameStart = "./sounds/game_start.wav";
// soundGameOver = "./sounds/death.wav";
// soundGhost = "./sounds/eat_ghost.wav";

// class Game {
//   initState() {
//     this.mode = GAMEMODE.PLAYGAME;
//     this.score = 0;
//     this.timer = null;
//     this.gameWin = false;
//     this.powerPillActive = false;
//     this.powerPillTimer = null;
//     this.gameBoard = GameBoard.createGameBoard(gameGrid, LAYOUT);
//   }

//   playAudio(audio) {
//     const soundEffect = new Audio(audio);
//     soundEffect.play();
//   }

//   // showGameStatus() {
//     // Create and show game win or game over
//     gameOverStatus.innerHTML = `${this.gameWin ? "WIN!" : "GAME OVER!"}`;
//   }

//   gameOver() {
//     if (!this.gameWin) {
//       playAudio(soundGameOver);
//     }
//     document.removeEventListener("keydown", (e) =>
//       this.gameBoard.pacman.handleKeyInput(
//         e,
//         this.gameBoard.objectExist.bind(this.gameBoard)
//       )
//     );

//     this.gameBoard.showGameStatus();
//     gameOverScreen.classList.remove("hide");
//     scoreTable.classList.add("hide");
//     clearInterval(timer);
//   }



// }

// startButton.addEventListener("click", startGame); // restarts the game by first setting the game mode to playing
// exitButton.addEventListener("click", showStartScreen);
// restartButton.addEventListener("click", Game); //restarts the game without changing the game mode
// rlButton.addEventListener("click", rlSimulate); // now define rlsimulate




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
    const {dotEatenSound, pillEatenSound, isGameOver} = gameBoard.updatePacman();  //changed in state

    if (dotEatenSound) playAudio(soundDot);
    if (pillEatenSound) playAudio(soundPill);

    if (isGameOver) {
      gameOver();
    }

  scoreTable.innerHTML = gameBoard.score;
  // console.log("now rendering")
  gameBoard.render();
  // console.log("out of rendering")


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

  // const ghosts = [
  //   new Ghost(5, INITIAL_POSITION.blinky, shortestPathMovement, OBJECT_TYPE.BLINKY),
  //   new Ghost(5, INITIAL_POSITION.pinky, shortestPathAheadMovement, OBJECT_TYPE.PINKY),
  //   // new Ghost(5, INITIAL_POSITION.inky, randomMovement, OBJECT_TYPE.INKY),
  //   // new Ghost(5, INITIAL_POSITION.clyde, fixedMovement, OBJECT_TYPE.CLYDE), //israndommovement now have to fix later
  //   // new Ghost(5, INITIAL_POSITION.clyde, fixedMovement, OBJECT_TYPE.CLYDE), //israndommovement now have to fix later
  //   // new Ghost(5, INITIAL_POSITION.clyde, fixedMovement, OBJECT_TYPE.CLYDE) //israndommovement now have to fix later
  // ];

  // ghosts.forEach(ghost=> gameBoard.drawCharacter(ghost));

  // Gameloop
  timer = setInterval(() => gameLoop(), GLOBAL_SPEED);
}

// Initialize game
startButton.addEventListener('click', startGame); // restarts the game by first setting the game mode to playing 
exitButton.addEventListener("click", showStartScreen);
restartButton.addEventListener("click", Game); //restarts the game without changing the game mode 
rlButton.addEventListener("click", rlSimulate); // now define rlsimulate