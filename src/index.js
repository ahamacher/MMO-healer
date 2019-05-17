const Game = require("./game.js");
const GameView = require("./game_view.js");
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
  window.options = {comp: { tank: 1, healer: 1, dps: 3 }};


  const game = new Game(options);
  new GameView(game, ctx).start();
});

// const options = { maxHp: 200, attackRate: 1800, attackValue: 4, color: "#003399", pos: [40,40]}