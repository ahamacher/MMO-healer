
## MMO Healer
### Background and Overview

  I play healers in MMO’s, it is a brutal thankless position. I would like to impart some of my experiences into a healing minigame. 

  MMO Healer is a raid healing minigame. The goal is to complete the encounter while your party does everything it can to try and fail. Select skills to use and which keys to bind them to, then use skills to keep your party alive. Each stage consists of a boss, who will perform different moves on different targets. sometimes these targets are chosen, sometimes random. 

The game consists of multiple levels each with their own mechanics and specific spell requirements.

### Functionality and MVP Features
* script to simulate fights
  * bosses need to have skill use text
  * raid members need to have health bars, debuff icons
  * bosses to have some scripted and some random interactions
    * example: a boss chooses from a list of 3 different moves normally but if the boss hits a certain % of life left they will change up their moves and cast specific skills.
* different spells
  * Spells need to have both a cast time and a mana cost
  * Spells chosen from a list of potential spells
* keyboard bindings
  * assign spells to keybindings
  * lets a player use buttons familiar to them
* multiple levels
  * different encounters, each bringing unique challenges.
### Architecture and Technologies
* Technology 1
    * Vanilla JavaScript
* Technology 2
    * HTML Canvas
    * needed to render objects
* Technology 3
    * Webpack
    * needed to pack JS
### Implementation Timeline

Wednesday
* Project proposal
* wireframes
* technology research (canvas, vanilla js rendering)
* plan encounter(s) / spells available

Thursday
* create encounter
* create raid members
* create player
* eod thursday goal - encounter should be able to be played with no decent graphics

Friday
* create multiple encounters
* add level system
* add spell changing system
* add canvas rendering to game objects
* add input areas for assignable keys

Weekend
* Add styling
* Add icons and pictures to game
* refine game logic
* create how to play display
* push to heroku
