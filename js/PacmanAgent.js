class PacmanAgent {
  constructor(totalEpisodes, epsilon = 0.5, alpha = 0.2, gamma = 0.8) {
    this.totalEpisodes = totalEpisodes;
    this.episodesSoFar = 0;
    this.epsilon = epsilon;
    this.alpha = alpha;
    this.discount = gamma;
    this.lastState = null;
    this.lastAction = null;
    this.score = null;

    this.winInTests=0;

    this.operation = "Training";
    this.weights={};
    this.weights["bias"] = 0;
    this.weights["n_ghosts"] = -2;  //ghosts are bad
    this.weights["food"] = 1;       //food is good 
    this.weights["pill"] = 1;        //pills are good
    this.weights["food_dist"] =-1;   //less distance the better
    this.weights["pill_dist"]=-1;     //less distance the better
    this.weights["ghost_dist"]=2;     //more distance the betterthis.weights["n_ghosts"] = -2;  //ghosts are bad
    
  }

  getStats(){
    return {weights: {...this.weights}, episodeCompleted:this.episodesSoFar, totalEpisodes:this.totalEpisodes, operation:this.operation};
  }

  getFeatures(state, action) {  
    const dots = getAll(state, [ELEMENT_ENUM.DOT]);
    const ghosts = getAll(state, [ELEMENT_ENUM.BLINKY, ELEMENT_ENUM.PINKY]);
    const pills = getAll(state, [ELEMENT_ENUM.PILL]);
    const pacman = getAll(state, [ELEMENT_ENUM.PACMAN]);

    //if there is no pacman, there are no features
    if (pacman.length==0){
        return null;
    } 

    const features={};
    features["bias"] = 0.2;
    features["n_ghosts"] = 0;
    features["food"] = 0;
    features["pill"] = 0;
    features["food_dist"] =0;
    features["pill_dist"]=0;
    features["ghost_dist"]=0;

    const { nextX, nextY } = getPacmanNextPos(pacman, action);

    if(ghosts.length!==0){

    ghosts.forEach((ghost) => {
        if ((nextX, nextY) === (ghost.x, ghost.y))
          features["n_ghosts"]++;
      });

      features["n_ghosts"]/=5;

      let dist = closestDistance(ghosts, { x: nextX, y: nextY }, [...state]);
      dist = dist / (GRID_COL * GRID_ROW);
      features["ghost_dist"] = dist;
    }



    if(pills.length!==0){
        if (
            !features["n_ghosts"] &&
            listContains({ x: nextX, y: nextY }, pills)
        )
            features["pill"]++;

        features["pill"]/=5;

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

          features["food"]/=5;
      
          let dist = closestDistance(dots, { x: nextX, y: nextY }, [...state]);
          dist = dist / (GRID_COL * GRID_ROW);
          features["food_dist"] = dist;
    }
 

    //used for scaling 
    // Object.keys(features).forEach((key)=>{
    //     // features[key]/=5; //this value is learnt heauristically 
    
    // })

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
    const reward = score - this.score;


    if (this.lastState){
        const last_state = this.lastState; 
        const last_action = this.lastAction; 
        this.update(last_state, last_action, state,reward);

    }
    let action ;

    if (flipCoin(this.epsilon)){
        let index = Math.floor(Math.random() * legalActions.length)
        action = legalActions[index];

    }

    else{
        action = this.getPolicy(state);
    }

    this.score = score;
    this.lastAction= {...action}; //this is redundant i think 
    this.lastState = state;
    
    return {...action};
 }


  getPolicy(state) { 

    const legalActions = this.getLegalPacmanActions(state);
    const value = this.getMaxQValue(state);

    //rem
    for(const action of legalActions){
        if(value === this.getQValue(state, action)){
            return action;
        }
    }
  }

  getMaxQValue(state){ 
      const values =[];
      const legalActions = this.getLegalPacmanActions(state);
      legalActions.forEach(action=>{
          values.push(this.getQValue(state,action));
      });
      if (values.length!==0){
          return Math.max(...values)
      }
      else{
          return 0;
      }
  }

  getQValue(state, action) { 
    const features = this.getFeatures(state, action);
    let Qvalue = 0.0;
    if(!features){
    return Qvalue;
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


  final(score, state, gameWin) {
    let reward = score-this.score;
    // if(!gameWin){
    //   reward = -50;
    // }


    this.update(this.lastState, this.lastAction,state,reward);

    this.episodesSoFar ++;

    this.score = 0;
    this.lastAction=  null;
    this.lastState = null;
    this.epsilon = 0.95*this.epsilon;
    this.alpha =0.99*this.alpha;


    if((1- (this.episodesSoFar/this.totalEpisodes))<=0.2){
      if(!this.totalTests){
        console.log("entered testing")
        this.totalTests = this.totalEpisodes-this.episodesSoFar;
        this.operation ="Testing";
        this.alpha=0;
      //take off the training wheels 

      }

      if(gameWin){
        this.winInTests++;
      }

      //TODO: for text summarizing window
      console.log("tests won", this.winInTests)
      console.log("tests played", this.totalTests-this.totalEpisodes+ this.episodesSoFar)

      this.epsilon =0.1;
      //10% exploration even when the Pacman learns
    }

  }
}
