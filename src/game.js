const Tank = require("./units/tank.js");
const Healer = require("./units/healer.js");
const Dps = require("./units/dps.js");
const Boss = require("./units/boss.js");
const Spells = require("./spells.js");
const BossSpells = require("./units/boss_spells.js");
const GameErrors = require("./errors.js");

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
    this.gameOverBad = false;
    this.currentLevel = options.level;
    this.errorCode = 0;
    this.errorDisplay = null;
    this.mpRegenTimer = 75;
    this.hovered = null;

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
    this.addClickableSpells(options.ctx);
    this.addSpellHover(options.ctx);
    this.makeBossSpells();

  }

  findSelected(){
    const selected = this.party.find(member => member.selected === true);
    
    this.party.forEach(member => {
      if (member !== selected){
        member.selected = false;
      }
    });
    if (selected) {
      return selected;
    } else {
      return false;
    }
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
      this.gameOverBad = true;
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
      const npcIcon = this.getRandomIcon("tank");
      this.party.push(new Tank({
        pos: Game.NPC_POS[pos], 
        ctx, 
        canvas, 
        game: this, 
        speed: Game.SPEED, 
        statusIcon: this.statusIcon, 
        npcIcon: npcIcon }));
      // this.addNpcListener(pos);
      pos = pos + 1;
      i = i + 1;
    }
    while (j < this.comp.healer){
      const npcIcon = this.getRandomIcon("healer");
      this.party.push(new Healer({ 
        pos: Game.NPC_POS[pos], 
        ctx, 
        canvas, 
        game: this, 
        speed: Game.SPEED, 
        statusIcon: this.statusIcon,
        npcIcon: npcIcon }));
      // this.addNpcListener(pos);
      pos = pos + 1;
      j = j + 1;
    }
    while (k < this.comp.dps){
      const npcIcon = this.getRandomIcon("dps");
      this.party.push(new Dps({ 
        pos: Game.NPC_POS[pos], 
        ctx, 
        canvas, 
        game: this, 
        speed: Game.SPEED, 
        statusIcon: this.statusIcon,
        npcIcon: npcIcon }));
      // this.addNpcListener(pos);
      pos = pos + 1;
      k = k + 1;
    }
  }

  getRandomIcon(unit) {
    const tankNum = 2;
    const dpsNum = 5;
    const healerNum = 2;

    let numUnit;
    let imgSrc = './assets/sprites/';

    switch (unit) {
      case "tank":
        numUnit = this.getRandNum(tankNum);
        imgSrc += "tank" + numUnit + ".png";
        const tankIcon = new Image(1,1);
        tankIcon.src = imgSrc;
        return tankIcon;
      case "dps":
        numUnit = this.getRandNum(dpsNum);
        imgSrc += "dps" + numUnit + ".png";
        const dpsIcon = new Image(1,1);
        dpsIcon.src = imgSrc;
        return dpsIcon;
      case "healer":
        numUnit = this.getRandNum(healerNum);
        imgSrc += "healer" + numUnit + ".png";
        const healerIcon = new Image(1,1);
        healerIcon.src = imgSrc;
        return healerIcon;
      default:
        break;
    }
  }

  getRandNum(max){
    return Math.floor(Math.random() * (max + 1));
  }

  addBoss(ctx, canvas, bossSrc) {
    let maxHp;
    switch (this.currentLevel) {
      case "level1":
        maxHp = 2000;
        break;
      case "level2":
        maxHp = 6000;
        break;
      default:
        break;
    }
    this.boss = new Boss({ pos: [633,104], ctx, canvas, game: this, bossSrc, maxHp });
  }

  playerCastBar(ctx) {
    let yPos = 461;
    let xPos = 47 + 163 + 163;
    let width = 143;
    let height = 21;
    let textPosX = xPos + width / 2;
    let textPosY = yPos + 17;

    if (this.isCasting){
      let barLength = ((this.castTime / this.castTimeInitial) * width);
      if (this.castTime < Game.SPEED) {
        barLength = 0;
      }

      ctx.fillStyle = '#000000';
      ctx.roundRect(xPos, yPos, width, height, {lowerLeft: 10, upperLeft: 10, upperRight: 10, lowerRight: 10}, true, false);

      // handles low values of length for the cast bar due to the rounded rectangle
      ctx.fillStyle = '#9900cc';
      if (barLength < 3 && barLength >= 0) {
        ctx.roundRect(xPos, yPos, barLength, height, {lowerLeft: 10, upperLeft: 10, upperRight: 1, lowerRight: 1}, true, false);
      } else if (barLength < 5 && barLength >= 3){
        ctx.roundRect(xPos, yPos, barLength, height, {lowerLeft: 10, upperLeft: 10, upperRight: 4, lowerRight: 4}, true, false);
      } else if (barLength < 7 && barLength >= 5){
        ctx.roundRect(xPos, yPos, barLength, height, {lowerLeft: 10, upperLeft: 10, upperRight: 7, lowerRight: 7}, true, false);
      } else if (barLength < 11 && barLength >= 7) {
        ctx.roundRect(xPos, yPos, barLength, height, {lowerLeft: 10, upperLeft: 10, upperRight: 9, lowerRight: 9}, true, false);
      } else {
        ctx.roundRect(xPos, yPos, barLength, height, {lowerLeft: 10, upperLeft: 10, upperRight: 10, lowerRight: 10}, true, false);
      }

      ctx.fillStyle = '#FFFFFF';
      ctx.font = "16px Arial";
      ctx.textAlign = "center";
      ctx.fillText(this.spellText, textPosX, textPosY);

      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.roundRect(xPos, yPos, width, height, {lowerLeft: 10, upperLeft: 10, upperRight: 10, lowerRight: 10}, false, true);

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
    let yPos = 461;
    let xPos = 47 + 163;
    let width = 143;
    let height = 21;
    let textPosX = xPos + width / 2;
    let textPosY = yPos + 17;

    //background
    ctx.fillStyle = '#000000';
    ctx.roundRect(xPos, yPos, width, height, {lowerLeft: 10, upperLeft: 10, upperRight: 10, lowerRight: 10}, true, false);

    const currentMp = ((this.mp / 1000) * width);

    // this handles low mp values to not create a buggy view of trying to have a larger than possible radius
    if (this.mp < 100 && this.mp > 70) {
      ctx.fillStyle = '#0066cc';
      ctx.roundRect(xPos, yPos, currentMp, height, {lowerLeft: 10, upperLeft: 10, upperRight: 7, lowerRight: 7}, true, false);
    } else if (this.mp <= 70 && this.mp > 40) {
      ctx.fillStyle = '#0066cc';
      ctx.roundRect(xPos, yPos, currentMp, height, {lowerLeft: 10, upperLeft: 10, upperRight: 4, lowerRight: 4}, true, false);
    } else if (this.mp <= 40 && this.mp > 25) {
      ctx.fillStyle = '#0066cc';
      ctx.roundRect(xPos, yPos, currentMp, height, {lowerLeft: 10, upperLeft: 10, upperRight: 1, lowerRight: 1}, true, false);
    } else if (this.mp <= 25 && this.mp > 10) {
      ctx.fillStyle = '#0066cc';
      ctx.roundRect(xPos, yPos, 5, height, {lowerLeft: 10, upperLeft: 10, upperRight: 1, lowerRight: 1}, true, false);
    } else if (this.mp < 10) {
      ctx.fillStyle = '#000000';
      ctx.roundRect(xPos, yPos, 0, height, {lowerLeft: 10, upperLeft: 10, upperRight: 10, lowerRight: 10}, false, false);
    } else {
      ctx.fillStyle = '#0066cc';
      ctx.roundRect(xPos, yPos, currentMp, height, {lowerLeft: 10, upperLeft: 10, upperRight: 10, lowerRight: 10}, true, false);
    }

    //manabar outline
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(xPos, yPos, width, height, {lowerLeft: 10, upperLeft: 10, upperRight: 10, lowerRight: 10}, false, true);

    //label text
    ctx.fillStyle = 'gold';
    ctx.font = '16px sans-serif';
    ctx.textAlign = "start";
    ctx.fillText("Mana", xPos + 11, yPos - 5);

    // mana bar inner text showing current mana
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '16px sans-serif';
    ctx.textAlign = "center";
    ctx.fillText(`${this.mp}`, textPosX , textPosY);
  }

  healthBar(ctx) {
    // healthbar positions
    let yPos = 461;
    let xPos = 47;
    let width = 143;
    let height = 21;
    let textPosX = xPos + width / 2;
    let textPosY = yPos + 17;

    const healer = this.findHealer();

    // background
    ctx.fillStyle = '#000000';
    ctx.roundRect(xPos, yPos, width, height, {lowerLeft: 10, upperLeft: 10, upperRight: 10, lowerRight: 10}, true, false);

    // this handles the current hp progressbar and allows for it to change shape at low hp values
    let currentHpNumber = healer.currentHp;
    const currentHpWidth = ((healer.currentHp / 100) * width);

    if (currentHpNumber < 100 && currentHpNumber > 70) {
      ctx.fillStyle = '#009933';
      ctx.roundRect(xPos, yPos, currentHpWidth, height, {lowerLeft: 10, upperLeft: 10, upperRight: 7, lowerRight: 7}, true, false);
    } else if (currentHpNumber <= 70 && currentHpNumber > 40) {
      ctx.fillStyle = '#009933';
      ctx.roundRect(xPos, yPos, currentHpWidth, height, {lowerLeft: 10, upperLeft: 10, upperRight: 4, lowerRight: 4}, true, false);
    } else if (currentHpNumber <= 40 && currentHpNumber > 25) {
      ctx.fillStyle = '#009933';
      ctx.roundRect(xPos, yPos, currentHpWidth, height, {lowerLeft: 10, upperLeft: 10, upperRight: 1, lowerRight: 1}, true, false);
    } else if (currentHpNumber <= 25 && currentHpNumber > 10) {
      ctx.fillStyle = '#009933';
      ctx.roundRect(xPos, yPos, 5, height, {lowerLeft: 10, upperLeft: 10, upperRight: 1, lowerRight: 1}, true, false);
    } else if (currentHpNumber < 10) {
      ctx.fillStyle = '#000000';
      ctx.roundRect(xPos, yPos, 0, height, {lowerLeft: 10, upperLeft: 10, upperRight: 10, lowerRight: 10}, false, false);
    } else {
      ctx.fillStyle = '#009933';
      ctx.roundRect(xPos, yPos, currentHpWidth, height, {lowerLeft: 10, upperLeft: 10, upperRight: 10, lowerRight: 10}, true, false);
    }

    //healthbar outline
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(xPos, yPos, width, height, {lowerLeft: 10, upperLeft: 10, upperRight: 10, lowerRight: 10}, false, true);

    //label text
    ctx.fillStyle = 'gold';
    ctx.font = '16px sans-serif';
    ctx.textAlign = "start";
    ctx.fillText("Health", xPos + 11, yPos - 5);

    // displays current HP values
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '16px sans-serif';
    ctx.textAlign = "center";
    ctx.fillText(`${Math.floor(currentHpNumber)}%`, textPosX , textPosY);
  }

  findHealer() {
    //this will return the party's healer object
    for (let i = 0; i < this.party.length; i++) {
      const element = this.party[i];
      if (element instanceof Healer) {
        return element;
      }
    }
  }

  addPlayerSpells(){
    document.addEventListener('keydown', (e) => {
      switch (e.which){
        case 49:
          this.castSpell("cure");
          break;
        case 50:
          this.castSpell("regen");
          break;
        case 51:
          this.castSpell("aoeHeal");
          break;
        case 52:
          this.castSpell("aoeRegen");
          break;
        case 53:
          this.castSpell("impactHeal");
          break;
        case 54:
          this.castSpell("revive");
          break;
        case 48:
          this.castSpell("win");
          break;
      }
    });
  }

  castSpell(spell){
    let selected;
    this.spells = new Spells({ game: this });
    
    switch (spell) {
      case "cure":
        selected = this.findSelected();
        if (!this.activeGCD && selected) {
          this.spells.cure(selected);
        } else if (selected === false) {
          this.errorCode = 3;
        } else {
          this.errorCode = 1;
        }
        break;
      case "regen":
        selected = this.findSelected();
        if (!this.activeGCD && selected) {
          this.spells.regen(selected);
        } else if (selected === false) {
          this.errorCode = 3;
        } else {
          this.errorCode = 1;
        };
        break;
      case "aoeHeal":
        if (!this.activeGCD) {
          this.spells.aoeHeal();
        } else {
          this.errorCode = 1;
        };
        break;
      case "aoeRegen":
        if (!this.activeGCD) {
          this.spells.aoeRegen();
        } else {
          this.errorCode = 1;
        };
        break;
      case "impactHeal":
        selected = this.findSelected();
        if (this.impactCD === 0 && selected) {
          this.spells.impactHeal(selected);
        } else if (selected === false) {
          this.errorCode = 3;
        }
        break;
      case "revive":
        selected = this.findSelected();
        if (selected.currentHp === 0) {
          this.spells.revive(selected);
        } else if (selected === false) {
          this.errorCode = 3;
        };
        break;
      case "kill":
        this.boss.currentHp = 1;
        break;
    }
  }

  addClickableSpells(ctx){
    let canvas = document.getElementById('game-canvas');
    const pos = Game.SPELL_ICON_POS;

    let spell1 = new Path2D();
    spell1.rect(...pos['spell1']);
    ctx.fillStyle = "rgba(0,0,0,0.001";
    ctx.fill(spell1);

    let spell2 = new Path2D();
    spell2.rect(...pos['spell2']);
    ctx.fillStyle = "rgba(0,0,0,0.001";
    ctx.fill(spell2);

    let spell3 = new Path2D();
    spell3.rect(...pos['spell3']);
    ctx.fillStyle = "rgba(0,0,0,0.001";
    ctx.fill(spell3);

    let spell4 = new Path2D();
    spell4.rect(...pos['spell4']);
    ctx.fillStyle = "rgba(0,0,0,0.001";
    ctx.fill(spell4);
    
    let spell5 = new Path2D();
    spell5.rect(...pos['spell5']);
    ctx.fillStyle = "rgba(0,0,0,0.001";
    ctx.fill(spell5);
    
    let spell6 = new Path2D();
    spell6.rect(...pos['spell6']);
    ctx.fillStyle = "rgba(0,0,0,0.001";
    ctx.fill(spell6);

    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        if (ctx.isPointInPath(spell1, (e.clientX - rect.x), (e.clientY - rect.y))) {
          this.castSpell("cure");
        };
        if (ctx.isPointInPath(spell2, (e.clientX - rect.x), (e.clientY - rect.y))) {
          this.castSpell("regen");
        };
        if (ctx.isPointInPath(spell3, (e.clientX - rect.x), (e.clientY - rect.y))) {
          this.castSpell("aoeHeal");
        };
        if (ctx.isPointInPath(spell4, (e.clientX - rect.x), (e.clientY - rect.y))) {
          this.castSpell("aoeRegen");
        };
        if (ctx.isPointInPath(spell5, (e.clientX - rect.x), (e.clientY - rect.y))) {
          this.castSpell("impactHeal");
        };
        if (ctx.isPointInPath(spell6, (e.clientX - rect.x), (e.clientY - rect.y))) {
          this.castSpell("revive");
        };
    });
  }

  drawHovered(ctx){
    switch (this.hovered) {
      case "cure":
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '16px sans-serif';
        ctx.textAlign = "center";
        ctx.fillText("Cure", 71, 500);
        break;
      case "regen":
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '16px sans-serif';
        ctx.textAlign = "center";
        ctx.fillText("Regen", 154, 500);
        break;
      case "aoeHeal":
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '16px sans-serif';
        ctx.textAlign = "center";
        ctx.fillText("Aoe Heal", 237, 500);
        break;
      case "aoeRegen":
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '16px sans-serif';
        ctx.textAlign = "center";
        ctx.fillText("Aoe Regen", 320, 500);
        break;
      case "impactHeal":
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '16px sans-serif';
        ctx.textAlign = "center";
        ctx.fillText("Impact Heal", 403, 500);
        break;
      case "revive":
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '16px sans-serif';
        ctx.textAlign = "center";
        ctx.fillText("Revive", 486, 500);
        break;
      default:
        break;
    }
  }

  addSpellHover(ctx){
    let canvas = document.getElementById('game-canvas');
    const pos = Game.SPELL_ICON_POS;

    let spell1 = new Path2D();
    spell1.rect(...pos['spell1']);
    ctx.fillStyle = "rgba(0,0,0,0.001";
    ctx.fill(spell1);

    let spell2 = new Path2D();
    spell2.rect(...pos['spell2']);
    ctx.fillStyle = "rgba(0,0,0,0.001";
    ctx.fill(spell2);

    let spell3 = new Path2D();
    spell3.rect(...pos['spell3']);
    ctx.fillStyle = "rgba(0,0,0,0.001";
    ctx.fill(spell3);

    let spell4 = new Path2D();
    spell4.rect(...pos['spell4']);
    ctx.fillStyle = "rgba(0,0,0,0.001";
    ctx.fill(spell4);

    let spell5 = new Path2D();
    spell5.rect(...pos['spell5']);
    ctx.fillStyle = "rgba(0,0,0,0.001";
    ctx.fill(spell5);

    let spell6 = new Path2D();
    spell6.rect(...pos['spell6']);
    ctx.fillStyle = "rgba(0,0,0,0.001";
    ctx.fill(spell6);

    canvas.onmousemove = (e) => {
      const rect = canvas.getBoundingClientRect();
      if (ctx.isPointInPath(spell1, (e.clientX - rect.x), (e.clientY - rect.y))) {
        this.hovered = "cure";
      };
      if (ctx.isPointInPath(spell2, (e.clientX - rect.x), (e.clientY - rect.y))) {
        this.hovered = "regen";
      };
      if (ctx.isPointInPath(spell3, (e.clientX - rect.x), (e.clientY - rect.y))) {
        this.hovered = "aoeHeal";
      };
      if (ctx.isPointInPath(spell4, (e.clientX - rect.x), (e.clientY - rect.y))) {
        this.hovered = "aoeRegen";
      };
      if (ctx.isPointInPath(spell5, (e.clientX - rect.x), (e.clientY - rect.y))) {
        this.hovered = "impactHeal";
      };
      if (ctx.isPointInPath(spell6, (e.clientX - rect.x), (e.clientY - rect.y))) {
        this.hovered = "revive";
      };
    };
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
    // plan to rework this to use a secondary image with a transform.
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
      // currently spell 5 is a "off global cooldown" skill and does not share //
      // the global cooldown with other skills
      // ctx.beginPath();
      // ctx.rect(372, 502, 63, gcdHeight);
      // ctx.fill();

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
    const pos = Game.SPELL_ICON_POS;

    // spell 1
    ctx.fillStyle = '#99ccff';
    ctx.drawImage(
      this.spellIcons.cureIcon, ...pos["spell1"]
    );

    // spell 2
    ctx.drawImage(
      this.spellIcons.regenIcon, ...pos["spell2"]
    );

    // spell 3
    ctx.drawImage(
      this.spellIcons.aoeHeal, ...pos["spell3"]
    );

    // spell 4
    ctx.drawImage(
      this.spellIcons.aoeRegen, ...pos["spell4"]
    );

    // spell 5
    ctx.drawImage(
      this.spellIcons.esuna, ...pos["spell5"]
    );

    // spell 6
    ctx.drawImage(
      this.spellIcons.revive, ...pos["spell6"]
    );

    //spell text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '16px sans-serif';
    ctx.textAlign = "center";
    ctx.fillText("1", 71, 578);
    ctx.fillText("2", 154, 578);
    ctx.fillText("3", 237, 578);
    ctx.fillText("4", 320, 578);
    ctx.fillText("5", 403, 578);
    ctx.fillText("6", 486, 578);
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

  showErrors(ctx) {
    if (this.errorCode !== 0) {
      this.errorDisplay = new GameErrors(ctx, this.errorCode);
      this.errorDisplay.draw();
      setTimeout(
        () => {
          this.errorCode = 0;
          this.errorDisplay = null;
        }, 700);
    };
  };

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

  regenMp() {
    if (this.mpRegenTimer <= 0 && this.mp < 1000) {
      this.mp += 5;
      this.mpRegenTimer = 75;
    } else {
      this.mpRegenTimer -= 1;
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
    ctx.rect(40, 40, 475, 196);
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
    this.healthBar(ctx)
    this.animateGCD(ctx);
    this.animateSpellCD(ctx);
    this.bossCastBar(ctx);
    this.deadPlayerCheck();
    this.drawHovered(ctx);
    this.showErrors(ctx);
    this.regenMp();
  }
}

Game.DIM_X = 1000;
Game.DIM_Y = 600;
Game.SPEED = 66;

// locations on the battlefield of each character
// positions will go tank(s) up closest to the boss
// next will be dps
// healer will be last
Game.NPC_ICON_POS = [

];

Game.SPELL_ICON_POS = {
  "spell1": [40, 502, 63, 63],
  "spell2": [123, 502, 63, 63],
  "spell3": [206, 502, 63, 63],
  "spell4": [289, 502, 63, 63],
  "spell5": [372, 502, 63, 63],
  "spell6": [455, 502, 63, 63],
}

Game.NPC_POS = [
  [57,60], [148, 60], [239,60], [330,60], [421,60],
  [57,146], [148, 146], [239,146], [330,146], [421,146],
  [57,252], [148, 252], [239,252], [330,252], [421,252],
  [57,333], [148, 333], [239,333], [330,333], [421,333]
];

module.exports = Game;
