const NPC = require("../npc.js");

class Dps extends NPC {
  constructor(options){

    options.maxHp = 100;
    options.attackRate = 1500;
    options.attackValue = 8;
    options.color = '#b30000';
    options.pos = options.pos;
    super(options);
  }
}

module.exports = Dps;