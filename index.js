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
const POWER_PILL_TIME = 10000; // ms
const GLOBAL_SPEED = 80; // ms
const gameBoard = GameBoard.createGameBoard(gameGrid, LEVEL);


soundDot='./sounds/munch.wav';
soundPill= './sounds/pill.wav';
soundGameStart= './sounds/game_start.wav';
soundGameOver= './sounds/death.wav';
soundGhost ='./sounds/eat_ghost.wav';

// Initial setup
let score = 0;
let timer = null;
let gameWin = false;
let powerPillActive = false;
let powerPillTimer = null;


function playAudio(audio) {
    const soundEffect = new Audio(audio);
    soundEffect.play();
  }

function gameOver(pacman, grid){
    if(!gameWin){
        playAudio(soundGameOver);
    }
    document.removeEventListener('keydown', (e) =>
    pacman.handleKeyInput(e, gameBoard.objectExist.bind(gameBoard))
  );

  gameBoard.showGameStatus(gameWin);
  gameOverScreen.classList.remove('hide');
  scoreTable.classList.add("hide");
  clearInterval(timer);

}

function checkCollision(pacman, ghosts) {
    const collidedGhost = ghosts.find((ghost) => pacman.pos === ghost.pos);
  
    if (collidedGhost) {
      if (pacman.powerPill) {
      playAudio(soundGhost);

        gameBoard.removeObject(collidedGhost.pos, [
          OBJECT_TYPE.GHOST,
          OBJECT_TYPE.SCARED,
          collidedGhost.name
        ]);
        collidedGhost.pos = collidedGhost.startPos;
        score += 100;
      } else {
        gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.PACMAN]);
        gameBoard.rotateDiv(pacman.pos, 0);
        gameOver(pacman, gameGrid);
      }
    }
  }


function gameLoop(pacman, ghosts){
    gameBoard.moveCharacter(pacman);
    checkCollision(pacman, ghosts);
    // console.log("pacman moves in the game loop")
    gameBoard.setPacmanPos(pacman.pos, pacman.dir);
    ghosts.forEach((ghost) => {
      // console.log("reached here at least")
      gameBoard.moveCharacter(ghost)
    // console.log(ghost.name+ " moves in the game loop")

    });
    checkCollision(pacman, ghosts);

  if (gameBoard.objectExist(pacman.pos, OBJECT_TYPE.DOT)) {
    playAudio(soundDot);

    gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.DOT]);

    // Remove a dot
    gameBoard.dotCount--;
    
    // Add Score
    score += 10;
  }

  //  Change ghost scare mode depending on powerpill
  if (gameBoard.objectExist(pacman.pos, OBJECT_TYPE.PILL)) {
    playAudio(soundPill);


    gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.PILL]);

    pacman.powerPill = true;
    score += 50;

    clearTimeout(powerPillTimer);
    powerPillTimer = setTimeout(
      () => (pacman.powerPill = false),
      POWER_PILL_TIME
    );
  }

  if (pacman.powerPill !== powerPillActive) {
    powerPillActive = pacman.powerPill;
    ghosts.forEach((ghost) => (ghost.isScared = pacman.powerPill));
  }

  if (gameBoard.dotCount === 0) {
    gameWin = true;
    gameOver(pacman, gameGrid);
  }

  scoreTable.innerHTML = score;

}

function restore(){
  gameWin = false;
  powerPillActive = false;
  score = 0;
  gameOverScreen.classList.add('hide');
  startScreen.classList.add('hide');
}

function showStartScreen(){
  gameOverScreen.classList.add('hide');
  startScreen.classList.remove("hide");
}

function startGame(){
  mode= GAMEMODE.PLAYGAME;
  Game();
}

function Game(){ 
  restore();
  scoreTable.classList.remove("hide");
  playAudio(soundGameStart);

  gameBoard.createGrid(LEVEL);
  
  const pacman = new Pacman(2, 212);
  gameBoard.addObject(212, [OBJECT_TYPE.PACMAN]);
  gameBoard.setPacmanPos(212, pacman.dir);
  gameBoard.drawCharacter(pacman)
  
  document.addEventListener('keydown', (e) =>
    pacman.handleKeyInput(e, gameBoard.objectExist.bind(gameBoard))
  ); 

  const ghosts = [
    new Ghost(5, INITIAL_POSITION.blinky, shortestPathMovement, OBJECT_TYPE.BLINKY),
    new Ghost(5, INITIAL_POSITION.pinky, shortestPathAheadMovement, OBJECT_TYPE.PINKY),
    new Ghost(5, INITIAL_POSITION.inky, randomMovement, OBJECT_TYPE.INKY),
    new Ghost(5, INITIAL_POSITION.clyde, fixedMovement, OBJECT_TYPE.CLYDE), //israndommovement now have to fix later
  ];

  ghosts.forEach(ghost=> gameBoard.drawCharacter(ghost));

  // Gameloop
  timer = setInterval(() => gameLoop(pacman, ghosts), GLOBAL_SPEED);
}

// Initialize game
startButton.addEventListener('click', startGame); // restarts the game by first setting the game mode to playing 
exitButton.addEventListener("click", showStartScreen);
restartButton.addEventListener("click", Game); //restarts the game without changing the game mode 
rlButton.addEventListener("click", rlSimulate); // now define rlsimulate