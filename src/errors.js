class GameErrors {
  constructor(ctx, errorCode) {
    this.ctx = ctx;
    this.errorCode = errorCode;
  }

  draw() {
    if (this.errorCode !== 0) {
      this.ctx.fillStyle = '#FF0000';
      this.ctx.font = "bold 18px Arial";
      this.ctx.textAlign = "center";
      this.ctx.fillText(GAME_ERROR[this.errorCode], 282, 375);
    };
  };
};

GAME_ERROR = {
  0: null,
  1: "Not ready to use that yet",
  2: "Not enough mana",
  3: "Invalid Target"
};

module.exports = GameErrors;
