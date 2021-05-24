const POWER_PILL_TIME = 10000; // ms

class GameBoard {
  constructor(DOMGrid) {
    this.dotCount = 0;
    this.grid = [];
    this.DOMGrid = DOMGrid;
    this.state=[];
  }

  init(){
    this.score = 0;
    this.timer = null;
    this.gameWin = false;
    this.powerPillActive = false;
    this.powerPillTimer = null;


    this.createGrid(LAYOUT);

  
    this.pacman = new Pacman(2, 212);
    this.state[212]= ELEMENT_ENUM.PACMAN;

    document.addEventListener('keydown', (e) =>
      this.pacman.handleKeyInput(e, this.isElementType.bind(this))
    ); 

  }

  gameOver(){
    document.removeEventListener('keydown', (e) =>
    this.pacman.handleKeyInput(e, this.isElementType.bind(this)));
  }

  createGrid(state) {
      this.dotCount = 0;
      this.grid = [];
      this.DOMGrid.innerHTML = '';
      let classes;
      this.state = [...state];
      

      // First set correct amount of columns based on Grid Size and Cell Size
      this.DOMGrid.style.cssText = `grid-template-columns: repeat(${GRID_COL}, ${CELL_SIZE}px);`;
  
      this.state.forEach((square) => {
        const div = document.createElement('div');
        div.classList.add('square');

        classes= ELEMENT_LIST[square];
        div.classList.add(...classes);
      
        div.style.cssText = `width: ${CELL_SIZE}px; height: ${CELL_SIZE}px;`;
        this.DOMGrid.appendChild(div);
        this.grid.push(div);
  
        // Add dots
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


    getMove(character) {
        const { nextMovePos} = character.getNextMove( this.state, this.objectExist, this.pacman.pos, this.pacman.dir);        
        if (character.rotation && nextMovePos !== character.pos) {
          // Rotate
          this.rotateDiv(nextMovePos, character.dir.rotation);

          // Rotate the previous div back
          this.rotateDiv(character.pos, 0);
        }
      return {nextMovePos};   
    }

    checkCollision(){
      return false;//true or false
    }


    updatePacman(){
      let dotEatenSound= false;
      let pillEatenSound= false;
      let isGameOver= false;
      let finishedDots = false;
      let isCollided = false;

      if (this.pacman.shouldMove()){
        const {nextMovePos}= this.getMove(this.pacman);
        const{elementAtPos}=this.pacman.makeMove(this.state, nextMovePos);
        
  
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
          // this.ghosts.forEach((ghost) => (ghost.isScared = this.pacman.powerPill));
        }
  
  
        if (this.dotCount === 0) {
          this.gameWin = true;
          finishedDots = true;
        }
  
        isCollided= this.checkCollision(); //pacman and ghosts

        isGameOver= finishedDots || isCollided;
  
      }

      return {dotEatenSound, pillEatenSound, isGameOver};

    }

    render(){
      const allClasses= Object.values(OBJECT_TYPE);

      this.state.forEach((element,index)=>{
        this.removeObject(index, allClasses);
        this.addObject(index, ELEMENT_LIST[element]);
      })
    }

    static createGameBoard(DOMGrid, state) {
      const board = new this(DOMGrid);
      board.createGrid(state);
      return board;
    }


    
}