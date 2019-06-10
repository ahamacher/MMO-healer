const Tank = require("./units/tank.js");
const Healer = require("./units/healer.js");
const Dps = require("./units/dps.js");
const Boss = require("./units/boss.js");
const Spells = require("./spells.js");
const BossSpells = require("./units/boss_spells.js");

class Game {
  constructor(options){
    // teamcomp array goes {tanks: X, healer: Y, dps: Z}
    this.comp = options.comp;
    this.bossScript = options.bossScript;
    this.party = [];
    this.dead = options.dead;
    this.activeGCD = false;
    this.gcdTime = 1800;
    this.gcdRemaining = 1800;
    this.isCasting = false;
    this.castTimeInitial = 0;
    this.castTime = 0;
    this.spellText = "";
    this.mp = 1000;
    this.bg = options.bg;
    this.spellIcons = options.spellIcons;
    this.statusIcon = options.statusIcon;
    this.overheal = 0;
    this.healed = 0;
    this.deathCount = 0;
    this.gameOver = false;

    this.impactCD = 0;
    this.impactMaxCD = 20000;

    // boss spell counters for hp % timers
    this.nextBossSpell = null;

    // probably not needed
    this.ctx = options.ctx;
    this.canvas = options.canvas;

    // creating units
    this.addFriendlyNpc(options.ctx, options.canvas);
    this.addBoss(options.ctx, options.canvas, options.bossSrc);
    this.addPlayerSpells();
    this.makeBossSpells();

  }

  findSelected(){
    const selected = this.party.find(member => member.selected === true);
    
    this.party.forEach(member => {
      if (member !== selected){
        member.selected = false;
      }
    });
    return selected;
  }

  clearSelected(){
    this.party.forEach(member => {
      member.selected = false;
    });
  }

  deadPlayerCheck(){
    let player;
    this.party.forEach(member => {
      if (member.attackValue === 0) {
        player = member;
      }
    });
    if (player.currentHp === 0){
      this.gameOver = true;
    }
  }

  addFriendlyNpc(ctx, canvas){
    if (this.comp.tank + this.comp.healer + this.comp.dps > 20){
      return "error too many partymembers";
    }
    let pos = 0;
    let i = 0;
    let j = 0;
    let k = 0;

    while (i < this.comp.tank){
      this.party.push(new Tank({pos: Game.NPC_POS[pos], ctx, canvas, game: this, speed: Game.SPEED, statusIcon: this.statusIcon}));
      // this.addNpcListener(pos);
      pos = pos + 1;
      i = i + 1;
    }
    while (j < this.comp.healer){
      this.party.push(new Healer({ pos: Game.NPC_POS[pos], ctx, canvas, game: this, speed: Game.SPEED, statusIcon: this.statusIcon}));
      // this.addNpcListener(pos);
      pos = pos + 1;
      j = j + 1;
    }
    while (k < this.comp.dps){
      this.party.push(new Dps({ pos: Game.NPC_POS[pos], ctx, canvas, game: this, speed: Game.SPEED, statusIcon: this.statusIcon}));
      // this.addNpcListener(pos);
      pos = pos + 1;
      k = k + 1;
    }
  }

  addBoss(ctx, canvas, bossSrc) {
    this.boss = new Boss({ pos: [633,104], ctx, canvas, game: this, bossSrc });
  }

  playerCastBar(ctx) {
    if (this.isCasting){
      let barLength = ((this.castTime / this.castTimeInitial) * 275);
      if (this.castTime < Game.SPEED) {
        barLength = 0;
      }

      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.rect(148, 463, 275, 21);
      ctx.fill();

      ctx.fillStyle = '#9900cc';
      ctx.beginPath();
      ctx.rect(148, 463, barLength, 21);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = "18px Arial";
      ctx.textAlign = "center";
      ctx.fillText(this.spellText, 285.5, 480.5);

      this.castTime += Game.SPEED;
    }
    if (this.castTime >= this.castTimeInitial){
      this.castTime = 0;
      this.isCasting = false;
      this.castTimeInitial = 0;
      this.spellText = "";
    }
  }

  manaBar(ctx){
    // manabar backing
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.rect(148, 433, 275, 21);
    ctx.fill();

    const currentMp = ((this.mp / 1000) * 275);
    ctx.fillStyle = '#0066cc';
    ctx.beginPath();
    ctx.rect(148, 433, currentMp, 21);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = "18px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Mana", 285.5, 450.5);
  }

  addPlayerSpells(){
    let selected;
    document.addEventListener('keydown', (e) => {
      switch (e.which){
        case 49:
          selected = this.findSelected();
          if (!this.activeGCD) {
            new Spells({ game: this }).cure(selected);
          }
          break;
        case 50:
          selected = this.findSelected();
          if (!this.activeGCD) {
            new Spells({ game: this }).regen(selected);
          }
          break;
        case 51:
          if (!this.activeGCD) {
            new Spells({game: this}).aoeHeal();
          }
          break;
        case 52:
          if (!this.activeGCD) {
            new Spells({game: this}).aoeRegen();
          }
          break;
        case 53:
          // if (!this.activeGCD) {
          //   new Spells({game: this}).esuna();
          // }
          selected = this.findSelected();
          if (this.impactCD === 0) {
            new Spells({ game: this }).impactHeal(selected);
          }
          break;
        case 54:
          // selected = this.findSelected();
          // if (this.impactCD === 0) {
          //   new Spells({ game: this }).impactHeal(selected);
          // }
          selected = this.findSelected();
          if (selected.currentHp === 0) {
            new Spells({ game: this }).revive(selected);
          }
          break;
        case 48:
          this.boss.currentHp = 1;
          break;
      }
    });
  }

  drawPlayerBox(ctx){
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    ctx.fillStyle = '#CCCCCC';
    ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

    ctx.fillStyle = "#99ccff";
    ctx.beginPath();
    ctx.rect(40, 40, 475, 375);
    ctx.fill();
  }

  animateGCD(ctx){
    if (this.activeGCD) {
      this.gcdRemaining = this.gcdRemaining - Game.SPEED;
      if (this.gcdRemaining <= 0){
        this.activeGCD = false;
        this.gcdRemaining = this.gcdTime;
      }
      // 1800/ 63 = x / crr time 
      const gcdHeight = Math.floor((this.gcdRemaining / this.gcdTime) * 63);
      
      // spell 1
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.beginPath();
      ctx.rect(40, 502, 63, gcdHeight);
      ctx.fill();

      // spell 2
      ctx.beginPath();
      ctx.rect(123, 502, 63, gcdHeight);
      ctx.fill();

      // spell 3
      ctx.beginPath();
      ctx.rect(206, 502, 63, gcdHeight);
      ctx.fill();

      // spell 4
      ctx.beginPath();
      ctx.rect(289, 502, 63, gcdHeight);
      ctx.fill();

      // spell 5
      ctx.beginPath();
      ctx.rect(372, 502, 63, gcdHeight);
      ctx.fill();

      // spell 6
      ctx.beginPath();
      ctx.rect(455, 502, 63, gcdHeight);
      ctx.fill();
    }
  }

  animateSpellCD(ctx){
    if (this.impactCD) {
      this.impactCD = this.impactCD - Game.SPEED;
      if (this.impactCD <= 0) {
        this.impactCD = 0;
      }
    }
      // 1800/ 63 = x / crr time 
    const impactCDHeight = Math.floor((this.impactCD / this.impactMaxCD) * 63);

    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath();
    ctx.rect(372, 502, 63, impactCDHeight);
    ctx.fill();
  }

  drawPlayerSpells(ctx){
    // spell 1
    ctx.fillStyle = '#99ccff';
    ctx.drawImage(
      this.spellIcons.cureIcon, 40, 502,63,63
    );

    // spell 2
    ctx.drawImage(
      this.spellIcons.regenIcon, 123, 502, 63, 63
    );

    // spell 3
    ctx.drawImage(
      this.spellIcons.aoeHeal, 206, 502, 63, 63
    );

    // spell 4
    ctx.drawImage(
      this.spellIcons.aoeRegen, 289, 502, 63, 63
    );

    // spell 5
    ctx.drawImage(
      this.spellIcons.esuna, 372, 502, 63, 63
    );

    // spell 6
    ctx.drawImage(
      this.spellIcons.revive, 455, 502, 63, 63
    );
  }

  drawMonsterBox(ctx){
    // monster hp
    ctx.fillStyle = '#cc0000';
    ctx.beginPath();
    ctx.rect(605, 55, 300, 26);
    ctx.fill();
  }

  bossAttack() {
    if (this.boss.timeSinceAttack < this.boss.attackRate && !this.boss.casting) {
      this.boss.timeSinceAttack += Game.SPEED;
    } else if (!this.boss.casting) {
      this.boss.attackRandom();
      this.boss.timeSinceAttack = 0;
    }
  }

  makeBossSpells() {
    const options = { game: this, boss: this.boss, party: this.party };
    this.bossSpells = new BossSpells(options);
  }

  castBossSpell(spell) {
    this.bossSpells[`${spell}`]();
  }

  bossCastBar(ctx){
    if (this.boss.casting) {
      let barLength = ((this.boss.currentCastTime / this.boss.castTime) * 300);
      if (this.currentCastTime >= this.boss.castTime) {
        this.boss.casting = false;
        this.boss.currentCastTime = 0;
        this.game.castTime = 0;
      }
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.rect(605, 476, 300, 26);
      ctx.fill();

      ctx.fillStyle = '#9900cc';
      ctx.beginPath();
      ctx.rect(605, 476, barLength, 26);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = "18px Arial";
      ctx.textAlign = "center";
      ctx.fillText(this.boss.currentSpell, 755, 496);

      this.boss.currentCastTime += Game.SPEED;
    }
  }

  playerAttack() {
    this.party.forEach(member => {
      if (member.timeSinceAttack < member.attackRate) {
        member.timeSinceAttack += Game.SPEED;
      } else {
        member.attack(this.boss);
        member.timeSinceAttack = 0;
      }
    });
  }

  checkBossHp() {
    const currentHpPc = Math.floor(this.boss.currentHp / this.boss.maxHp * 100);
    if (this.nextBossSpell === null) {
      this.nextBossSpell = this.bossScript.shift();
    }
    
    if (this.nextBossSpell && currentHpPc <= this.nextBossSpell.hp) {
      this.castBossSpell(this.nextBossSpell.spell);
      this.nextBossSpell = null;
    }
  }

  draw(ctx){
    // boss attacks
    this.bossAttack();
    this.playerAttack();
    this.checkBossHp();

    // npc bounding box
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    ctx.fillStyle = '#CCCCCC';
    ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
    
    // ctx.beginPath();
    ctx.drawImage(this.bg, 0, 0, Game.DIM_X, Game.DIM_Y);

    ctx.fillStyle = "rgba(82, 82, 122, 0.5)";
    ctx.beginPath();
    ctx.rect(40, 40, 475, 375);
    ctx.fill();

    // drawing player spell list
    this.drawPlayerSpells(ctx);

    //drawing monster box
    this.drawMonsterBox(ctx);
    this.boss.draw(ctx);

    // rendering all npc frames
    this.party.forEach(member => {
      member.draw(ctx);
      // this.showSelected();
    });
    this.playerCastBar(ctx);
    this.manaBar(ctx);
    this.animateGCD(ctx);
    this.animateSpellCD(ctx);
    this.bossCastBar(ctx);
    this.deadPlayerCheck();
  }
}

Game.DIM_X = 1000;
Game.DIM_Y = 600;
Game.SPEED = 33;

Game.NPC_POS = [
  [57,90], [148, 90], [239,90], [330,90], [421,90],
  [57,171], [148, 171], [239,171], [330,171], [421,171],
  [57,252], [148, 252], [239,252], [330,252], [421,252],
  [57,333], [148, 333], [239,333], [330,333], [421,333]
];

module.exports = Game;
