class Ghost {
  constructor(speed = 5, startPos, movement, name) {
    this.name = name;
    this.movement = movement;
    this.startPos = startPos;
    this.pos = startPos;
    this.dir = DIRECTIONS.ArrowRight;
    this.speed = speed;
    this.timer = 0;
    this.isScared = false;
    this.rotation = false;
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

  getNextMove(objectExist, pacmanPos, pacmanDir) {
    // Call move algoritm here
    // console.log(pacmanDir)
    if (this.isScared) {
      const { nextMovePos, direction } = randomMovement(
        this.pos,
        this.dir,
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
        objectExist,
        pacmanPos,
        pacmanDir
      );

      return { nextMovePos, direction };
    }
  }

  makeMove() {
    let ghostName = this.name;
    const scared_ghost_class = "SCARED_"+ghostName.toUpperCase();
    const ghost_class = ghostName.toUpperCase();
    const classesToRemove = CLASS_LIST[scared_ghost_class];
    let classesToAdd = CLASS_LIST[ghost_class];

    if (this.isScared) classesToAdd = CLASS_LIST[scared_ghost_class];

    return { classesToRemove, classesToAdd };
  }

  setNewPos(nextMovePos, direction) {
    this.pos = nextMovePos;
    this.dir = direction;
  }


}
