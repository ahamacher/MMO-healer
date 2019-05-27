const Tank = require('./units/tank.js');
const Spells = require("./spells.js");
const Game = require("./game.js");

class NPC {
  constructor(options){
    this.maxHp = options.maxHp;
    this.currentHp = options.maxHp;
    this.attackRate = options.attackRate || 1500;
    this.timeSinceAttack = 0;
    this.attackValue = options.attackValue;
    this.color = options.color || "#CC22CC";
    this.pos = options.pos;
    this.buffs = [];
    this.debuffs = [];
    this.selected = false;
    this.game = options.game;
    this.ctx = options.ctx;
    this.canvas = options.canvas;

    this.toggleClickable();
    this.speed = options.speed;
  }

  toggleClickable() {
    const boundSelector = this.selector.bind(this);
    if (!this.game.gameover) {
      this.canvas.addEventListener('click', boundSelector);
    } else {
      this.canvas.removeEventListener('click', boundSelector);
    }
  }

  selector(e){
    const backing = new Path2D();
    backing.rect(this.pos[0], this.pos[1], 76, 66);
    this.ctx.fillStyle = "rgba(0,0,0,0.01)";
    this.ctx.fill(backing);

    const rect = this.canvas.getBoundingClientRect();
    if (this.ctx.isPointInPath(backing, (e.clientX - rect.x), (e.clientY - rect.y))) {
      this.game.clearSelected();
      this.selected = true;
    }
  }

  attack(target){
    if (target.currentHp > 0 && this.currentHp > 0){
      target.currentHp = target.currentHp - this.attackValue;
    }
    if (target.currentHp < 0){
      target.currentHp = 0;
    }
  }

  receiveDamage(amount){
    this.currentHp = this.currentHp - amount;
  }

  isDead(){
    if (this.currentHp <= 0){
      return true;
    }
    return false;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();

    if (this.isDead()){
      ctx.lineWidth = 2;
      ctx.strokeStyle = "black";
      ctx.strokeRect(this.pos[0], this.pos[1], 76, 66);

      ctx.rect(
        this.pos[0],
        this.pos[1],
        76, 66
      );
      ctx.fill();
      ctx.save();

      ctx.restore();
      ctx.shadowBlur = 0;
      ctx.shadowColor = 'rgba(0,0,0,0)';

      ctx.drawImage(
        this.game.dead,
        this.pos[0] + 2,
        this.pos[1] + 2,
        71,
        50
      );
    } else {
      ctx.lineWidth = 2;
      ctx.strokeStyle = "white";
      ctx.strokeRect(this.pos[0], this.pos[1], 76, 66);

      ctx.rect(
        this.pos[0],
        this.pos[1],
        76, 66
        );
        ctx.fill();
      ctx.save();

    }
      if (this.selected){
        // ctx.shadowBlur = 10;
        // ctx.shadowColor = "white";
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'yellow';
        ctx.strokeRect(this.pos[0], this.pos[1], 76, 66);

      ctx.restore();
      ctx.shadowBlur = 0;
      ctx.shadowColor = 'rgba(0,0,0,0)';
    }
    this.drawMaxHP(ctx);
    this.drawCurrentHp(ctx);
    // 120 is hardcoded currently to the refresh rate
    this.statusAction(this.speed);
  }

  statusAction(speed){
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
      this.buffs = this.buffs.filter(buff => buff.duration > 0);
    }
  }

  executeBuff(buff){
    switch (buff.type){
      case "heal":
        this.game.healed += buff.heal;
        if (this.currentHp !== this.maxHp){
          this.currentHp += buff.heal;
        } else {
          this.game.overheal += buff.heal;
        }
        break;
    }
  }

  drawMaxHP(ctx) {
    const posX = this.pos[0] + 5;
    const posY = this.pos[1] + 48; 
    ctx.fillStyle = "#000000";
    
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctx.strokeRect(posX, posY, 66, 10);
    ctx.beginPath();
    ctx.rect(
      posX, posY, 66, 10
    );

    ctx.fill();
  }

  drawCurrentHp(ctx) {
    const posX = this.pos[0] + 5;
    const posY = this.pos[1] + 48;
    ctx.fillStyle = '#cc0000';
    const currentHpVal = Math.floor((this.currentHp / this.maxHp) * 66);

    ctx.beginPath();
    ctx.rect(
      posX, posY, currentHpVal, 10
    );
    ctx.fill();
  }

  receiveBuff(buff){
    // buffs should come in with a buff type
    // buffs should come in with a duration
    // buffs should come in with an activiation
    this.buffs.push(buff);
  }

  remove(buff){
    this.buffs.splice(this.buffs.indexOf(buff), 1);
  }

  buffTime(){
    if (this.buffs){
      this.buffs.forEach(buff => {
        buff.time = buff.time - 1;
        if (buff.time <= 0) {
          this.remove(buff);
        }
      });
      
    }
  }
}

module.exports = NPC;
