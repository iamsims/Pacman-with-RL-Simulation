// Dom Elements
const gameGrid = document.querySelector('#game');
const scoreTable = document.querySelector('#score');
const startButton = document.querySelector('#start-button');

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

  clearInterval(timer);
  // Show startbutton
  startButton.classList.remove('hide');

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
    gameBoard.setPacmanPos(pacman.pos, pacman.dir);
    ghosts.forEach((ghost) => {
      gameBoard.moveCharacter(ghost)
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


function startGame(){

  playAudio(soundGameStart);
  gameWin = false;
  powerPillActive = false;
  score = 0;

  startButton.classList.add('hide');
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
    new Ghost(5, INITIAL_POSITION.clyde, fixedMovement, OBJECT_TYPE.CLYDE) //israndommovement now have to fix later
  ];

  ghosts.forEach(ghost=> gameBoard.drawCharacter(ghost));

  // Gameloop
  timer = setInterval(() => gameLoop(pacman, ghosts), GLOBAL_SPEED);

}

// Initialize game
startButton.addEventListener('click', startGame);


