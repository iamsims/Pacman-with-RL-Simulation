class Pacman {
  constructor(speed, startPos, mode) {
    this.pos = startPos;
    this.speed = speed;
    this.dir = DIRECTIONS.ArrowRight;
    this.timer = 0;
    this.powerPill = false;
    this.rotation = true;
    this.name = "pacman";
    this.mode = mode;
  }


shouldMove() {
  if (!this.dir) return;

  if (this.timer === this.speed) {
    this.timer = 0;
    return true;
  }
  this.timer++;
  return false;
}


getNextMovefromAgent(state, pacmanAgent, score){

  const action = pacmanAgent.getAction(state, score);
  let nextMovePos = this.pos + action.movement;
  this.dir= action;
  return{nextMovePos: nextMovePos, direction: action};
}



getNextMoveFromPlayer(state) {
  let nextMovePos = this.pos + this.dir.movement;
  
  // Do we collide with a wall?

  if (state[nextMovePos]===ELEMENT_ENUM.WALL || state[nextMovePos]===ELEMENT_ENUM.GHOSTLAIR ) 
  {
    nextMovePos = this.pos;
  }


  return {nextMovePos, direction: this.dir};

}

makeMove(state, nextMovePos, direction) {
  let elementAtPos= state[nextMovePos];

  state[this.pos] = ELEMENT_ENUM.BLANK;
  state[nextMovePos] = ELEMENT_ENUM.PACMAN;

  this.pos = nextMovePos;
  this.dir = direction;

  return {elementAtPos};
}

handleKeyInput = (e, isElementType) => {
  let dir;
  if (e.keyCode >= 37 && e.keyCode <= 40) {
    dir = DIRECTIONS[e.key];
  } else {
    return;
  }

  const nextMovePos = this.pos + dir.movement;
  if (isElementType(nextMovePos,ELEMENT_ENUM.WALL) || isElementType(nextMovePos,ELEMENT_ENUM.GHOSTLAIR) ) return;
  this.dir = dir;
};

}