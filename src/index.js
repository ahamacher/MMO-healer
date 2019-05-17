const Game = require("./game.js");
const GameView = require("./game_view.js");
const NPC = require("./npc.js");



document.addEventListener('DOMContentLoaded', () => {
  const canvasEl = document.getElementById('game-canvas');
  const ctx = canvasEl.getContext("2d");
  canvasEl.width = Game.DIM_X;
  canvasEl.height = Game.DIM_Y;

  
  //temp
  const boss = document.getElementById('bahamut');
  const dead = document.getElementById('skull');

  const options = { comp: { tank: 1, healer: 1, dps: 3 }, ctx, canvas: canvasEl, bossSrc: boss, dead, document: document };

  const game = new Game(options);
  new GameView(game, ctx).start();
});

// const options = { maxHp: 200, attackRate: 1800, attackValue: 4, color: "#003399", pos: [40,40]}