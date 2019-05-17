const Tank = require("./units/tank.js");
const Healer = require("./units/healer.js");
const Dps = require("./units/dps.js");
const Boss = require("./units/boss.js");


class Game {
  constructor(options){
    // teamcomp array goes {tanks: X, healer: Y, dps: Z}
    this.comp = options.comp;
    this.party = [];
    this.dead = options.dead;

    // probably not needed
    this.ctx = options.ctx;
    this.canvas = options.canvas;

    // creating units
    this.addFriendlyNpc(options.ctx, options.canvas);
    this.addBoss(options.ctx, options.canvas, options.bossSrc);
    this.addPlayerSpells(options.canvas, options.document);
  }

  findSelected(){
    const selected = this.party.find(member => member.selected === true);
    
    this.party.forEach(member => {
      if (member !== selected){
        member.selected = false;
      }
    });
    return selected;
  }

  showSelected(member){
    console.log(member);
    // if (member){
      // console.log(member);
      // member.ctx.shadowBlur = 10;
      // member.ctx.shadowColor = "black";
    // }
  }

  clearSelected(){
    this.party.forEach(member => {
      member.selected = false;
    });
  }


  addFriendlyNpc(ctx, canvas){
    if (this.comp.tank + this.comp.healer + this.comp.dps > 20){
      return "error too many partymembers";
    }
    let pos = 0;
    let i = 0;
    let j = 0;
    let k = 0;

    while (i < this.comp.tank){
      this.party.push(new Tank({pos: Game.NPC_POS[pos], ctx, canvas, game: this }));
      // this.addNpcListener(pos);
      pos = pos + 1;
      i = i + 1;
    }
    while (j < this.comp.healer){
      this.party.push(new Healer({pos: Game.NPC_POS[pos], ctx, canvas, game: this }));
      // this.addNpcListener(pos);
      pos = pos + 1;
      j = j + 1;
    }
    while (k < this.comp.dps){
      this.party.push(new Dps({pos: Game.NPC_POS[pos], ctx, canvas,game: this }));
      // this.addNpcListener(pos);
      pos = pos + 1;
      k = k + 1;
    }
  }

  addBoss(ctx, canvas, bossSrc) {
    this.boss = new Boss({ pos: [633,104], ctx, canvas, game: this, bossSrc });
  }

  // selected(target) {
  //   target.ctx.shadowBlue = 10;
  //   target.ctx.shadowColor = "black";
  // }

  addPlayerSpells(canvas, document){
    let selected;
    document.addEventListener('keydown', (e) => {
      switch (e.which){
        case 49:
          console.log('1 key was pressed');
          selected = this.findSelected();
          selected.currentHp = selected.currentHp + 20;
          break;
      }
    });
  }

  drawPlayerBox(ctx){
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    ctx.fillStyle = '#CCCCCC';
    ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

    ctx.fillStyle = "#99ccff";
    ctx.beginPath();
    ctx.rect(40, 40, 475, 375);
    ctx.fill();
  }

  drawPlayerSpells(ctx){
    //manabar
    ctx.fillStyle = '#0066cc';
    ctx.beginPath();
    ctx.rect(148, 433, 275, 21);
    ctx.fill();

    // castbar
    ctx.fillStyle = '#9900cc';
    ctx.beginPath();
    ctx.rect(148, 463, 275, 21);
    ctx.fill();

    // spell 1
    ctx.fillStyle = '#99ccff';
    ctx.beginPath();
    ctx.rect(40, 502, 63, 63);
    ctx.fill();

    // spell 2
    ctx.beginPath();
    ctx.rect(123, 502, 63, 63);
    ctx.fill();

    // spell 3
    ctx.beginPath();
    ctx.rect(206, 502, 63, 63);
    ctx.fill();

    // spell 4
    ctx.beginPath();
    ctx.rect(289, 502, 63, 63);
    ctx.fill();

    // spell 5
    ctx.beginPath();
    ctx.rect(372, 502, 63, 63);
    ctx.fill();

    // spell 6
    ctx.beginPath();
    ctx.rect(455, 502, 63, 63);
    ctx.fill();
  }

  drawMonsterBox(ctx){
    // monster hp
    ctx.fillStyle = '#cc0000';
    ctx.beginPath();
    ctx.rect(605, 55, 300, 26);
    ctx.fill();

    // monster box
    ctx.fillStyle = '#33cc33';
    ctx.beginPath();
    ctx.rect(633, 104, 245, 350);
    ctx.fill();

    // monster cast bar
    ctx.beginPath();
    ctx.rect(605, 476, 300, 26);
    ctx.fill();
  }


  draw(ctx){
    // clearing the view
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    ctx.fillStyle = "#CCCCCC";
    ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

    // npc bounding box
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    ctx.fillStyle = '#CCCCCC';
    ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

    ctx.fillStyle = "#99ccff";
    ctx.beginPath();
    ctx.rect(40, 40, 475, 375);
    ctx.fill();

    // drawing player spell list
    this.drawPlayerSpells(ctx);

    //drawing monster box
    this.drawMonsterBox(ctx);
    this.boss.draw(ctx);

    // rendering all npc frames
    this.party.forEach(member => {
      member.draw(ctx);
      // this.showSelected();
    });

    // this.findSelected();
    
  }
}

Game.DIM_X = 1000;
Game.DIM_Y = 600;
Game.FPS = 30;

Game.NPC_POS = [
  [57,90], [148, 90], [239,90], [330,90], [421,90],
  [57,171], [148, 171], [239,171], [330,171], [421,171],
  [57,252], [148, 252], [239,252], [330,252], [421,252],
  [57,333], [148, 333], [239,333], [330,333], [421,333]
];

module.exports = Game;
