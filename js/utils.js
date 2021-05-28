function objectsEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
  
    if (keys1.length !== keys2.length) {
      return false;
    }
  
    for (let key of keys1) {
      if (object1[key] !== object2[key]) {
        return false;
      }
    }
  
    return true;
  }

function closestDistance(elements, pacman, state){
    distanceList =[]; 
    // xDiffList=[];
    // yDiffList=[];
    elements.forEach((element)=>{
        // console.log("x distance", )



        let distance = 0; //distance is 0 if the pacman and element are in same position
        if (!objectsEqual(element, pacman)){
            distance= findShortestDistance({x:pacman.x, y:pacman.y}, {x:element.x, y:element.y}, [...state]);
        }

        // let xDiff= dot.x-pacman.x;
        // let yDiff= dot.y-pacman.y;
        // let distance = Math.sqrt(Math.pow(xDiff,2)+Math.pow(yDiff,2))
        distanceList.push(distance);
        // xDiffList.push(xDiff);
        // yDiffList.push(yDiff);
    })

    // console.log(distanceList)
    ind= distanceList.indexOf(Math.min(...distanceList));
    // console.log("diff x and y", xDiffList[ind], yDiffList[ind]);
    // console.log("dots position", dots[ind].x, dots[ind].y )
    // console.log("distance", distanceList[ind]);

    return distanceList[ind];
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
            nextY = pacmanPos.y + Math.sign(action.movement);
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

// Object.prototype.clone = Array.prototype.clone = function()
// {
//     if (Object.prototype.toString.call(this) === '[object Array]')
//     {
//         var clone = [];
//         for (var i=0; i<this.length; i++)
//             clone[i] = this[i].clone();

//         return clone;
//     } 
//     else if (typeof(this)=="object")
//     {
//         var clone = {};
//         for (var prop in this)
//             if (this.hasOwnProperty(prop))
//                 clone[prop] = this[prop].clone();

//         return clone;
//     }
//     else
//         return this;
// }

function arrayEquals(a, b) {
    return Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index]);
  }



