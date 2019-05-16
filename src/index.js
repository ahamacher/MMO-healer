const Game = require("./game.js");
const NPC = require("./npc.js");



document.addEventListener('DOMContentLoaded', () => {
  const canvasEl = document.getElementById('game-canvas');
  canvasEl.width = Game.DIM_X;
  canvasEl.height = Game.DIM_Y;

  
  const ctx = canvasEl.getContext("2d");
  //temp
  window.Game = Game;
  window.ctx = ctx;
  window.NPC = NPC;
  window.makePlayer = () => {
    const options = { maxHp: 200, attackRate: 1800, attackValue: 4, color: "#003399", pos: [40,40]};
    const npc = new NPC(options);
    npc.draw(ctx);
    npc.drawMaxHP(ctx);
    npc.drawCurrentHp(ctx);
  }

  window.makePlayer2 = () => {
    const options2 = { maxHp: 200, attackRate: 1800, attackValue: 4, color: "#003399", pos: [40,40]};
    const npc2 = new NPC(options2);
    npc2.draw(ctx);
    npc2.drawMaxHP(ctx);
    npc2.receiveDamage(50);
    npc2.drawCurrentHp(ctx);
  };

  // const game = new Game();
  // new GameView(game, ctx).start();
});

// const options = { maxHp: 200, attackRate: 1800, attackValue: 4, color: "#003399", pos: [40,40]}