function randomMovement(position, direction, objectExist) {
  let dir = direction;
  let nextMovePos = position + dir.movement;
  // Create an array from the diretions objects keys
  const keys = Object.keys(DIRECTIONS);

  while (
    objectExist(nextMovePos, OBJECT_TYPE.WALL) ||
    objectExist(nextMovePos, OBJECT_TYPE.GHOST) || (objectExist(nextMovePos, OBJECT_TYPE.GHOSTLAIR) && !objectExist(position, OBJECT_TYPE.GHOSTLAIR))
  ) {
    // Get a random key from that array
    const key = keys[Math.floor(Math.random() * keys.length)];

    // Set the new direction
    dir = DIRECTIONS[key];

    // Set the next move
    nextMovePos = position + dir.movement;
  }
  return { nextMovePos, direction: dir };
}

function shortestPathMovement(position, direction, objectExist, pacmanPos) {

  let dir = direction;
  let nextMovePos = position+ dir.movement;
  const keys = Object.keys(DIRECTIONS);

  const posArray=[];
  const distanceArray=[];
  const directionArray =[]; 

  // for each key if there is no wall and ghost add it to the list with distance, there is either a wall or a ghost in either directions, the list will be empty  
  if (
    objectExist(nextMovePos, OBJECT_TYPE.WALL) ||
    objectExist(nextMovePos, OBJECT_TYPE.GHOST) || (objectExist(nextMovePos, OBJECT_TYPE.GHOSTLAIR) && !objectExist(position, OBJECT_TYPE.GHOSTLAIR))
  ){

    keys.forEach(key=>{
      let nextPossiblePos = position + DIRECTIONS[key].movement;
        if(!objectExist(nextPossiblePos, OBJECT_TYPE.WALL) &&
        !objectExist(nextPossiblePos, OBJECT_TYPE.GHOST) && 
        !((objectExist(nextMovePos, OBJECT_TYPE.GHOSTLAIR) && !objectExist(position, OBJECT_TYPE.GHOSTLAIR)))
        ){
          let distance = findDistance(nextPossiblePos, pacmanPos);
          posArray.push(nextPossiblePos)
          directionArray.push(DIRECTIONS[key])
          distanceArray.push(distance)
        }
  
    });
    
    //if the list is empty don't move
    if (posArray.length==0){
      nextMovePos = position;
      dir = direction;
    }
    
    //else if not empty, find the minimum distance and choose among multiple min distance
    else {
      let minDistIndex = distanceArray.indexOf(Math.min(...distanceArray));
      nextMovePos = posArray[minDistIndex];
      dir = directionArray[minDistIndex];
    }


  }
  

  
  return { nextMovePos, direction: dir };
}


function shortestPathAheadMovement(position, direction, objectExist, pacmanPos, pacmanDir) {
  let lookAheadPosition = pacmanPos+pacmanDir.movement*4;
  if(lookAheadPosition<0) lookAheadPosition=0;
  else if (lookAheadPosition>417) lookAheadPosition = 417;
  const output = randomMovement(
    position,
    direction,
    objectExist,
    lookAheadPosition
  );

return { nextMovePos:output.nextMovePos, direction: output.direction };
}

function fixedMovement(position, direction, objectExist) {
  const output = randomMovement(
    position,
    direction,
    objectExist
  );

return { nextMovePos:output.nextMovePos, direction: output.direction };
}


function findDistance(pos1, pos2){
  let xDiff = pos1%GRID_SIZE - pos2%GRID_SIZE;
  let yDiff = Math.floor(pos1/GRID_SIZE) - Math.floor(pos2/GRID_SIZE);
// return yDiff;
  return Math.sqrt(Math.pow( (xDiff)  ,2)+Math.pow(yDiff,2));
}