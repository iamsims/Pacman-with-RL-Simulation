class PacmanAgent {
  constructor(numTraining, epsilon = 0.5, alpha = 0.2, gamma = 0.8) {
    this.numTraining = numTraining;
    this.episodesSoFar = 0;
    this.epsilon = epsilon;
    this.alpha = alpha;
    this.discount = gamma;
    this.lastState = null;
    this.lastAction = null;
    this.score = null;
    this.decrementinScore =0;
  }

  getFeatures(state, action) {  //checked
    const dots = getAll(state, [ELEMENT_ENUM.DOT]);
    const ghosts = getAll(state, [ELEMENT_ENUM.BLINKY, ELEMENT_ENUM.PINKY]);
    const pills = getAll(state, [ELEMENT_ENUM.PILL]);
    const pacman = getAll(state, [ELEMENT_ENUM.PACMAN]);

    //if there is no pacman, there are no features
    if (pacman.length==0){
        console.log("there is no pacman");
        return null;
    } 

    const features={};
    features["bias"] = 1;
    features["n_ghosts"] = 0;
    features["food"] = 0;
    features["pill"] = 0;
    features["food_dist"] =0;
    features["pill_dist"]=0;
    features["ghost_dist"]=0;

    const { nextX, nextY } = getPacmanNextPos(pacman, action);
    //TBC

    if(ghosts.length!==0){

    ghosts.forEach((ghost) => {
        if ((nextX, nextY) === (ghost.x, ghost.y))
          features["n_ghosts"]++;
      });

      let dist = closestDistance(ghosts, { x: nextX, y: nextY }, [...state]);
      dist = dist / (GRID_COL * GRID_ROW);
      features["ghost_dist"] = dist;
    }

    // console.log(findShortestDistance({x:2, y:1}, {x:15, y:2}, [...LAYOUT], 18, 17));


    if(pills.length!==0){
        if (
            !features["n_ghosts"] &&
            listContains({ x: nextX, y: nextY }, pills)
        )
            features["pill"]++;

        let dist = closestDistance(pills, { x: nextX, y: nextY }, [...state]);
        dist = dist / (GRID_COL * GRID_ROW);
        features["pill_dist"] = dist;

    }

    if(dots.length!==0){
        if (
            !features["n_ghosts"] &&
            listContains({ x: nextX, y: nextY }, dots)
          )
            features["food"]++;
      
          //TBC : use some algo to find closest dot, not the distance function
          let dist = closestDistance(dots, { x: nextX, y: nextY }, [...state]);
          dist = dist / (GRID_COL * GRID_ROW);
          features["food_dist"] = dist;
    }
 

    Object.keys(features).forEach((key)=>{
        // features[key]/=5; //this value is learnt heauristically 
    
    })

    // console.log("features");
    return features;
  }

  
getLegalPacmanActions(state){ //checked
    const pacmanPos = state.indexOf(ELEMENT_ENUM.PACMAN);
    const legalPacmanActions = [];

    Object.keys(DIRECTIONS).forEach((key)=>{
        const nextPos = pacmanPos+ DIRECTIONS[key].movement;
        if (state[nextPos]!== ELEMENT_ENUM.WALL && state[nextPos]!== ELEMENT_ENUM.GHOSTLAIR){// && (state[nextPos]!== ELEMENT_ENUM.BLINKY || state[nextPos]!== ELEMENT_ENUM.PINKY)){
            legalPacmanActions.push(DIRECTIONS[key]);
        }
    });
    return legalPacmanActions;
}

//gets action
  //called by pacman to get move from agent
getAction(state, score) {
    const legalActions = this.getLegalPacmanActions(state); 
    const reward = score - this.score - this.decrementinScore; //checked al;
    // this.decrementinScore+= 0.01;


    if (this.lastState){
        const last_state = this.lastState; //checked
        const last_action = this.lastAction; //checked
        // console.log("are laststae and now state become same", this.lastState === state );
        // console.log("is there pacman in last state", getAll(this.lastState, [ELEMENT_ENUM.PACMAN]));
        // console.log("is there pacman in last state", getAll(state, [ELEMENT_ENUM.PACMAN]));
        this.update(last_state, last_action, state,reward);
        // console.log("reward", reward)
        // console.log(score, this.score);
        // legalActions.forEach(action=>console.log(action))
        // Object.keys(this.weights).forEach((key)=>{
        //     // console.log(key, this.weights[key]);
        // })
    }
    let action ;

    if (flipCoin(this.epsilon)){
        let index = Math.floor(Math.random() * legalActions.length)
        action = legalActions[index];
        // console.log(this.getFeatures(state, action));
        // console.log("q value for the action",this.getQValue(state, action));
        // console.log("max q value for the action", this.getMaxQValue(state));
        // console.log("max action")

    }

    else{
        action = this.getPolicy(state);
        // console.log(this.getFeatures(state, action));
        // console.log("q value for the action",this.getQValue(state, action)===this.getMaxQValue(state));
        // console.log("max q value for the action", this.getMaxQValue(state));
    }

    // console.log("last_action",this.lastAction);
    // console.log(index,"/", legalActions.length, action);


    // let features = this.getFeatures(state, action);
    // console.log("pill_dist:"+features['pill_dist'],"ghost_dist:" + features['ghost_dist'], "food_dist:"+ features['food_dist']);

    this.score = score;
    this.lastAction= {...action}; //this is redundant i think 
    this.lastState = state;
    
    return {...action};
 }


  getPolicy(state) { //checked

    const legalActions = this.getLegalPacmanActions(state);
    const value = this.getMaxQValue(state);

    //rem
    for(const action of legalActions){
        if(value === this.getQValue(state, action)){
            return action;
        }
    }
  }

  getMaxQValue(state){ //checked
      const values =[];
      const legalActions = this.getLegalPacmanActions(state);
      legalActions.forEach(action=>{
          values.push(this.getQValue(state,action));
      });
    //   console.log("all values")

    //   values.forEach(value=>console.log(value));

      if (values.length!==0){
          return Math.max(...values)
      }
      else{
          return 0;
      }
  }

  getQValue(state, action) { //checked
    const features = this.getFeatures(state, action);
    let Qvalue = 0.0;
    if(!features){
    return Qvalue;
    }

    if(!this.weights){
      this.weights={};
      Object.keys(features).forEach((key)=>{
          this.weights[key]=0;
      })
    }

    Object.keys(features).forEach((key)=>{
        Qvalue+= this.weights[key]*features[key];
    })
    return Qvalue;
}


  update(state, action, nextState, reward){
      const difference = reward + (this.discount*this.getMaxQValue(nextState)- this.getQValue(state, action))
      const features = this.getFeatures(state, action);
    //   console.log("diff",difference)
      Object.keys(features).forEach((feature)=>{
           this.weights[feature]+= features[feature]*this.alpha*difference;
      })
  }


  final(score, state) {
    const reward = score-this.score;
    console.log("reward",reward);
    // console.log(this.lastState);
    // console.log("is there pacman", getAll(state, [ELEMENT_ENUM.PACMAN]));
    // console.log("is there pacman", getAll(this.lastState, [ELEMENT_ENUM.PACMAN]));

    this.update(this.lastState, this.lastAction,state,reward);
    // console.log(this.weights);

    // console.log(this.getFeatures(state, DIRECTIONS.ArrowDown))
    this.episodesSoFar ++;


    console.log(this.episodesSoFar,"/",this.numTraining);
    Object.keys(this.weights).forEach((key)=>console.log(key, this.weights[key]));



    this.decrementinScore = 0;
    this.score = 0;
    this.lastAction=  null;
    this.lastState = null;
    this.epsilon = 0.9*this.epsilon;
  }
}
