const GAMEMODE = {
  PLAYGAME: 0,
  RL: 1,
};

const GRID_COL = 17;
const GRID_ROW = 18;
const CELL_SIZE = 25;
const DIRECTIONS = {
  ArrowLeft: {
    code: 37,
    movement: -1,
    rotation: 180,
  },
  ArrowUp: {
    code: 38,
    movement: -GRID_COL,
    rotation: 270,
  },
  ArrowRight: {
    code: 39,
    movement: 1,
    rotation: 0,
  },
  ArrowDown: {
    code: 40,
    movement: GRID_COL,
    rotation: 90,
  },
};

const INITIAL_POSITION = {
  blinky: 93,
  pinky: 109,
  inky: 110,
  clyde: 111,
};

const OBJECT_TYPE = {
  BLANK: "blank",
  WALL: "wall",
  DOT: "dot",
  BLINKY: "blinky",
  PINKY: "pinky",
  INKY: "inky",
  CLYDE: "clyde",
  PILL: "pill",
  PACMAN: "pacman",
  GHOST: "ghost",
  SCARED: "scared",
  GHOSTLAIR: "lair",
};

const CLASS_LIST = {
  BLANK: [OBJECT_TYPE.BLANK],
  WALL: [OBJECT_TYPE.WALL],
  DOT: [OBJECT_TYPE.DOT],
  BLINKY: [OBJECT_TYPE.GHOST, OBJECT_TYPE.BLINKY],
  PINKY: [OBJECT_TYPE.GHOST, OBJECT_TYPE.PINKY],
  INKY: [OBJECT_TYPE.GHOST, OBJECT_TYPE.INKY],
  CLYDE: [OBJECT_TYPE.GHOST, OBJECT_TYPE.CLYDE],
  PILL: [OBJECT_TYPE.PILL],
  PACMAN: [OBJECT_TYPE.PACMAN],
  GHOSTLAIR: [OBJECT_TYPE.GHOSTLAIR],
  SCARED_BLINKY: [OBJECT_TYPE.SCARED, OBJECT_TYPE.GHOST, OBJECT_TYPE.BLINKY],
  SCARED_PINKY: [OBJECT_TYPE.SCARED, OBJECT_TYPE.GHOST, OBJECT_TYPE.PINKY],
  SCARED_INKY: [OBJECT_TYPE.SCARED, OBJECT_TYPE.GHOST, OBJECT_TYPE.INKY],
  SCARED_CLYDE: [OBJECT_TYPE.SCARED, OBJECT_TYPE.GHOST, OBJECT_TYPE.CLYDE],
};

const ELEMENT_ENUM = {
  BLANK: 0,
  WALL: 1,
  DOT: 2,
  BLINKY: 3,
  PINKY: 4,
  INKY: 5,
  CLYDE: 6,
  PILL: 7,
  PACMAN: 8,
  GHOSTLAIR: 9,
  SCARED_BLINKY: 10,
  SCARED_PINKY: 11,
  SCARED_INKY: 12,
  SCARED_CLYDE: 13,
};

// Lookup array for classes
const ELEMENT_LIST = [
  CLASS_LIST.BLANK,
  CLASS_LIST.WALL,
  CLASS_LIST.DOT,
  CLASS_LIST.BLINKY, //it would contain the ghost and blinky both
  CLASS_LIST.PINKY,
  CLASS_LIST.INKY,
  CLASS_LIST.CLYDE,
  CLASS_LIST.PILL,
  CLASS_LIST.PACMAN,
  CLASS_LIST.GHOSTLAIR,
  CLASS_LIST.SCARED_BLINKY,
  CLASS_LIST.SCARED_PINKY,
  CLASS_LIST.SCARED_INKY,
  CLASS_LIST.SCARED_CLYDE,
];


const LAYOUT = [
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
  1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 
  1, 7, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 7, 1, 
  1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 
  1, 2, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 2, 1, 
  1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 
  1, 1, 1, 2, 1, 2, 1, 9, 9, 9, 1, 2, 1, 2, 1, 1, 1,  
  0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 
  0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 
  1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 
  1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 
  1, 2, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 2, 1, 
  1, 2, 2, 2, 2, 2, 2, 2, 8, 2, 2, 2, 2, 2, 2, 2, 1, 
  1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 
  1, 7, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 7, 1, 
  1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 
  1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
];



// const LAYOUT = [
//   1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
//   1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 
//   1, 7, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 7, 1, 
//   1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 
//   1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 
//   1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 
//   1, 1, 1, 0, 1, 0, 1, 9, 9, 9, 1, 0, 1, 0, 1, 1, 1,  
//   0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 
//   0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 
//   1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 
//   1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 
//   1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 
//   1, 0, 0, 0, 0, 0, 0, 2, 8, 0, 0, 2, 0, 0, 0, 0, 1, 
//   1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 
//   1, 7, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 2, 0, 7, 1, 
//   1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 
//   1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 
//   1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
// ];
