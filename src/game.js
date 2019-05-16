class Game {
  constructor(ctx){
    // this.comp = options.comp;
    this.draw(ctx);
    this.drawPlayerBox(ctx);
    this.drawPlayerSpells(ctx);
    this.drawMonsterBox(ctx);
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
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    ctx.fillStyle = "#CCCCCC";
    ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

  }
}

Game.DIM_X = 1000;
Game.DIM_Y = 600;
Game.FPS = 30;

module.exports = Game;
