function randomMovement(position, direction, state, objectExist) {
  let dir = direction;
  let nextMovePos = position + dir.movement;
  // Create an array from the diretions objects keys
  const keys = Object.keys(DIRECTIONS);
  
  let i= 15; 

  while (
    state[nextMovePos]===ELEMENT_ENUM.WALL || objectExist(state[nextMovePos], OBJECT_TYPE.GHOST)//|| (state[nextMovePos]===ELEMENT_ENUM.GHOSTLAIR && !(state[position]===ELEMENT_ENUM.GHOSTLAIR))
  ){
    // Get a random key from that array
    const key = keys[Math.floor(Math.random() * keys.length)];

    // Set the new direction
    dir = DIRECTIONS[key];

    // Set the next move
    nextMovePos = position + dir.movement;
    i--;
    if (i==0) {
      nextMovePos= position;
      break;
    }
  }

  return { nextMovePos, direction: dir };
}



function shortestPathMovement(position, direction, state, objectExist, pacmanPos) {

  let dir = direction;
  let nextMovePos = position+ dir.movement;
  const keys = Object.keys(DIRECTIONS);

  const posArray=[];
  const distanceArray=[];
  const directionArray =[]; 

  // console.log("inside shortest movement");


  // for each key if there is no wall and ghost add it to the list with distance, there is either a wall or a ghost in either directions, the list will be empty  
  //chnage direction if hits a wall, ghost or ghostlair after getting out from ghostlair

  //console.log(state[nextMovePos]===ELEMENT_ENUM.WALL);
  //console.log(objectExist(state[nextMovePos], OBJECT_TYPE.GHOST));
  //console.log((state[nextMovePos]===ELEMENT_ENUM.GHOSTLAIR && !(state[position]===ELEMENT_ENUM.GHOSTLAIR)));

  if (
    state[nextMovePos]===ELEMENT_ENUM.WALL || objectExist(state[nextMovePos], OBJECT_TYPE.GHOST)//|| (state[nextMovePos]===ELEMENT_ENUM.GHOSTLAIR && !(state[position]===ELEMENT_ENUM.GHOSTLAIR))
    ){

    // console.log("inside shortest movement");

    keys.forEach(key=>{
      let nextPossiblePos = position + DIRECTIONS[key].movement;
      // console.log(state[nextPossiblePos]===ELEMENT_ENUM.WALL);
  //console.log(objectExist(state[nextMovePos], OBJECT_TYPE.GHOST));
  // console.log((state[nextMovePos]===ELEMENT_ENUM.GHOSTLAIR && !(state[position]===ELEMENT_ENUM.GHOSTLAIR)));


        if( 
    !(state[nextPossiblePos]===ELEMENT_ENUM.WALL) && !(objectExist(state[nextPossiblePos], OBJECT_TYPE.GHOST)) //&& !((state[nextPossiblePos]===ELEMENT_ENUM.GHOSTLAIR) && !(state[position]===ELEMENT_ENUM.GHOSTLAIR))
         ){
          //  console.log(nextPossiblePos);
          let distance = findDistance(nextPossiblePos, pacmanPos);
          posArray.push(nextPossiblePos)
          directionArray.push(DIRECTIONS[key])
          distanceArray.push(distance)
        }
  
    });
    
    //if the list is empty don't move
    if (posArray.length==0){
      print("isempty")
      nextMovePos = position;
      dir = direction;
    }
    
    //else if not empty, find the minimum distance and choose among multiple min distance
    else {
      let minDistIndex = distanceArray.indexOf(Math.min(...distanceArray));
      nextMovePos = posArray[minDistIndex];
      dir = directionArray[minDistIndex];
    }

  // console.log(posArray, distanceArray, directionArray, nextMovePos)

  // console.log(nextMovePos, dir);




  }
  

  // console.log(nextMovePos, dir);
  return { nextMovePos, direction: dir };
}


function shortestPathAheadMovement(position, direction, state, objectExist, pacmanPos, pacmanDir) {
  let lookAheadPosition = pacmanPos+pacmanDir.movement*4;
  // if(lookAheadPosition<0) lookAheadPosition=0;
  // else if (lookAheadPosition>417) lookAheadPosition = 417;
  while(lookAheadPosition<0) lookAheadPosition+=(-pacmanDir.movement); //pacmanDir.movement is negative so it's neg value added
  while(lookAheadPosition>GRID_COL*GRID_ROW-1) lookAheadPosition-= pacmanDir.movement;  //pacmanDir.movement is positive
  // console.log("gets out of lookagead loop");

  const output = shortestPathMovement(
    position,
    direction,
    state,
    objectExist,
    lookAheadPosition
  );
  // console.log("gets out of shortestPath movement loop");

  // console.log(pacmanPos, lookAheadPosition);

return { nextMovePos:output.nextMovePos, direction: output.direction };
}

function fixedMovement(position, direction, state, objectExist) {
  const output = randomMovement(
    position,
    direction,
    state,
    objectExist
  );

return { nextMovePos:output.nextMovePos, direction: output.direction };
}

function findDistance(pos1, pos2){
  let xDiff = pos1%GRID_COL - pos2%GRID_COL;
  let yDiff = Math.floor(pos1/GRID_COL) - Math.floor(pos2/GRID_COL);
// return yDiff;
  return Math.sqrt(Math.pow( (xDiff)  ,2)+Math.pow(yDiff,2));
}