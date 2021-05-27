//write code for PAcman.js

class PacmanAgent {
  constructor(numTraining, epsilon = 0.1, alpha = 0.2, gamma = 0.8) {
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


  getFeatures(state, action) {
    let dots = getAll(state, [ELEMENT_ENUM.DOT]);
    let ghosts = getAll(state, [ELEMENT_ENUM.BLINKY, ELEMENT_ENUM.PINKY]);
    let pills = getAll(state, [ELEMENT_ENUM.PILL]);
    let pacman = getAll(state, [ELEMENT_ENUM.PACMAN]);
    let features = {};

    let { nextX, nextY } = getPacmanNextPos(pacman, action);

    features["bias"] = 1;

    //TBC
    features["no_of_ghosts_one_step_away"] = 0;
    ghosts.forEach((ghost) => {
      if ((nextX, nextY) === (ghost.x, ghost.y))
        features["no_of_ghosts_one_step_away"]++;
    });

    features["eats_food"] = 0;
    if (
      !features["no_of_ghosts_one_step_away"] &&
      listContains({ x: nextX, y: nextY }, dots)
    )
      features["eats_food"]++;

    //TBC : use some algo to find closest dot, not the distance function
    let dist = closestFoodDistance(dots, { x: nextX, y: nextY });
    dist = dist / (GRID_COL * GRID_ROW);
    features["closest_food_dist"] = dist;

    dist = closestFoodDistance(pills, { x: nextX, y: nextY });
    dist = dist / (GRID_COL * GRID_ROW);
    // if(features[])
    features["closest_pill_dist"] = dist;

    // console.log(features['no_of_ghosts_one_step_away']);
    // console.log("dist", dist);
    // console.log("eats food",features['eats_food']);
    // console.log("include dots", listContains({x:nextX, y:nextY}, dots));

    // Object.keys(features).forEach((key) => {
    //   features[key] /= 10.0;
    // //   console.log(key, features[key]);
    // });

    return features;
  }

  //gets action
  //called by pacman to get move from agent
    getLegalPacmanActions(state){
    let pacmanPos = state.indexOf(ELEMENT_ENUM.PACMAN);
    let legalPacmanActions = [];

    Object.keys(DIRECTIONS).forEach((key)=>{
        let nextPos = pacmanPos+ DIRECTIONS[key].movement;
        if (state[nextPos]!== ELEMENT_ENUM.WALL){// && (state[nextPos]!== ELEMENT_ENUM.BLINKY || state[nextPos]!== ELEMENT_ENUM.PINKY)){
            legalPacmanActions.push(DIRECTIONS[key]);
        }
    });
    return legalPacmanActions;
    // legalPacmanActions.forEach((a)=>console.log(a));
}


  getAction(state, score) {
    // this.getFeatures(state, DIRECTIONS.ArrowRight);
    let legalActions = this.getLegalPacmanActions(state);
    // console.log("legal Actions")
    // legalActions.forEach(action=>{
    //     console.log(action)
    // });

    let reward = score - this.score - this.decrementinScore;
    // console.log("score now",score);
    // console.log("score self",this.score);

    this.decrementinScore+= 0.1;


    if (this.lastState){
        let last_state = this.lastState;
        let last_action = this.lastAction;
        this.update(last_state, last_action, state,reward, legalActions);
        //update q value okay ?
        // console.log("there is a last state")
        Object.keys(this.weights).forEach((key)=>{
            console.log(key, this.weights[key]);
        })
    }

   

    let action ;

    if (flipCoin(this.epsilon)){
        // console.log("random done")
        action = legalActions[Math.floor(Math.random() * legalActions.length)];
    }

    else{
        // console.log("policy done")
        action = this.getPolicy(state, legalActions);
    }

    // console.log("qvalue", this.getQvalue(state, DIRECTIONS.ArrowRight));
    // console.log("getvalue", this.getValue(state, legalActions));

    this.score = score;
    this.lastAction= action;
    this.lastState = state;

    return action;

    //gets features of last state
    //updates the weights
    //action either from policy or chosen randomly
  }


  getPolicy(state, legal_actions) {
    //   let i=0;
    let value = this.getMaxQValue(state, legal_actions);
    for(const action of legal_actions){
        // console.log("i", i++);
        if(value === this.getQValue(state, action)){
            return action;
        }
    }
    //
  }

  getMaxQValue(state, legal_actions){
      let values =[];
      legal_actions.forEach(action=>{
          values.push(this.getQValue(state,action));
      });

    //   console.log("values",values);

      if (values.length!==0){
        //   console.log("it's not empty okay")
          return Math.max(...values)
      }
      else{
          return 0;
      }
  }

  getQValue(state, action) {
    let features = this.getFeatures(state, action);
    let Qvalue = 0.0;

    if(!this.weights){
      this.weights={};
      Object.keys(features).forEach((key)=>{
          this.weights[key]=0;
      })

    //   console.log("yes weight was null")
    //   console.log(this.weights);
    }

    Object.keys(features).forEach((key)=>{
        Qvalue+= this.weights[key]*features[key];
    })
    return Qvalue;
  //gets features and computes q values
}


  update(state, action, nextState, reward, legal_actions){
      let QValue=0;
      let difference = reward + (this.discount*this.getMaxQValue(nextState, legal_actions)- this.getQValue(state, action))
      let features = this.getFeatures(state, action);
      console.log("diff",difference)

    
    //   console.log("reward",reward)


      Object.keys(features).forEach((feature)=>{
        //   console.log(feature,features[feature]);
        //   console.log(feature,"weight",this.weights[feature]);
          this.weights[feature]+= features[feature]*this.alpha*difference;
      })

  }




  //called when gameOver
  final(score) {
    //   console.log("final is called ");
    let reward = score-this.score;
    console.log("reward",reward);

    this.decrementinScore = 0;
    this.score = 0;
    this.lastAction=  null;
    this.lastState = null;





  }


}
