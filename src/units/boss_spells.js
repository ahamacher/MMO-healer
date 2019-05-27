class BossSpells {
  constructor(options){
    this.target = options.target;
    this.boss = options.boss;
    this.game = options.game;
    this.ahkCast = false;
    this.ahkmornCount = 0;
    this.delay = 500;
  }

  flare() {
    const { party } = this.game;
    const randomDmg = (Math.random() * 5) + 20;
    this.boss.currentSpell = "Flare";
    this.boss.casting = true;
    this.boss.castTime = BossSpells.FLARE;
    this.boss.currentCastTime = 0;
    setTimeout(() => {

      party.forEach(member => {
        if (member.currentHp > 0 && this.boss.currentHp > 0) {
          member.currentHp = member.currentHp - randomDmg;
        }
        if (member.currentHp < 0) {
          member.currentHp = 0;
        }
      });
      this.boss.casting = false;
    }, BossSpells.FLARE);
  }

  ahkmorn() {
    const { party } = this.game;
    const randomDmg = (Math.random() * 5) + 15;
    this.boss.currentSpell = "Ahkmorn";
    this.boss.casting = true;
    this.boss.castTime = BossSpells.AHKMORN;
    this.boss.currentCastTime = 0;
    setTimeout(() => {
      party.forEach(member => {
        if (member.currentHp > 0 && this.boss.currentHp > 0) {
          member.currentHp = member.currentHp - randomDmg;
        }
        if (member.currentHp < 0) {
          member.currentHp = 0;
        }
      });
      this.ahkmornCount = 0;
      this.ahkmornFast();
    }, BossSpells.AHKMORN);
  }

  ahkmornFast() {
    const { party } = this.game;
    const randomDmg = (Math.random() * 5) + 20;

    if (this.ahkmornCount < 6){
      this.delay += (500 * this.ahkmornCount);
      setTimeout(() => {
        party.forEach(member => {
          if (member.currentHp > 0 && this.boss.currentHp > 0) {
            member.currentHp = member.currentHp - randomDmg;
          }
          if (member.currentHp < 0) {
            member.currentHp = 0;
          }
        });
      }, this.delay);
      this.ahkmornCount += 1;
      this.ahkmornFast();
    } else {
      this.endCast();
    }
  }

  endCast() {
    this.boss.casting = false;
  }
}


BossSpells.FLARE = 2500;
BossSpells.AHKMORN = 4500;

module.exports = BossSpells;
