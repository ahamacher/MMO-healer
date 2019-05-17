class NPC {
  constructor(options){
    this.maxHp = options.maxHp;
    this.currentHp = options.maxHp;
    this.attackRate = options.attackRate || 1500;
    this.attackValue = options.attackValue;
    this.color = options.color || "#CC22CC";
    this.pos = options.pos;
    this.buffs = [];
  }

  attack(target){
    return target.currentHp - this.attackValue;
  }

  receiveDamage(amount){
    this.currentHp = this.currentHp - amount;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();

    ctx.rect(
      this.pos[0],
      this.pos[1],
      76, 66
    );
    ctx.fill();

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
