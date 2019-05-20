const Game = require("./game.js");
const GameView = require("./game_view.js");




document.addEventListener('DOMContentLoaded', () => {
  const canvasEl = document.getElementById('game-canvas');
  const ctx = canvasEl.getContext("2d");
  canvasEl.width = Game.DIM_X;
  canvasEl.height = Game.DIM_Y;

  new GameView(ctx).start();
});

// const options = { maxHp: 200, attackRate: 1800, attackValue: 4, color: "#003399", pos: [40,40]}