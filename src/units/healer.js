const NPC = require("../npc.js");

class Healer extends NPC {
  constructor(options){

    options.maxHp = 100;
    options.attackRate = 1800;
    options.attackValue = 0;
    options.color = '#009933';
    options.pos = options.pos;
    super(options);
    this.weight = this.calcWeight();
  }

  calcWeight(){
    // tanks are statically weighted to 70%
    // const numTanks = this.game.comp.tank;

    // weighting the rest to be attacked 30% of the time
    const nonTanks = this.game.comp.healer + this.game.comp.dps;

    const weight = 30 / nonTanks;
    return weight;
  }
}

module.exports = Healer;