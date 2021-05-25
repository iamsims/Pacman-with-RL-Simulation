class Ghost {
  constructor(speed = 5, startPos, movement, name, liesOn) {
    this.name = name;
    this.movement = movement;
    this.startPos = startPos;
    this.pos = startPos;
    this.dir = DIRECTIONS.ArrowRight;
    this.speed = speed;
    this.timer = 0;
    this.isScared = false;
    this.rotation = false;
    this.liesOn = liesOn;
     // this.isKilled = false;
  }

  shouldMove() {
    if (this.timer === this.speed) {
      this.timer = 0;
      return true;
    }
    this.timer++;
    return false;
  }



  getNextMove(state, objectExist, pacmanPos, pacmanDir) {
    if (this.isScared) {
      const { nextMovePos, direction } = awayMovement(
        this.pos,
        this.dir,
        state,
        objectExist,
        pacmanPos
      );

      return { nextMovePos, direction };
    }
      else {
        const { nextMovePos, direction } = this.movement(
        this.pos,
        this.dir,
        state,
        objectExist,
        pacmanPos,
        pacmanDir
      );


      return { nextMovePos, direction };
    }
  }

  makeMove(state, nextMovePos, direction) {
   
    

    let elementAtPos = state[nextMovePos];
    if (elementAtPos== ELEMENT_ENUM.PACMAN)
    elementAtPos = ELEMENT_ENUM.BLANK;

    
    if(nextMovePos!= this.pos){
    let newClassName = this.name.toUpperCase();
    if(this.isScared) newClassName= "SCARED_"+newClassName;

    state[this.pos]= this.liesOn;
    state[nextMovePos] = ELEMENT_ENUM[newClassName];

    this.liesOn = elementAtPos;
    this.pos = nextMovePos;
    this.dir = direction;

    }
    


    return {elementAtPos};

  }


}
