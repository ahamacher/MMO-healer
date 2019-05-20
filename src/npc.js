const Tank = require('./units/tank.js');
const Spells = require("./spells.js");

class NPC {
  constructor(options){
    this.maxHp = options.maxHp;
    this.currentHp = options.maxHp;
    this.attackRate = options.attackRate || 1500;
    this.attackValue = options.attackValue;
    this.color = options.color || "#CC22CC";
    this.pos = options.pos;
    this.buffs = [];
    this.debuffs = [];
    this.selected = false;
    this.game = options.game;

    this.ctx = options.ctx;
    this.canvas = options.canvas;

    this.startAttack();

    const backing = new Path2D();
    backing.rect(this.pos[0], this.pos[1], 76, 66);
    this.ctx.fillStyle = "#000000";
    this.ctx.fill(backing);

    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      if (this.ctx.isPointInPath(backing, (e.clientX - rect.x), (e.clientY - rect.y))){

        this.game.clearSelected();
        this.selected = true;
        this.game.showSelected(this);
      }
    });

  }

  startAttack(){
    setInterval(() => {
      this.attack(this.game.boss);
    }, this.attackRate);
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

      if (this.selected){
        // ctx.shadowBlur = 10;
        // ctx.shadowColor = "white";
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'yellow';
        ctx.strokeRect(this.pos[0], this.pos[1], 76, 66);
      }

      ctx.restore();
      ctx.shadowBlur = 0;
      ctx.shadowColor = 'rgba(0,0,0,0)';
    }
    this.drawMaxHP(ctx);
    this.drawCurrentHp(ctx);
    // 120 is hardcoded currently to the refresh rate
    this.statusAction(800);
  }

  statusAction(rate){
    if (this.buffs.length > 0) {
      this.buffs.forEach(buff => {
        this.executeBuff(buff);
        buff.duration -= rate;
      });
      // console.log(this.buffs);
      // console.log(rate);
      this.buffs = this.buffs.filter(buff => buff.duration > rate);
      // console.log(this.buffs);
    }
  }

  executeBuff(buff){
    switch (buff.type){
      case "heal":
        this.game.healed += buff.heal;
        if (this.currentHp !== this.maxHp){
          this.currentHp = this.currentHp + buff.heal;
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
