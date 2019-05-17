const NPC = require("../npc.js");

class Tank extends NPC {
  constructor(options){

    options.maxHp = 200;
    options.attackRate = 1800;
    options.attackValue = 4;
    options.color = '#003399';
    options.pos = options.pos;
    super(options);
  }
}

module.exports = Tank;