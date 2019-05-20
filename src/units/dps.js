const NPC = require("../npc.js");

class Dps extends NPC {
  constructor(options){

    options.maxHp = 100;
    options.attackRate = 1500;
    options.attackValue = 8;
    options.color = '#990000';
    options.pos = options.pos;
    super(options);

    this.weight = this.calcWeight();
  }

  calcWeight(){
    const nonTanks = this.game.comp.healer + this.game.comp.dps;

    const weight = 30 / nonTanks;
    return weight;
  }
}

module.exports = Dps;