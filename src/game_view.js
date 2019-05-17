class GameView {
  constructor(game, ctx) {
    this.ctx = ctx;
    this.game = game;
  }

  start(){
    setInterval(() => {
      this.game.draw(this.ctx);
    }, 120);
  }
}

module.exports = GameView;