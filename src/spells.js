class Spells {
  constructor(options){
    this.game = options.game;
  }

  cure(target) {
    // add cast time and animation
    if (this.game.mp > 10){
      setTimeout(() => {
        console.log(`cure was used!`);
        target.currentHp += 20;
        if (target.currentHp > target.maxHp){
          target.currentHp = target.maxHp;
        }
        this.game.mp -= 10;
      }, 1500);
      this.game.activeGCD = true;
      this.game.spellText = "Cure";
      this.game.castTime = 0;
      this.game.isCasting = true;
      this.game.castTimeInitial = 1500;
      this.game.gcdWait();
    }
  }

  regen(target) {
    const regen = { type: 'heal', heal: 5, duration: 15000 }
    target.buffs.push(regen);
    this.mp -= 15;
    this.game.activeGCD = true;
    this.game.gcdWait();
  }
}

module.exports = Spells;