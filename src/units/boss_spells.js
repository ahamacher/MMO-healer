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
          this.game.deathCount += 1;
          member.currentHp = 0;
        }
      });
      this.boss.casting = false;
    }, BossSpells.FLARE);
  }

  lifeShaver() {
    const { party } = this.game;
    const random = Math.floor(Math.random() * 2);
    const selectedTank = party[random];
    const heavyDmg = selectedTank.maxHp * 0.6;

    this.boss.currentSpell = "Life Shaver";
    this.boss.casting = true;
    this.boss.castTime = BossSpells.LIFESHAVER;
    this.boss.currentCastTime = 0;
    setTimeout(() => {
      if (selectedTank.currentHp > 0 && this.boss.currentHp > 0) {
        selectedTank.currentHp -= heavyDmg;
      }
      if (selectedTank.currentHp < 0) {
        this.game.deathCount += 1;
        member.currentHp = 0;
      }
      this.boss.casting = false;
    }, BossSpells.LIFESHAVER);
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
          this.game.deathCount += 1;
          member.currentHp = 0;
        }
      });
      this.ahkmornCount = 0;
      this.ahkmornFast();
    }, BossSpells.AHKMORN);
  }

  bio() {
    const { party } = this.game;
    const randomIdx = Math.floor(Math.random()* party.length);
    const randomMember = party[randomIdx];
    const posion = { type: 'posion', dmg: 5, duration: 15000 };
    this.boss.currentSpell = "Bio";
    this.boss.casting = true;
    this.boss.castTime = BossSpells.BIO;
    this.boss.currentCastTime = 0;
    setTimeout(() => {
      if (randomMember.currentHp > 0 && this.boss.currentHp > 0){
        randomMember.currentHp -= 5;
        randomMember.debuffs.push(posion);
      }
      this.boss.casting = false;
    }, BossSpells.BIO);
  }

  breakWeapon() {
    const { party } = this.game;
    const randomIdx = Math.floor(Math.random() * party.length);
    const randomMember = party[randomIdx];
    const breakWeapon = { type: 'BreakWeapon', dmg: 0, duration: 15000 };
    this.boss.currentSpell = "Break Weapon";
    this.boss.casting = true;
    this.boss.castTime = BossSpells.BREAKWEAPON;
    this.boss.currentCastTime = 0;
    setTimeout(() => {
      if (randomMember.currentHp > 0 && this.boss.currentHp > 0) {
        randomMember.debuffs.push(breakWeapon);
      }
      this.boss.casting = false;
    }, BossSpells.BREAKWEAPON);
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
            this.game.deathCount += 1;
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
BossSpells.BIO = 1200;
BossSpells.BREAKWEAPON = 1800;
BossSpells.LIFESHAVER = 2800;
BossSpells.AHKMORN = 4500;

module.exports = BossSpells;
