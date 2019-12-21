const Game = require("./game.js");
const GameView = require("./game_view.js");




document.addEventListener('DOMContentLoaded', () => {
  //this allows for a rounded rectangle to be drawn, is needed for the bars
  // use it like: 
  // ctx.roundRect(5, 5, 100, 100, {upperLeft: 25, upperRight: 25, lowerRight: 50, LowerLeft 75}, true, false);
  // this will draw a rounded rectangle with a fill and no outline
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius, fill, stroke) {
      var cornerRadius = { upperLeft: 0, upperRight: 0, lowerLeft: 0, lowerRight: 0 };
      if (typeof stroke == "undefined") {
          stroke = true;
      }
      if (typeof radius === "object") {
          for (var side in radius) {
              cornerRadius[side] = radius[side];
          }
      }

      this.beginPath();
      this.moveTo(x + cornerRadius.upperLeft, y);
      this.lineTo(x + width - cornerRadius.upperRight, y);
      this.quadraticCurveTo(x + width, y, x + width, y + cornerRadius.upperRight);
      this.lineTo(x + width, y + height - cornerRadius.lowerRight);
      this.quadraticCurveTo(x + width, y + height, x + width - cornerRadius.lowerRight, y + height);
      this.lineTo(x + cornerRadius.lowerLeft, y + height);
      this.quadraticCurveTo(x, y + height, x, y + height - cornerRadius.lowerLeft);
      this.lineTo(x, y + cornerRadius.upperLeft);
      this.quadraticCurveTo(x, y, x + cornerRadius.upperLeft, y);
      this.closePath();
      if (stroke) {
          this.stroke();
      }
      if (fill) {
          this.fill();
      }
  } 

  const canvasEl = document.getElementById('game-canvas');
  const ctx = canvasEl.getContext("2d");
  canvasEl.width = Game.DIM_X;
  canvasEl.height = Game.DIM_Y;

  new GameView(ctx).start();
});

// const options = { maxHp: 200, attackRate: 1800, attackValue: 4, color: "#003399", pos: [40,40]}