const Tank = require('./units/tank.js');

class NPC {
  constructor(options){
    this.maxHp = options.maxHp;
    this.currentHp = options.maxHp;
    this.attackRate = options.attackRate || 1500;
    this.attackValue = options.attackValue;
    this.color = options.color || "#CC22CC";
    this.pos = options.pos;
    this.buffs = [];
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
        // this.game.selected(this);
        // console.log(e.clientX, e.clientY);
        // console.log(this);
        // this.currentHp = this.currentHp - 25;
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
    if (this.selected){
      ctx.shadowBlur = 10;
      ctx.shadowColor = "black";
    }
    ctx.beginPath();

    if (this.isDead()){
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
    }
    this.drawMaxHP(ctx);
    this.drawCurrentHp(ctx);
    
  }

  drawMaxHP(ctx) {
    const posX = this.pos[0] + 5;
    const posY = this.pos[1] + 48; 
    ctx.fillStyle = "#000000";
    

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
