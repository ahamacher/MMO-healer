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
        this.game.healed += 20;
        if (target.currentHp > target.maxHp){
          this.game.overheal += target.currentHp - target.maxHp;
          target.currentHp = target.maxHp;
        }
        this.game.mp = this.game.mp - 10;
      }, 1500);
      this.game.activeGCD = true;
      this.game.spellText = "Cure";
      this.game.castTime = 0;
      this.game.isCasting = true;
      this.game.castTimeInitial = 1500;
      // this.game.gcdWait();
    }
  }

  regen(target) {
    const regen = { type: 'heal', heal: 5, duration: 15000, activation: 0 };
    target.buffs.push(regen);
    this.game.mp -= 15;
    this.game.activeGCD = true;
    // this.game.gcdWait();
  }

  aoeHeal() {
    //no target needed
    if (this.game.mp > 30) {
      setTimeout(() => {
        this.game.party.forEach(member => {
          member.currentHp += 15;
          this.game.healed += 15;
          if (member.currentHp > member.maxHp) {
            this.game.overheal += member.currentHp - member.maxHp;
            member.currentHp = member.maxHp;
          }
        });
        this.game.mp = this.game.mp - 30;
      }, 1500);
      this.game.activeGCD = true;
      this.game.spellText = "Aoe Heal";
      this.game.castTime = 0;
      this.game.isCasting = true;
      this.game.castTimeInitial = 1500;
    }
  }
}

module.exports = Spells;