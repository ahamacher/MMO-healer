class BossSpells {
  constructor(options){
    this.target = options.target;
    this.boss = options.boss;
    this.game = options.game;
    this.ahkCast = false;
    this.ahkmornCount = 0;
    this.delay = 500;
    this.dualCount = 0;
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
    let tankCount = 0;
    party.forEach(member => {
      if (member.maxHp === 200){
        tankCount += 1;
      }
    });
    const random = Math.floor(Math.random() * tankCount);
    let selectedTank = party[random];
    // if (selectedTank.isDead()){
    //   selectedTank = party.find(member => member.currentHp > 0);
    // }

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
        selectedTank.currentHp = 0;
      }
      this.boss.casting = false;
    }, BossSpells.LIFESHAVER);
  }

  ahkmorn() {
    const { party } = this.game;
    const randomDmg = Math.floor(Math.random() * 5) + 15;
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
    const posion = { type: 'posion', dmg: 5, duration: 15000, activation: 0};
    this.boss.currentSpell = "Bio";
    this.boss.casting = true;
    this.boss.castTime = BossSpells.BIO;
    this.boss.currentCastTime = 0;
    setTimeout(() => {
      if (randomMember.currentHp > 0 && this.boss.currentHp > 0){
        randomMember.currentHp -= 5;
        randomMember.buffs.push(posion);
      }
      this.boss.casting = false;
    }, BossSpells.BIO);
  }

  breakWeapon() {
    const { party } = this.game;
    const randomIdx = Math.floor(Math.random() * party.length);
    const randomMember = party[randomIdx];
    const breakWeapon = { type: 'BreakWeapon', dmg: 0, duration: 15000, activation: 0};
    this.boss.currentSpell = "Break Weapon";
    this.boss.casting = true;
    this.boss.castTime = BossSpells.BREAKWEAPON;
    this.boss.currentCastTime = 0;
    setTimeout(() => {
      if (randomMember.currentHp > 0 && this.boss.currentHp > 0) {
        randomMember.buffs.push(breakWeapon);
      }
      this.boss.casting = false;
    }, BossSpells.BREAKWEAPON);
  }

  ahkmornFast() {
    const { party } = this.game;
    const randomDmg = Math.floor(Math.random() * 5) + 20;

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

  holy() {
    const { party } = this.game;
    const holyDmg = 45;
    const breakWeapon = { type: 'BreakWeapon', dmg: 0, duration: 15000, activation: 0 };
    this.boss.currentSpell = "Holy";
    this.boss.casting = true;
    this.boss.castTime = BossSpells.HOLY;
    this.boss.currentCastTime = 0;
    setTimeout(() => {
      party.forEach(member => {
        if (member.currentHp > 0 && this.boss.currentHp > 0) {
          member.currentHp = member.currentHp - holyDmg;
          member.receiveBuff(breakWeapon);
        }
        if (member.currentHp < 0) {
          this.game.deathCount += 1;
          member.currentHp = 0;
        }
      });
      this.endCast();
    }, BossSpells.HOLY);
  }

  meteor(){
    const { party } = this.game;
    const randomDmg = Math.floor(Math.random() * 75) + 15;
    this.boss.currentSpell = "Meteor";
    this.boss.casting = true;
    this.boss.castTime = BossSpells.METEOR;
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
      this.endCast();
    }, BossSpells.METEOR);
  }

  apocalypse(){
    const { party } = this.game;
    const massiveDamage = 1000;
    this.boss.currentSpell = "Apocalypse";
    this.boss.casting = true;
    this.boss.castTime = BossSpells.APOCALYPSE;
    this.boss.currentCastTime = 0;
    setTimeout(() => {
      party.forEach(member => {
        if (member.currentHp > 0 && this.boss.currentHp > 0) {
          member.currentHp = member.currentHp - massiveDamage;
        }
        if (member.currentHp < 0) {
          this.game.deathCount += 1;
          member.currentHp = 0;
        }
      });
      this.endCast();
    }, BossSpells.APOCALYPSE);
  }

  dualCast() {
    const spells = ["Flare", "Bio II", "Holy"];
    const selectedSpell = spells[Math.floor(Math.random() * spells.length)];

    this.boss.currentSpell = "Dualcast " + selectedSpell;
    this.boss.casting = true;
    this.boss.castTime = BossSpells.DUALCAST;
    this.boss.currentCastTime = 0;
    setTimeout(() => {
      this.secondCast(selectedSpell);
      this.endCast();
    }, BossSpells.DUALCAST);
  }

  secondCast(spell){
    const { party } = this.game;
    const breakWeapon = { type: 'BreakWeapon', dmg: 0, duration: 15000, activation: 0 };
    const posion = { type: 'posion', dmg: 5, duration: 15000, activation: 0 };

    switch (spell) {
      case "Holy":
        party.forEach(member => {
          if (member.currentHp > 0 && this.boss.currentHp > 0) {
            member.currentHp = member.currentHp - 40;
            member.receiveBuff(breakWeapon);
          }
          if (member.currentHp < 0) {
            this.game.deathCount += 1;
            member.currentHp = 0;
          }
        });
        break;
      case "Bio II":
        party.forEach(member => {
          if (member.currentHp > 0 && this.boss.currentHp > 0) {
            member.receiveBuff(posion);
          }
        });
        break;
      case "Flare":
        party.forEach(member => {
          if (member.currentHp > 0 && this.boss.currentHp > 0) {
            member.currentHp = member.currentHp - 25;
          }
          if (member.currentHp < 0) {
            this.game.deathCount += 1;
            member.currentHp = 0;
          }
        });
        break;
      default:
        break;
    }
    if (this.dualCount === 0){
      this.dualCount = 1;
      setTimeout(() => this.secondCast(spell), 800);
    } else {
      this.dualCount = 0;
    }
  }

  endCast() {
    this.boss.casting = false;
  }
}



BossSpells.FLARE = 2500;
BossSpells.BIO = 1200;
BossSpells.HOLY = 2800;
BossSpells.BREAKWEAPON = 1800;
BossSpells.LIFESHAVER = 2800;
BossSpells.AHKMORN = 4500;
BossSpells.METEOR = 3500;
BossSpells.DUALCAST = 2800;
BossSpells.APOCALYPSE = 9000;

module.exports = BossSpells;
