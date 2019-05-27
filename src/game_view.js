const Game = require("./game.js");

class GameView {
  constructor(ctx) {
    this.ctx = ctx;

    this.canvas = document.getElementById('game-canvas');
    this.music = true;
  }

  start(){
    this.ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    this.ctx.fillStyle = '#050505';
    this.ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

    // ctx.beginPath();
    // this.ctx.drawImage(this.bg, 0, 0, Game.DIM_X, Game.DIM_Y);

    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.font = "24px Arial";
    this.ctx.textAlign = "center";
    this. ctx.fillText("Start MMO Healer", Game.DIM_X/2, Game.DIM_Y/2);


// start button event listener
    const backing = new Path2D();
    backing.rect(400, 278, 200, 26);
    this.ctx.fillStyle = "rgba(0,0,0,0.001";
    this.ctx.fill(backing);

    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      if (this.ctx.isPointInPath(backing, (e.clientX - rect.x), (e.clientY - rect.y))) {
        
        this.level1();
      }
    });

  }

  gameOverScreen() {
    // removing event listener for spell. refactor later.
    document.removeEventListener('keydown', (e) => {
      switch (e.which) {
        case 49:
          selected = this.findSelected();
          if (!this.activeGCD) {
            new Spells({ game: this }).cure(selected);
          }
          break;
        case 50:
          selected = this.findSelected();
          if (!this.activeGCD) {
            new Spells({ game: this }).regen(selected);
          }
          break;
        case 51:
          if (!this.activeGCD) {
            new Spells({ game: this }).aoeHeal();
          }
          break;
        case 48:
          this.boss.currentHp = 1;
          break;
      }
    });

    this.game.party.forEach(member => {
      member.toggleClickable();
    });

    // remove the interval
    clearInterval(this.gameplay);
    // gameover screen

    this.ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

    const overhealVal = Math.floor((this.game.overheal/this.game.healed) * 100);
    const overhealText = "Overheal percentage %" + overhealVal;

    const eb = new Path2D();
    eb.rect(360,304,280,2);
    this.ctx.fillStyle = "rgba(255,255,255,1)";
    this.ctx.fill(eb);
    
    this.ctx.fillStyle = 'FFFFFF';
    this.ctx.font = "24px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillText(overhealText, Game.DIM_X / 2, Game.DIM_Y / 2 );

    this.ctx.fillStyle = 'FF0000';
    this.ctx.font = "24px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillText("Play again?", 500, 360);

    // event listener to restart the game
    const backing = new Path2D();
    backing.rect(430, 340, 150, 26);
    this.ctx.fillStyle = "rgba(0,0,0,0.05)";
    this.ctx.fill(backing);

    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      if (this.ctx.isPointInPath(backing, (e.clientX - rect.x), (e.clientY - rect.y))) {

        this.level1();
      }
    });
    // end event listener
  }




  level1(){
    document.removeEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      if(this.ctx.isPointInPath(backing, (e.clientX - rect.x), (e.clientY - rect.y))) {

      this.level1();
    }});
    document.getElementById('bossfight').pause();
    document.getElementById('bossfight').currentTime = 0;

    document.getElementById('bossfight').play();

    let aoeRegen = new Image(1,1);
    aoeRegen.src = "./spellicons/assize.png";

    let esuna = new Image(1,1);
    esuna.src = "./spellicons/esuna.png";

    let revive = new Image(1,1);
    revive.src = "./spellicons/verraise.png";

    const canvasEl = document.getElementById('game-canvas');
    const ctx = canvasEl.getContext("2d");
    const boss = document.getElementById('bahamut');
    const dead = document.getElementById('skull');
    const bg = document.getElementById('dungeon1');

    const cureIcon = document.getElementById('cure');
    const regenIcon = document.getElementById('regen');
    const aoeHeal = document.getElementById('aoeheal');


    const spellIcons = { cureIcon, regenIcon, aoeHeal, aoeRegen, esuna, revive };

    const options = {
      comp: { tank: 1, healer: 1, dps: 3 },
      ctx, canvas: canvasEl, bossSrc: boss,
      dead, bg, spellIcons
    };


    this.game = new Game(options);
    
    this.gameplay = setInterval(() => {
      if (this.game.gameOver) {
        this.gameOverScreen();
      } else {
        this.game.draw(this.ctx);
        
      }
      this.pauseToggle();
    }, Game.SPEED);
  }

  pauseToggle() {
    const backing = new Path2D();
    backing.rect(925, 25, 25, 25);
    this.ctx.fillStyle = "rgba(0,0,0,0.01)";
    this.ctx.fill(backing);

    let soundIcon;
    if (this.music) {
      soundIcon = document.getElementById('sound-on');
    } else {
      soundIcon = document.getElementById('sound-off');
    }

    this.renderSound(soundIcon);

    this.canvas.addEventListener('mouseup', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      if (this.ctx.isPointInPath(backing, (e.clientX - rect.x), (e.clientY - rect.y))) {
        if (this.music) {
          document.getElementById('bossfight').pause();
        } else {
          document.getElementById('bossfight').play();
        }
        this.music = !this.music;
      }
    });
  }

  renderSound(soundIcon) {
    this.ctx.drawImage(
      soundIcon, 925, 25, 25, 25
    );
  }
}



module.exports = GameView;