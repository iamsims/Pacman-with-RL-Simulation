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
    // Call move algoritm here
    // console.log(this.isScared);
    if (this.isScared) {
      const { nextMovePos, direction } = randomMovement(
        this.pos,
        this.dir,
        state,
        objectExist,
      );

      return { nextMovePos, direction };
    }
    //  else if(this.isKilled){
    //   return {nextMovePos: this.pos,direction: this.dir};
    // }
      // console.log("gets into get next move");
      else {
        const { nextMovePos, direction } = this.movement(
        this.pos,
        this.dir,
        state,
        objectExist,
        pacmanPos,
        pacmanDir
      );
      // console.log("gets into movement for shortest path");


      return { nextMovePos, direction };
    }
  }

  makeMove(state, nextMovePos, direction) {
   
    // console.log(nextMovePos, direction);
    

    let elementAtPos = state[nextMovePos];

    
    // //set the element at newpos to the scared+sth if scared otherwise just set to the ghost name 
    let newClassName = this.name.toUpperCase();
    if(this.isScared) newClassName= "SCARED_"+newClassName;

    state[this.pos]= this.liesOn;
    state[nextMovePos] = ELEMENT_ENUM[newClassName];

    this.liesOn = elementAtPos;
    this.pos = nextMovePos;
    this.dir = direction;

    // console.log(state[93],state[109],state[110], state[111])

    return {elementAtPos};

  }


}
