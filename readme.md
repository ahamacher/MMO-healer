
## MMO Healer
### Background and Overview

  I play healers in MMO’s, it is a brutal thankless position, your goal is to not let any of your fellow party members die and compensate for their mistakes. I would like to impart some of my experiences into a healing minigame. 

  ![Each object is interactable and keeps track of its own state](/mmohealer-snap.png)

  MMO Healer is a raid healing minigame. The goal is to complete the encounter while your party does everything it can to try and fail. Use skills to keep your party alive, click on a unit to target that unit with your spells. Each stage consists of a boss, who will perform different moves on different targets. sometimes these targets are chosen, sometimes random. 

### Functionality and MVP Features
* script to simulate fights
  * bosses need to have skill use text
  * raid members need to have health bars, debuff icons
  * bosses to have some scripted and some random interactions
    * example: a boss is choosing which attack to perform so it randomly selects from an array of possible spells.
* keyboard bindings
  * assign spells to keybindings
  * player is required to use both the mouse and the keyboard together to complete the game
* multiple levels
  * different encounters, each bringing unique challenges.

### Code Snippets

  This code snippet is for my boss logic to select a random npc, however I wanted to have the randomization to be weighted so the "Tank" units are attacked more often than the rest of the units. To do this each unit on creation was given a unit weighting based on its object type. I then call `attackRandom()` everytime the boss needs to attack to have it select a new random target and then attack that target. 
  
```js
  selectRandom() {
    let weights = [];
    this.game.party.forEach((member, idx) => {
      for (let i = 0; i < member.weight; i++){
        weights.push(idx);
      }
    });
    const selectedIdx = Math.floor(Math.random() * weights.length);
    return weights[selectedIdx];
  }

  attackRandom(){
    let selectedTarget = this.selectRandom();
    const alive = this.game.party.find(target => target.currentHp > 0);
    if (this.game.party[selectedTarget].currentHp <= 0){
      selectedTarget = this.game.party.indexOf(alive);
    }
    if (alive) {
      this.attack(this.game.party[selectedTarget]);
    }
  }
```
  
  This next code snippet is of one of my player spells, this one is for a heal that hits all of the players party and then applies a buff to each one of them. As a part of the Npc class each unit can handle a buff being placed on them, each unit tracks how long it has been since a buff has been used and once the threshold is cleared the buff is activated and the counter reset.
    
    
```js
aoeRegen() {
  const regen = { type: 'heal', heal: 5, duration: 20000, activation: 0 };
  if (this.game.mp > 75) {
    setTimeout(() => {
      this.game.party.forEach(member => {
        if (!member.isDead()) {
          member.currentHp += 5;
          this.game.healed += 5;
          member.buffs.push(regen);
        }
        if (member.currentHp > member.maxHp) {
          this.game.overheal += member.currentHp - member.maxHp;
          member.currentHp = member.maxHp;
        }
      });
      this.game.mp = this.game.mp - 75;
    }, 1500);
    this.game.activeGCD = true;
    this.game.spellText = "Aoe Regen";
    this.game.castTime = 0;
    this.game.isCasting = true;
    this.game.castTimeInitial = 1500;
}}

  // part of npc.js //

statusAction(speed){
  let removal = [];
  if (this.buffs.length > 0) {
    this.buffs.forEach(buff => {
      if (!this.isDead()) {
      if (buff.activation <= 500) {
        buff.activation += speed;

      } else {
        this.executeBuff(buff);
        buff.duration -= buff.activation;
        buff.activation = 0;
      }
    } else {
      buff.duration = 0;
    }
    });
    removal = this.buffs.filter(buff => buff.duration <= 0);
    this.remove(removal);
  }
}

```

### Architecture and Technologies
* Technology 1
    * Vanilla JavaScript
* Technology 2
    * HTML Canvas
    * needed to render objects
* Technology 3
    * Webpack
    * needed to pack JS