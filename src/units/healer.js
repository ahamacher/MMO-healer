const NPC = require("../npc.js");

class Healer extends NPC {
  constructor(options){

    options.maxHp = 100;
    options.attackRate = 1800;
    options.attackValue = 3;
    options.color = '#33cc33';
    options.pos = options.pos;
    super(options);
  }
}

module.exports = Healer;