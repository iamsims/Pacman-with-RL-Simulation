//write code for PAcman.js


class PacmanAgent{
    constructor(numTraining, epsilon=0.05, alpha=0.2, gamma=0.8 ){
        this.numTraining = numTraining
        this.episodesSoFar = 0
        this.epsilon = epsilon
        this.alpha = alpha
        this.discount = gamma
    }

    

    getFeatures(){

        //gets the features of the game

    }

    //gets action
    //called by pacman to get move from agent
    
    getAction(state){
        //gets features of last state
        //updates the weights
        //action either from policy or chosen randomly 

    }

    getPolicy(){
        //
    }

    getQvalue(){
        //gets features and computes q values
    }

    //called when gameOver
    final(){

    }

    getLegalPacmanActions(){
        //used by getAction to get all legal actions

    }





}