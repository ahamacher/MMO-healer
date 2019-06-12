class Spells {
  constructor(options){
    this.game = options.game;
  }

  cure(target) {
    // add cast time and animation
    if (this.game.mp > 10){
      setTimeout(() => {
        if (!target.isDead()){
          target.currentHp += 20;
          this.game.healed += 20;
        }
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
          if (!member.isDead()){
            member.currentHp += 15;
            this.game.healed += 15;
          }
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

  esuna(target) {
    if (this.game.mp > 10) {
      setTimeout(() => {
        if (!target.isDead()) {
          target.debuffs.pop();
        }
        this.game.mp = this.game.mp - 10;
      }, 1500);
      this.game.activeGCD = true;
      this.game.spellText = "Esuna";
      this.game.castTime = 0;
      this.game.isCasting = true;
      this.game.castTimeInitial = 1500;
    }
  }

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
    }
  }

  revive(target) {
    if (this.game.mp > 100 && target.isDead()) {
      setTimeout(() => {
        target.currentHp = Math.floor(target.maxHp * 0.35);
        this.game.mp = this.game.mp - 100;
      }, 3600);
      this.game.activeGCD = true;
      this.game.spellText = "Revive";
      this.game.castTime = 0;
      this.game.isCasting = true;
      this.game.castTimeInitial = 3600;
    }
  }

  impactHeal(target) {
    if (this.game.mp > 5 && target.currentHp > 0) {
      target.currentHp += Math.floor(target.maxHp * 0.35);
      if (target.currentHp > target.maxHp) {
        this.game.overheal += (target.currentHp - target.maxHp);
        target.currentHp = target.maxHp;
      }
      this.game.mp = this.game.mp - 5;
      this.game.impactCD = 20000;
    }
  }
}

module.exports = Spells;