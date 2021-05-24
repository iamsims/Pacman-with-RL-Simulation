class Pacman {
  constructor(speed, startPos) {
    this.pos = startPos;
    this.speed = speed;
    this.dir = DIRECTIONS.ArrowRight;
    this.timer = 0;
    this.powerPill = false;
    this.rotation = true;
    this.name = "pacman";
  }


shouldMove() {
  // Don't move before a key is pressed
  if (!this.dir) return;

  if (this.timer === this.speed) {
    this.timer = 0;
    return true;
  }
  this.timer++;
  return false;
}


getNextMove(state) {
  let nextMovePos = this.pos + this.dir.movement;
  
  // Do we collide with a wall?

  if (state[nextMovePos]===ELEMENT_ENUM.WALL || state[nextMovePos]===ELEMENT_ENUM.GHOSTLAIR ) 
  {
    nextMovePos = this.pos;
  }


  return {nextMovePos};

}
//ATTENTION: needs to calculate the point of 

makeMove(state, nextMovePos) {
  // let prevPos = this.pos;
  let elementAtPos= state[nextMovePos];

  state[this.pos] = ELEMENT_ENUM.BLANK;
  state[nextMovePos] = ELEMENT_ENUM.PACMAN;

  this.pos = nextMovePos;

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