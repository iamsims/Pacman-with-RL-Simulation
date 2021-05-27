function closestFoodDistance(dots, pacman){
    distanceList =[]; 
    dots.forEach((dot)=>{
        let distance = Math.sqrt(Math.pow(dot.x-pacman.x,2)+Math.pow(dot.y- pacman.y,2))
        distanceList.push(distance);
    })
    return Math.min(...distanceList);
}

function listContains( position, list){
    let doesContain = false;
    list.forEach((point)=>{
        if(point.x === position.x && point.y=== position.y){
            doesContain= true;
            return doesContain;
        }

    })
    return doesContain;
}

function getPacmanNextPos(pacman, action){
    let pacmanPos= pacman[0];
        let nextX, nextY;
        if (action ==DIRECTIONS.ArrowRight || action ==DIRECTIONS.ArrowLeft){
            nextX= pacmanPos.x+ action.movement;
            nextY = pacmanPos.y;
        }

        else{
            nextX = pacmanPos.x;
            nextY = pacmanPos.y + action.movement;
        }

    return{nextX, nextY};
}

function findDistance(pos1, pos2){
    let xDiff = pos1%GRID_COL - pos2%GRID_COL;
    let yDiff = Math.floor(pos1/GRID_COL) - Math.floor(pos2/GRID_COL);
  
    return Math.sqrt(Math.pow( (xDiff)  ,2)+Math.pow(yDiff,2));
  }

function getAll(state, element_type_list) {
    let positions = [];

    element_type_list.forEach((element_type) => {
      state.forEach((element, index) => {
        if (element === element_type) {
          let x = index % GRID_COL;
          let y = Math.floor(index / GRID_COL);
          positions.push({ x: x, y: y });
        }
      });
    });

    return positions;
  }

function flipCoin(epsilon){
    let p = Math.random();
    return p<epsilon;
}
