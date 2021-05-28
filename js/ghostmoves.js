function randomMovement(position, direction, state, objectExist) {
  let dir = direction;
  let nextMovePos = position + dir.movement;
  const keys = Object.keys(DIRECTIONS);


  const legalDirections = [];
  Object.keys(DIRECTIONS).forEach((key)=>{
    let nextPos = position+  DIRECTIONS[key].movement;
    if (
    !(state[nextPos]===ELEMENT_ENUM.WALL) && !(objectExist(state[nextPos], OBJECT_TYPE.GHOST)) //&& !((state[nextPossiblePos]===ELEMENT_ENUM.GHOSTLAIR) && !(state[position]===ELEMENT_ENUM.GHOSTLAIR))
    ){
      legalDirections.push(DIRECTIONS[key])
    }
  })
  
  let i= 15; 
  if(intersection(this.legalDirections, legalDirections) || state[nextMovePos]===ELEMENT_ENUM.WALL || objectExist(state[nextMovePos], OBJECT_TYPE.GHOST))
  {
  while (
    state[nextMovePos]===ELEMENT_ENUM.WALL || objectExist(state[nextMovePos], OBJECT_TYPE.GHOST)//|| (state[nextMovePos]===ELEMENT_ENUM.GHOSTLAIR && !(state[position]===ELEMENT_ENUM.GHOSTLAIR))
  ){
    const key = keys[Math.floor(Math.random() * keys.length)];

    dir = DIRECTIONS[key];

    nextMovePos = position + dir.movement;
    i--;

    if (i==0) {
      nextMovePos= position;
      break;
    }
  }
}

this.legalDirections = legalDirections;
  return { nextMovePos, direction: dir };
}


function awayMovement(position, direction, state, objectExist, pacmanPos){

  let dir = direction;
  let nextMovePos = position+ dir.movement;
  const keys = Object.keys(DIRECTIONS);

  const posArray=[];
  const distanceArray=[];
  const directionArray =[]; 

  const legalDirections = [];
  Object.keys(DIRECTIONS).forEach((key)=>{
    let nextPos = position+  DIRECTIONS[key].movement;
    if (
    !(state[nextPos]===ELEMENT_ENUM.WALL) && !(objectExist(state[nextPos], OBJECT_TYPE.GHOST)) //&& !((state[nextPossiblePos]===ELEMENT_ENUM.GHOSTLAIR) && !(state[position]===ELEMENT_ENUM.GHOSTLAIR))
    ){
      legalDirections.push(DIRECTIONS[key])
    }
  })

  // intersection(this.legalDirections, legalDirections);
  // console.log(this.legalDirections);


  if ( intersection(this.legalDirections, legalDirections)||
    state[nextMovePos]===ELEMENT_ENUM.WALL || objectExist(state[nextMovePos], OBJECT_TYPE.GHOST)//|| (state[nextMovePos]===ELEMENT_ENUM.GHOSTLAIR && !(state[position]===ELEMENT_ENUM.GHOSTLAIR))
    ){



    keys.forEach(key=>{
      let nextPossiblePos = position + DIRECTIONS[key].movement;


        if( 
    !(state[nextPossiblePos]===ELEMENT_ENUM.WALL) && !(objectExist(state[nextPossiblePos], OBJECT_TYPE.GHOST)) //&& !((state[nextPossiblePos]===ELEMENT_ENUM.GHOSTLAIR) && !(state[position]===ELEMENT_ENUM.GHOSTLAIR))
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
      let maxDistIndex = distanceArray.indexOf(Math.max(...distanceArray));
      nextMovePos = posArray[maxDistIndex];
      dir = directionArray[maxDistIndex];
    }

  }

this.legalDirections = legalDirections;
  return { nextMovePos, direction: dir };
  
}


function shortestPathMovement(position, direction, state, objectExist, pacmanPos) {
  let dir = direction;
  let nextMovePos = position+ dir.movement;
  const keys = Object.keys(DIRECTIONS);

  const posArray=[];
  const distanceArray=[];
  const directionArray =[]; 

  const legalDirections = [];
  Object.keys(DIRECTIONS).forEach((key)=>{
    let nextPos = position+  DIRECTIONS[key].movement;
    if (
    !(state[nextPos]===ELEMENT_ENUM.WALL) && !(objectExist(state[nextPos], OBJECT_TYPE.GHOST))
    ){
      legalDirections.push(DIRECTIONS[key])
    }
  })

  // intersection(this.legalDirections, legalDirections);


  if ( intersection(this.legalDirections, legalDirections)||
    state[nextMovePos]===ELEMENT_ENUM.WALL || objectExist(state[nextMovePos], OBJECT_TYPE.GHOST)
    ){


    keys.forEach(key=>{
      let nextPossiblePos = position + DIRECTIONS[key].movement;


        if( 
    !(state[nextPossiblePos]===ELEMENT_ENUM.WALL) && !(objectExist(state[nextPossiblePos], OBJECT_TYPE.GHOST)) && !((state[nextPossiblePos]===ELEMENT_ENUM.GHOSTLAIR) && (this.liesOn!== ELEMENT_ENUM.GHOSTLAIR))
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

  this.legalDirections = legalDirections;
  return { nextMovePos, direction: dir };
}


function shortestPathAheadMovement(position, direction, state, objectExist, pacmanPos, pacmanDir) {

  let lookAheadPosition = pacmanPos+pacmanDir.movement*4;

  while(lookAheadPosition<0) lookAheadPosition+=(-pacmanDir.movement); //pacmanDir.movement is negative so it's neg value added
  while(lookAheadPosition>GRID_COL*GRID_ROW-1) lookAheadPosition-= pacmanDir.movement;  //pacmanDir.movement is positive

  const movement = shortestPathMovement.bind(this);
  
  const output = movement(position,
    direction,
    state,
    objectExist,
    lookAheadPosition,
    pacmanDir,
  );

return { nextMovePos:output.nextMovePos, direction: output.direction };
}

function fixedMovement(position, direction, state, objectExist) {
  const movement= randomMovement.bind(this);
  const output = movement(
    position,
    direction,
    state,
    objectExist
  );

return { nextMovePos:output.nextMovePos, direction: output.direction };
}

function intersection( legal_action_prev, legal_action_new){
  if (legal_action_prev.length
    < legal_action_new.length){
    // console.log("intersection")
    return true;
  }
  return false;

}