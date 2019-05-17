const NPC = require("../npc.js");

class Boss extends NPC {
  constructor(options){

    options.maxHp = 2000;
    options.attackRate = 1800;
    options.attackValue = 15;
    options.color = '#003399';
    options.pos = options.pos;
    super(options);
    this.bossSrc = options.bossSrc;

    this.startAttack();
  }

  startAttack(){
    setInterval(() => {
      this.attackRandom();
    }, this.attackRate);
  }



    // // monster box
    // ctx.fillStyle = '#33cc33';
    // ctx.beginPath();
    // ctx.rect(633, 104, 245, 350);
    // ctx.fill();

    // // monster cast bar
    // ctx.beginPath();
    // ctx.rect(605, 476, 300, 26);
    // ctx.fill();
// 1.317
// 186 nat

  draw(ctx){
    if (this.isDead()){
      ctx.fillStyle = '#1d1d1d';
    }
    
    ctx.beginPath();
    ctx.drawImage(
      this.bossSrc,
      this.pos[0],
      this.pos[1] + 10,
      245,
      326.5
    );

    this.drawMaxHP(ctx);
    this.drawCurrentHp(ctx);
  }

  drawMaxHP(ctx) {
    const posX = 605;
    const posY = 55; 
    ctx.fillStyle = "#000000";
    

    ctx.beginPath();
    ctx.rect(
      posX, posY, 300, 26
    );

    ctx.fill();
  }

  drawCurrentHp(ctx) {
    const posX = 605;
    const posY = 55;
    ctx.fillStyle = '#cc0000';
    const currentHpVal = Math.floor((this.currentHp / this.maxHp) * 300);

    ctx.beginPath();
    ctx.rect(
      posX, posY, currentHpVal, 26
    );
    ctx.fill();
  }

  selectRandom() {
    let weights = [];
    this.game.party.forEach((member, idx) => {
      for (let i = 0; i < member.weight; i++){
        weights.push(idx);
      }
    });
    debugger;
    const selectedIdx = Math.floor(Math.random() * weights.length);
    return weights[selectedIdx];
  }

  attackRandom(){
    let selectedTarget = this.selectRandom();
    
    if (selectedTarget.currentHp <= 0){
      const alive = this.game.party.find(target => target.currentHp > 0);
      selectedTarget = this.game.party.findIndex(alive);
    }
    this.attack(this.game.party[selectedTarget]);
  }

}

module.exports = Boss;