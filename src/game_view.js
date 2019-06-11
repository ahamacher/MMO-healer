const Game = require("./game.js");

class GameView {
  constructor(ctx) {
    this.ctx = ctx;

    this.canvas = document.getElementById('game-canvas');
    this.music = true;
    this.state = "start";
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
      if (this.state === "start"){
        const rect = this.canvas.getBoundingClientRect();
        if (this.ctx.isPointInPath(backing, (e.clientX - rect.x), (e.clientY - rect.y))) {

          this.tutorial();
        }
      }
    });
  }

  tutorial() {
    this.state = "tutorial";
    const splash = new Image(1,1);
    splash.src = './assets/tutorial.jpg';

    this.ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    this.ctx.fillStyle = '#050505';
    this.ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

    splash.onload = () => {
      this.ctx.drawImage(splash, 0, 0, Game.DIM_X, Game.DIM_Y);
    };
      
      const backing = new Path2D();
      backing.rect(630, 320, 246, 56);
      this.ctx.fillStyle = "rgba(255,0,0,0.5)";
      this.ctx.fill(backing);

      
    this.canvas.addEventListener('click', (e) => {
      if (this.state === "tutorial"){
        const rect = this.canvas.getBoundingClientRect();
        if (this.ctx.isPointInPath(backing, (e.clientX - rect.x), (e.clientY - rect.y))) {

          this.level1();
        }
      }
    });
  }

  level1(){
    this.state = "level1";
    document.getElementById('bossfight').pause();
    document.getElementById('bossfight').currentTime = 0;
    document.getElementById('bossfight').play();

    let aoeRegen = new Image(1,1);
      aoeRegen.src = "./spellicons/assize.png";
    let esuna = new Image(1,1);
      esuna.src = "./spellicons/esuna.png";
    let revive = new Image(1,1);
      revive.src = "./spellicons/verraise.png";
    let cureIcon = new Image(1,1);
      cureIcon.src = "./spellicons/cure_ii.png";
    let regenIcon = new Image(1,1);
      regenIcon.src = "./spellicons/regen.png";
    let aoeHeal = new Image(1,1);
      aoeHeal.src = "./spellicons/helios.png";
    const boss = new Image(1,1);
      boss.src = "./assets/Bahamutff6.png";
    const dead = new Image(1,1);
      dead.src = "./assets/skull.png";
    const bg = new Image(1,1);
      bg.src = "./assets/dungeonbg1.jpg";
    const statusIcon = new Image(1,1);
      statusIcon.src = "./spellicons/status.png";

    const canvasEl = document.getElementById('game-canvas');
    const ctx = canvasEl.getContext("2d");
  

    const spellIcons = { cureIcon, regenIcon, aoeHeal, aoeRegen, esuna, revive };
    
    const bossScript = [
      {spell: "flare", hp: 99},
      {spell: "flare", hp: 95}, 
      {spell: "lifeShaver", hp: 85},
      {spell: "flare", hp: 75},
      {spell: "lifeShaver", hp: 65},
      {spell: "flare", hp: 50},
      {spell: "lifeShaver", hp: 45},
      {spell: "ahkmorn", hp: 20},
      {spell: "ahkmorn", hp: 1}
    ];


      const options = {
      comp: { tank: 1, healer: 1, dps: 3 },
      ctx, canvas: canvasEl, bossSrc: boss,
      dead, bg, spellIcons, bossScript, statusIcon
    };


    this.game = new Game(options);
    
    this.gameplay = setInterval(() => {
      if (this.game.gameOver) {
        this.gameOverScreen();
        this.state = "gameover";
        clearInterval(this.gameplay);
      } else if (this.game.gameOverBad) {
        this.gameOverBad();
        this.state = "gameover";
        clearInterval(this.gameplay);
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

    const soundOn = new Image(1,1);
    soundOn.src = "./assets/Speaker_Icon.png";

    const soundOff = new Image(1,1);
    soundOff.src = "./assets/mute_icon.png";

    let soundIcon;
    if (this.music) {
      soundIcon = soundOn;
    } else {
      soundIcon = soundOff;
    }

    this.renderSound(soundIcon);

    this.canvas.addEventListener('click', (e) => {
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

  gameOverBad() {
    this.game.party.forEach(member => {
      member.toggleClickable();
    });


    // event listener to restart the game
    this.ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

    const eb = new Path2D();
    eb.rect(435, 304, 130, 2);
    this.ctx.fillStyle = "rgba(255,255,255,1)";
    this.ctx.fill(eb);

    this.ctx.fillStyle = 'FFFFFF';
    this.ctx.font = "24px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillText("You Died...", Game.DIM_X / 2, Game.DIM_Y / 2);
    this.ctx.fillText("Play again?", 500, 360);


    const backing = new Path2D();
    backing.rect(430, 340, 150, 26);
    this.ctx.fillStyle = "rgba(255,0,0,0.5)";
    this.ctx.fill(backing);


    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      if (this.ctx.isPointInPath(backing, (e.clientX - rect.x), (e.clientY - rect.y))) {

        this.level1();
      }
    });
    // end event listener
  }

  gameOverScreen() {

    this.game.party.forEach(member => {
      member.toggleClickable();
    });

    // gameover screen

    this.ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

    let overhealVal = Math.floor((this.game.overheal / this.game.healed) * 100);
    if (isNaN(overhealVal)) {
      overhealVal = 0;
    }
    const overhealText = "Overheal percentage %" + overhealVal;
    const deathCountText = "Death count: " + this.game.deathCount;

    const eb = new Path2D();
    eb.rect(360, 304, 280, 2);
    this.ctx.fillStyle = "rgba(255,255,255,1)";
    this.ctx.fill(eb);

    this.ctx.fillStyle = 'FFFFFF';
    this.ctx.font = "24px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillText(overhealText, Game.DIM_X / 2, Game.DIM_Y / 2);

    this.ctx.fillStyle = 'FFFFFF';
    this.ctx.font = "24px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillText(deathCountText, Game.DIM_X / 2, (Game.DIM_Y / 2) + 30);

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
}



module.exports = GameView;