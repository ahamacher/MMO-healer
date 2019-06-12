const Game = require("./game.js");

class GameView {
  constructor(ctx) {
    this.ctx = ctx;

    this.currentLevel = 0;

    this.canvas = document.getElementById('game-canvas');
    this.state = "start";

    this.fps = 15;
    this.fpsInterval = 1000/ this.fps;
    this.startTime = Date.now();
    this.then = Date.now();

    // this will stop the request animation frames if at a static screen
    this.playing = false;
  }

  animate(fps){
    this.fpsInterval = 1000/fps;
    this.then = Date.now();
    this.startTime = this.then;
    this.rootRender();
  }

  rootRender(){
    // setTimeout(requestAnimationFrame(this.rootRender.bind(this)), 1000);
    if (this.playing){
      requestAnimationFrame(this.rootRender.bind(this));
    }
    this.now = Date.now();
    let elapsed = this.now - this.then;

    if (elapsed > this.fpsInterval){
      this.then = this.now - (elapsed % this.fpsInterval);

      if (this.game.gameOver && this.state === "level1") {
        this.level1End();
      } else if (this.game.gameOver) {
        this.gameOverScreen();
        this.state = "gameover";
      } else if (this.game.gameOverBad) {
        this.gameOverBad();
        this.state = "gameover";
      } else {
        this.game.draw(this.ctx);
      }

    }
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
      this.ctx.fillStyle = "rgba(000,0,0,0.01)";
      this.ctx.fill(backing);
    this.game = null;
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
    this.game = null;
    this.currentLevel = 1;
    const bgm = document.getElementById("bgm");
    if (bgm){
      bgm.parentNode.removeChild(bgm);
    }

    this.music();

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
      dead, bg, spellIcons, level: this.state, bossScript, statusIcon
    };


    this.game = new Game(options);
    this.playing = true;
    this.rootRender();
  }

  level2(){
    this.state = "level2";
    this.game = null;
    this.currentLevel = 2;
    this.music();

    let aoeRegen = new Image(1, 1);
    aoeRegen.src = "./spellicons/assize.png";
    let esuna = new Image(1, 1);
    esuna.src = "./spellicons/esuna.png";
    let revive = new Image(1, 1);
    revive.src = "./spellicons/verraise.png";
    let cureIcon = new Image(1, 1);
    cureIcon.src = "./spellicons/cure_ii.png";
    let regenIcon = new Image(1, 1);
    regenIcon.src = "./spellicons/regen.png";
    let aoeHeal = new Image(1, 1);
    aoeHeal.src = "./spellicons/helios.png";
    const boss = new Image(1, 1);
    boss.src = "./assets/virtue.png";
    const dead = new Image(1, 1);
    dead.src = "./assets/skull.png";
    const bg = new Image(1, 1);
    bg.src = "./assets/stars.jpg";
    const statusIcon = new Image(1, 1);
    statusIcon.src = "./spellicons/status.png";

    const canvasEl = document.getElementById('game-canvas');
    const ctx = canvasEl.getContext("2d");

    const spellIcons = { cureIcon, regenIcon, aoeHeal, aoeRegen, esuna, revive };

    const bossScript = [
      { spell: "holy", hp: 99 },
      { spell: "dualCast", hp: 95 },
      { spell: "breakWeapon", hp: 85 },
      { spell: "bio", hp: 80 },
      { spell: "meteor", hp: 75 },
      { spell: "bio", hp: 70 },
      { spell: "lifeShaver", hp: 65 },
      { spell: "dualCast", hp: 50 },
      { spell: "bio", hp: 40 },
      { spell: "lifeShaver", hp: 35 },
      { spell: "meteor", hp: 20 },
      { spell: "dualCast", hp: 20 },
      { spell: "apocalypse", hp: 2 }
    ];


    const options = {
      comp: { tank: 2, healer: 1, dps: 7 },
      ctx, canvas: canvasEl, bossSrc: boss,
      dead, bg, spellIcons, level: this.state, bossScript, statusIcon
    };


    this.game = new Game(options);
    this.playing = true;
    this.rootRender();
  }

  music(){
    let promise;
    switch (this.currentLevel) {
      case 1:
        if (!document.getElementById('bgm')) {
          this.addBGM("./assets/ultima.mp3");
        } else {
          this.changeBGM("./assets/ultima.mp3");
        }
        const bgm = document.getElementById("bgm");
        bgm.currentTime = 60.5;
        promise = bgm.play();
        if (promise){
          promise.catch(() => {});
        }
        bgm.volume = 0.4;
        break;
      case 2:
        this.changeBGM('./assets/Answers.mp3');
        promise = document.getElementById('bgm').play();
        if (promise) {
          promise.catch(() => {});
        }
        break;
      default:
        break;
    }
  }

  addBGM(src){
    let bg = document.createElement("audio");
    bg.src=src;
    bg.id="bgm";
    bg.loop = true;
    document.getElementById('music').appendChild(bg);

    let node = document.createElement("img");
    node.src="./assets/Speaker_Icon.png";
    node.id = "speaker";
    node.addEventListener('click', this.togglePause);

    document.getElementById('canvas').appendChild(node);
  }

  changeBGM(src){
    let bgm = document.getElementById('bgm');
    if (bgm.playing){
      bgm.pause();
    }
    bgm.src=src;
    bgm.currentTime = 0;
    bgm.loop = true;
    bgm.load();
  }

  togglePause() {
    // console.log("YO YOU WANNA PAUSE STUFF");
    const bgm = document.getElementById("bgm");
    const img = document.getElementById("speaker");

    bgm.paused ? bgm.play() : bgm.pause();
    
    return bgm.paused ? img.src = "./assets/mute_icon.png" : img.src = "./assets/Speaker_Icon.png";
    
  }

  gameOverBad() {
    // event listener to restart the game
    this.ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

    const eb = new Path2D();
    eb.rect(440, 369, 120, 2);
    this.ctx.fillStyle = "rgba(255,255,255,1)";
    this.ctx.fill(eb);

    this.ctx.fillStyle = 'FFFFFF';
    this.ctx.font = "24px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillText("You Died...", Game.DIM_X / 2, Game.DIM_Y / 2);
    this.ctx.fillText("Play again?", 500, 360);


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

    this.playing = false;
  }

  level1End() {
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
    const totalHealed = "Total Healed: " + this.game.healed + " hp";
    const eb = new Path2D();
    eb.rect(440, (Game.DIM_Y / 2) + 93, 120, 2);
    this.ctx.fillStyle = "rgba(255,255,255,1)";
    this.ctx.fill(eb);

    this.ctx.fillStyle = 'FFFFFF';
    this.ctx.font = "24px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillText(overhealText, Game.DIM_X / 2, Game.DIM_Y / 2);
    this.ctx.fillText(totalHealed, Game.DIM_X / 2, (Game.DIM_Y / 2) + 30);
    this.ctx.fillText(deathCountText, Game.DIM_X / 2, (Game.DIM_Y / 2) + 60);
    this.ctx.fillText("Next Level", Game.DIM_X / 2, (Game.DIM_Y / 2) + 90);

    // event listener to restart the game
    const backing = new Path2D();
    backing.rect(430, 370, 150, 26);
    this.ctx.fillStyle = "rgba(0,0,0,0.05)";
    this.ctx.fill(backing);

    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      if (this.ctx.isPointInPath(backing, (e.clientX - rect.x), (e.clientY - rect.y))) {

        this.level2();
      }
    });
    // end event listener

    this.playing = false;
  }

  gameOverScreen() {
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
    const totalHealed = "Total Healed: " + this.game.healed + " hp";
    const eb = new Path2D();
    eb.rect(438, (Game.DIM_Y / 2) + 93, 120, 2);
    this.ctx.fillStyle = "rgba(255,255,255,1)";
    this.ctx.fill(eb);

    this.ctx.fillStyle = 'FFFFFF';
    this.ctx.font = "24px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillText(overhealText, Game.DIM_X / 2, Game.DIM_Y / 2);
    this.ctx.fillText(totalHealed, Game.DIM_X / 2, (Game.DIM_Y / 2) + 30);
    this.ctx.fillText(deathCountText, Game.DIM_X / 2, (Game.DIM_Y / 2) + 60);
    this.ctx.fillText("Play again?", Game.DIM_X / 2, (Game.DIM_Y / 2) + 90);

    // event listener to restart the game
    const backing = new Path2D();
    backing.rect(430, 370, 150, 26);
    this.ctx.fillStyle = "rgba(0,0,0,0.05)";
    this.ctx.fill(backing);

    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      if (this.ctx.isPointInPath(backing, (e.clientX - rect.x), (e.clientY - rect.y))) {
        this.level1();
      }
    });
    // end event listener
    this.playing = false;
  }
}



module.exports = GameView;