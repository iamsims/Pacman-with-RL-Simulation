const POWER_PILL_TIME = 10000; // ms
//gameboard has a mode

class GameBoard {
  constructor(DOMGrid) {
    this.dotCount = 0;
    this.grid = [];
    this.DOMGrid = DOMGrid;
    this.state=[];
  }

  updateStats(score,foodWeight,pillWeight,ghostWeight,foodDist,pillDist,ghostDist,runningEpisode, state){
    if (this.mode===GAMEMODE.RL){
      const {weights, episodeCompleted,totalEpisodes, operation} = this.pacmanAgent.getStats();
      // console.log(weights);
      // console.log(episodeCompleted);
      // console.log(totalEpisodes);
      foodWeight.innerHTML =      weights["food"].toPrecision(5);
      pillWeight.innerHTML =      weights["pill"].toPrecision(5);
      ghostWeight.innerHTML =     weights["n_ghosts"].toPrecision(5);
      foodDist.innerHTML =        weights["pill_dist"].toPrecision(5);
      pillDist.innerHTML =        weights["food_dist"].toPrecision(5);
      ghostDist.innerHTML =       weights["ghost_dist"].toPrecision(5);
      runningEpisode.innerHTML =  +(episodeCompleted+1)+"/"+totalEpisodes;
      state.innerHTML =        operation;
    }

    score.innerHTML = this.score; 
  
  }

  resetValues(){
    this.score = 0;
    this.timer = null;
    this.gameWin = false;
    this.powerPillActive = false;
    this.powerPillTimer = null;
    this.isGameOver = false;
    this.grid =[];
    this.createGrid(LAYOUT);

    this.pacman.pos = 212;
    this.state[212]= ELEMENT_ENUM.PACMAN;

    if(this.mode=== GAMEMODE.PLAYGAME){
      this.ghosts = [
        new Ghost(5, INITIAL_POSITION.blinky, shortestPathMovement, OBJECT_TYPE.BLINKY, ELEMENT_ENUM.BLANK),
        new Ghost(5, INITIAL_POSITION.pinky, shortestPathAheadMovement, OBJECT_TYPE.PINKY, ELEMENT_ENUM.GHOSTLAIR),
        new Ghost(5, INITIAL_POSITION.inky, randomMovement, OBJECT_TYPE.INKY, ELEMENT_ENUM.GHOSTLAIR),
        new Ghost(5, INITIAL_POSITION.clyde, fixedMovement, OBJECT_TYPE.CLYDE, ELEMENT_ENUM.GHOSTLAIR), //israndommovement now have to fix later
      ];
    }

    else{
      this.ghosts = [
        new Ghost(2, INITIAL_POSITION.blinky, shortestPathMovement, OBJECT_TYPE.BLINKY, ELEMENT_ENUM.BLANK),
        new Ghost(2, INITIAL_POSITION.pinky, shortestPathAheadMovement, OBJECT_TYPE.PINKY, ELEMENT_ENUM.GHOSTLAIR),
       //
        // new Ghost(5, INITIAL_POSITION.inky, randomMovement, OBJECT_TYPE.INKY, ELEMENT_ENUM.GHOSTLAIR),
        // new Ghost(5, INITIAL_POSITION.clyde, fixedMovement, OBJECT_TYPE.CLYDE, ELEMENT_ENUM.GHOSTLAIR), //israndommovement now have to fix later
        
      ];
    } 
    this.ghosts.forEach(ghost=> {
      this.state[INITIAL_POSITION[ghost.name]]=ELEMENT_ENUM[ghost.name.toUpperCase()]
    });

  }

  getScore(){
    return this.score;
  }

  init(mode){

    this.mode = mode;
    this.isComplete = false;

    //start pacman 
    if(mode ==GAMEMODE.PLAYGAME){
      
    this.pacman = new Pacman(2, 212);
    this.getPacmanMove = this.pacman.getNextMoveFromPlayer.bind(this.pacman);
    document.addEventListener('keydown', (e) =>
    this.pacman.handleKeyInput(e, this.isElementType.bind(this))
    ); 

    }

    else {
      this.noOfIterationsRemaining = 5;

      //this is subject to change
      this.pacman = new Pacman(1, 212);
      this.pacmanAgent = new PacmanAgent(this.noOfIterationsRemaining)
      this.stats = 
      this.getPacmanMove = this.pacman.getNextMovefromAgent.bind(this.pacman);
      
      // document.addEventListener('keydown', (e) =>
      // this.pacman.handleKeyInput(e, this.isElementType.bind(this))
    // ); 

    }

    this.resetValues();

  }

  gameOver(){
    if(this.mode === GAMEMODE.PLAYGAME){
      document.removeEventListener('keydown', (e) =>
      this.pacman.handleKeyInput(e, this.isElementType.bind(this)));
      this.isComplete= true;  
    }

    else if(this.mode === GAMEMODE.RL){
      this.pacmanAgent.final(this.score, [...this.state]);
      this.resetValues();
      
      // document.removeEventListener('keydown', (e) =>
      // this.pacman.handleKeyInput(e, this.isElementType.bind(this)));

      this.noOfIterationsRemaining--;
      // console.log("number of iterations remaining", this.noOfIterationsRemaining);
      
      if (this.noOfIterationsRemaining === 0){
        this.isComplete = true;
      }

    }  

  }

  createGrid(state) {
      this.dotCount = 0;
      this.grid = [];
      this.DOMGrid.innerHTML = '';
      let classes;
      this.state = [...state];
      

      this.DOMGrid.style.cssText = `grid-template-columns: repeat(${GRID_COL}, ${CELL_SIZE}px);`;
  
      this.state.forEach((square) => {
        const div = document.createElement('div');
        div.classList.add('square');

        classes= ELEMENT_LIST[square];
        div.classList.add(...classes);
      
        div.style.cssText = `width: ${CELL_SIZE}px; height: ${CELL_SIZE}px;`;
        this.DOMGrid.appendChild(div);
        this.grid.push(div);
  
        if (square === ELEMENT_ENUM.DOT) this.dotCount++;
        
      });

    }

    addObject(pos, classes) {
      this.grid[pos].classList.add(...classes);
    }

    removeObject(pos, classes) {
      this.grid[pos].classList.remove(...classes);
    }

    isElementType(pos, type){
      return this.state[pos]===type;
    }

    objectExist(element, object) {
      return ELEMENT_LIST[element].includes(object);
    };
  
    rotateDiv(pos, deg) {
      this.grid[pos].style.transform = `rotate(${deg}deg)`;
    }


    checkCollision(pacman, ghosts){
      const collidedGhost = ghosts.find((ghost) => pacman.pos === ghost.pos);
      return collidedGhost;
    }

    updateGhost(){
      let ghostIsEaten= false;
      this.ghosts.forEach((ghost, index)=>{

        if (ghost.shouldMove()){
          const {nextMovePos, direction}= ghost.getNextMove( this.state, this.objectExist, this.pacman.pos, this.pacman.dir);        
          if (ghost.rotation && nextMovePos !== ghost.pos) {
            this.rotateDiv(nextMovePos, ghost.dir.rotation);
            this.rotateDiv(ghost.pos, 0);
          }

          const {elementAtPos} = ghost.makeMove(this.state, nextMovePos, direction);
        }

      });

      let collidedGhost = this.checkCollision(this.pacman, this.ghosts);
      if (collidedGhost){
        if (collidedGhost.isScared){

          collidedGhost.makeMove(this.state, INITIAL_POSITION[collidedGhost.name], collidedGhost.dir);
          this.state[this.pacman.pos]= ELEMENT_ENUM.PACMAN;

          this.score+=50;
          ghostIsEaten = true;

        }

        else{
          this.state[this.pacman.pos]= ELEMENT_ENUM[collidedGhost.name.toUpperCase()];
          collidedGhost.pos = this.pacman.pos;
          this.rotateDiv(this.pacman.pos, 0);

          this.isGameOver = true;
          this.gameWin = false;


        }

      }

      return {ghostIsEaten};
    }

    updatePacman(){
      let dotEatenSound= false;
      let pillEatenSound= false;
      let eatsGhost= false;

      if (this.pacman.shouldMove()){

        const {nextMovePos, direction}= this.getPacmanMove([...this.state], this.pacmanAgent, this.score);
        if (this.pacman.rotation && nextMovePos !== this.pacman.pos) {
          this.rotateDiv(nextMovePos, this.pacman.dir.rotation);
          this.rotateDiv(this.pacman.pos, 0);
        }
       
        const{elementAtPos}=this.pacman.makeMove(this.state, nextMovePos, direction);
        
  
          if (elementAtPos == ELEMENT_ENUM.DOT){
            dotEatenSound=true;
            this.score+=10;
            this.dotCount--;
          };
        
          if (elementAtPos == ELEMENT_ENUM.PILL){
            pillEatenSound=true;
            this.pacman.powerPill= true;
            this.score += 50;
    
            clearTimeout(this.powerPillTimer);
            this.powerPillTimer = setTimeout(
              () => (this.pacman.powerPill = false),
              POWER_PILL_TIME
            );
          };
  
        if (this.pacman.powerPill !== this.powerPillActive) {
          this.powerPillActive = this.pacman.powerPill;
          this.ghosts.forEach((ghost) => (ghost.isScared = this.pacman.powerPill));
        }
  
  
        if (this.dotCount === 0) {
          this.gameWin = true;
          this.isGameOver = true;
        }
  
      }

      let collidedGhost = this.checkCollision(this.pacman, this.ghosts);
      if (collidedGhost){
        if (collidedGhost.isScared){

          collidedGhost.makeMove(this.state, INITIAL_POSITION[collidedGhost.name], collidedGhost.dir);
          this.state[this.pacman.pos]= ELEMENT_ENUM.PACMAN;

          this.score+=50;
          eatsGhost = true;

        }

        else{
          this.state[this.pacman.pos]= ELEMENT_ENUM[collidedGhost.name.toUpperCase()];
          collidedGhost.pos = this.pacman.pos;
          this.rotateDiv(this.pacman.pos, 0);

          this.isGameOver = true;
          this.gameWin = false;
        }

      }

      return {dotEatenSound, pillEatenSound, eatsGhost};

    }

    renderUpdate(){
      const allClasses= Object.values(OBJECT_TYPE);
      this.state.forEach((element,index)=>{
        this.removeObject(index, allClasses);
        this.addObject(index, ELEMENT_LIST[element]);
      })

      if(this.isGameOver){
        // console.log
        // console.log("gameover from here");
        this.gameOver();
      }

    }

    static createGameBoard(DOMGrid, state) {
      const board = new this(DOMGrid);
      board.createGrid(state);
      return board;
    }


    
}