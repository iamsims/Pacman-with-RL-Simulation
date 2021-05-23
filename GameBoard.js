class GameBoard {
    constructor(DOMGrid) {
      this.dotCount = 0;
      this.grid = [];
      this.DOMGrid = DOMGrid;
      this.state=[];
    }

    setPacmanPos(pacmanPos, pacmanDir){
      this.pacmanPos= pacmanPos;
      this.pacmanDir = pacmanDir;
    }

    showGameStatus(gameWin) {
        // Create and show game win or game over
        gameOverStatus.innerHTML = `${gameWin ? 'WIN!' : 'GAME OVER!'}`;
      }

    createGrid(state) {
        this.dotCount = 0;
        this.grid = [];
        this.DOMGrid.innerHTML = '';
        let classes;
        this.state = state;
        

        // First set correct amount of columns based on Grid Size and Cell Size
        this.DOMGrid.style.cssText = `grid-template-columns: repeat(${GRID_COL}, ${CELL_SIZE}px);`;
        console.log(this.state);
    
        this.state.forEach((square) => {
          const div = document.createElement('div');
          div.classList.add('square');

          classes= ELEMENT_LIST[square];
          div.classList.add(...classes);
        
          div.style.cssText = `width: ${CELL_SIZE}px; height: ${CELL_SIZE}px;`;
          this.DOMGrid.appendChild(div);
          this.grid.push(div);
    
          // Add dots
          if (ELEMENT_LIST[square] === CLASS_LIST.DOT) this.dotCount++;
        });

      }

      addObject(pos, classes) {
        this.grid[pos].classList.add(...classes);
      }

      removeObject(pos, classes) {
        this.grid[pos].classList.remove(...classes);
      }

      objectExist(pos, object) {
        return this.grid[pos].classList.contains(object);
      };
    
      rotateDiv(pos, deg) {
        this.grid[pos].style.transform = `rotate(${deg}deg)`;
      }


      moveCharacter(character) {
        if (character.shouldMove()) {
          // console.log("reaches here too");
          const { nextMovePos, direction } = character.getNextMove( this.objectExist.bind(this) , this.pacmanPos, this.pacmanDir);
          // console.log("comes out of get next move here too");
          if (character.rotation && nextMovePos !== character.pos) {
            // Rotate
            this.rotateDiv(nextMovePos, character.dir.rotation);
            // Rotate the previous div back
            this.rotateDiv(character.pos, 0);
          }
        this.drawCharacter(character, nextMovePos, direction);

        }
      }

      drawCharacter(character, nextMovePos= character.pos, direction= character.dir, state){
        const { classesToRemove, classesToAdd } = character.makeMove(state);

          this.removeObject(character.pos, classesToRemove);
          this.addObject(nextMovePos, classesToAdd);
    
          character.setNewPos(nextMovePos, direction);

      }

      static createGameBoard(DOMGrid, state) {
        const board = new this(DOMGrid);
        board.createGrid(state);
        return board;
      }

      render(){


      }

      
}