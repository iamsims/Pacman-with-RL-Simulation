## Pacman-with-RL-simulation

This is a Pacman game made in JS. The four ghosts, Blinky, Pinky, Inky and Cylde have different personalities. 
Blinky moves to the tile which positions itself nearest to Pacman. Euclidean distance between the two position vectors is used by Blinky to calculate the shortest distance, regardless of any obstacles. Pinky has it's target tile four step ahead of Pacman's position and uses the same algorithm as Blinky to position itself closer to its target tile. Inky moves randomly. Cylde is supposed to have a fixed movement, but random movement is used in this project. 
 
The game has two modes as follows:

### 1. User playable mode
  It consists of four ghosts. Arrow keys are used to move the Pacman.
  
### 2. RL simulation mode
  It consists of two ghosts Blinky and Pinky. The other two ghosts are removed in this mode to make the game deterministic for implementaion. Approximate Q- learning is used so that Pacman learns to generalize on larger layouts by extracting common features. It starts learning from absolutely no knowledge about the model or rules.Pacman keeps on restarting for 20 iterations. In 16 iterations for training, the Pacman learns to play fairly well and starts testing for the remaining four iterations. The stats bar in the right shows the weights provided to the features by the leanring PacmanAgent, the number of iterations completed per the total iterations to be performed, the Test/Train operation and the score obtained.   

## Tasks:
- [x] User playable
- [x] Ghost personalities
- [x] Approximate Q-Learning Simulation
- [x] Depleting exploration per training iteration
- [x] Menu UI
- [x] Stats UI
- [ ] Option to view testing
- [x] Summarize training and testing
- [ ] Code Refactor
- [ ] Add delay between two training episodes
- [ ] Change parameters for training and testing iteration of PacmanAgent

## Reference:
http://ai.berkeley.edu/reinforcement.html

