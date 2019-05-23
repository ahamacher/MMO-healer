/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/game.js":
/*!*********************!*\
  !*** ./src/game.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const Tank = __webpack_require__(/*! ./units/tank.js */ \"./src/units/tank.js\");\nconst Healer = __webpack_require__(/*! ./units/healer.js */ \"./src/units/healer.js\");\nconst Dps = __webpack_require__(/*! ./units/dps.js */ \"./src/units/dps.js\");\nconst Boss = __webpack_require__(/*! ./units/boss.js */ \"./src/units/boss.js\");\nconst Spells = __webpack_require__(/*! ./spells.js */ \"./src/spells.js\");\n\nclass Game {\n  constructor(options){\n    // teamcomp array goes {tanks: X, healer: Y, dps: Z}\n    this.comp = options.comp;\n    this.party = [];\n    this.dead = options.dead;\n    this.activeGCD = false;\n    this.gcdTime = 1800;\n    this.gcdRemaining = 1800;\n    this.isCasting = false;\n    this.castTimeInitial = 0;\n    this.castTime = 0;\n    this.spellText = \"\";\n    this.mp = 1000;\n    this.bg = options.bg;\n    this.spellIcons = options.spellIcons;\n    this.overheal = 0;\n    this.healed = 0;\n    this.gameOver = false;\n    \n\n    // probably not needed\n    this.ctx = options.ctx;\n    this.canvas = options.canvas;\n\n    // creating units\n    this.addFriendlyNpc(options.ctx, options.canvas);\n    this.addBoss(options.ctx, options.canvas, options.bossSrc);\n    this.addPlayerSpells();\n  }\n\n  // l\n\n  findSelected(){\n    const selected = this.party.find(member => member.selected === true);\n    \n    this.party.forEach(member => {\n      if (member !== selected){\n        member.selected = false;\n      }\n    });\n    return selected;\n  }\n\n  showSelected(member){\n    console.log(member);\n  }\n\n  clearSelected(){\n    this.party.forEach(member => {\n      member.selected = false;\n    });\n  }\n\n\n  addFriendlyNpc(ctx, canvas){\n    if (this.comp.tank + this.comp.healer + this.comp.dps > 20){\n      return \"error too many partymembers\";\n    }\n    let pos = 0;\n    let i = 0;\n    let j = 0;\n    let k = 0;\n\n    while (i < this.comp.tank){\n      this.party.push(new Tank({pos: Game.NPC_POS[pos], ctx, canvas, game: this }));\n      // this.addNpcListener(pos);\n      pos = pos + 1;\n      i = i + 1;\n    }\n    while (j < this.comp.healer){\n      this.party.push(new Healer({pos: Game.NPC_POS[pos], ctx, canvas, game: this }));\n      // this.addNpcListener(pos);\n      pos = pos + 1;\n      j = j + 1;\n    }\n    while (k < this.comp.dps){\n      this.party.push(new Dps({pos: Game.NPC_POS[pos], ctx, canvas,game: this }));\n      // this.addNpcListener(pos);\n      pos = pos + 1;\n      k = k + 1;\n    }\n  }\n\n  addBoss(ctx, canvas, bossSrc) {\n    this.boss = new Boss({ pos: [633,104], ctx, canvas, game: this, bossSrc });\n  }\n\n  playerCastBar(ctx) {\n    if (this.isCasting){\n      let barLength = ((this.castTime / this.castTimeInitial) * 275);\n      if (this.castTime < 120) {\n        barLength = 0;\n      }\n\n      ctx.fillStyle = '#000000';\n      ctx.beginPath();\n      ctx.rect(148, 463, 275, 21);\n      ctx.fill();\n\n      ctx.fillStyle = '#9900cc';\n      ctx.beginPath();\n      ctx.rect(148, 463, barLength, 21);\n      ctx.fill();\n\n      ctx.fillStyle = '#FFFFFF';\n      ctx.font = \"18px Arial\";\n      ctx.textAlign = \"center\";\n      ctx.fillText(this.spellText, 285.5, 480.5);\n\n      this.castTime += 120;\n    }\n    if (this.castTime >= this.castTimeInitial){\n      this.castTime = 0;\n      this.isCasting = false;\n      this.castTimeInitial = 0;\n      this.spellText = \"\";\n    }\n  }\n\n  manaBar(ctx){\n    // manabar backing\n    ctx.fillStyle = '#000000';\n    ctx.beginPath();\n    ctx.rect(148, 433, 275, 21);\n    ctx.fill();\n\n    const currentMp = ((this.mp / 1000) * 275);\n    ctx.fillStyle = '#0066cc';\n    ctx.beginPath();\n    ctx.rect(148, 433, currentMp, 21);\n    ctx.fill();\n\n    ctx.fillStyle = '#FFFFFF';\n    ctx.font = \"18px Arial\";\n    ctx.textAlign = \"center\";\n    ctx.fillText(\"Mana\", 285.5, 450.5);\n  }\n\n  addPlayerSpells(){\n    let selected;\n    document.addEventListener('keydown', (e) => {\n      switch (e.which){\n        case 49:\n          console.log('1 key was pressed');\n          selected = this.findSelected();\n          if (!this.activeGCD) {\n            new Spells({ game: this }).cure(selected);\n          }\n          break;\n        case 50:\n          console.log('2 key was pressed');\n          selected = this.findSelected();\n          if (!this.activeGCD) {\n            new Spells({ game: this }).regen(selected);\n          }\n          break;\n        case 51:\n          console.log('3 key was pressed');\n          if (!this.activeGCD) {\n            new Spells({game: this}).aoeHeal();\n          }\n          break;\n        case 48:\n          console.log('0 key pressed, you gonna win!');\n          this.boss.currentHp = 1;\n          break;\n      }\n    });\n  }\n\n  // gcdWait(){\n  //   setTimeout(() => {\n  //     this.activeGCD = false;\n  //   }, this.gcdTime);\n  // }\n\n  drawPlayerBox(ctx){\n    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);\n    ctx.fillStyle = '#CCCCCC';\n    ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);\n\n    ctx.fillStyle = \"#99ccff\";\n    ctx.beginPath();\n    ctx.rect(40, 40, 475, 375);\n    ctx.fill();\n  }\n\n  animateGCD(ctx){\n    if (this.activeGCD) {\n      this.gcdRemaining = this.gcdRemaining - 120;\n      if (this.gcdRemaining <= 0){\n        this.activeGCD = false;\n        this.gcdRemaining = this.gcdTime;\n      }\n      // 1800/ 63 = x / crr time \n      const gcdHeight = Math.floor((this.gcdRemaining / this.gcdTime) * 63);\n      \n      // spell 1\n      ctx.fillStyle = 'rgba(0,0,0,0.5)';\n      ctx.beginPath();\n      ctx.rect(40, 502, 63, gcdHeight);\n      ctx.fill();\n\n      // spell 2\n      ctx.beginPath();\n      ctx.rect(123, 502, 63, gcdHeight);\n      ctx.fill();\n\n      // spell 3\n      ctx.beginPath();\n      ctx.rect(206, 502, 63, gcdHeight);\n      ctx.fill();\n\n      // spell 4\n      ctx.beginPath();\n      ctx.rect(289, 502, 63, gcdHeight);\n      ctx.fill();\n\n      // spell 5\n      ctx.beginPath();\n      ctx.rect(372, 502, 63, gcdHeight);\n      ctx.fill();\n\n      // spell 6\n      ctx.beginPath();\n      ctx.rect(455, 502, 63, gcdHeight);\n      ctx.fill();\n    }\n  }\n\n  drawPlayerSpells(ctx){\n    // spell 1\n    ctx.fillStyle = '#99ccff';\n    // ctx.beginPath();\n    // ctx.rect(40, 502, 63, 63);\n    // ctx.fill();\n    ctx.drawImage(\n      this.spellIcons.cureIcon, 40, 502,63,63\n    );\n\n    // spell 2\n    // ctx.beginPath();\n    // ctx.rect(123, 502, 63, 63);\n    // ctx.fill();\n    ctx.drawImage(\n      this.spellIcons.regenIcon, 123, 502, 63, 63\n    );\n\n    // spell 3\n    // ctx.beginPath();\n    // ctx.rect(206, 502, 63, 63);\n    // ctx.fill();\n    ctx.drawImage(\n      this.spellIcons.aoeHeal, 206, 502, 63, 63\n    );\n\n    // spell 4\n    ctx.beginPath();\n    ctx.rect(289, 502, 63, 63);\n    ctx.fill();\n\n    // spell 5\n    ctx.beginPath();\n    ctx.rect(372, 502, 63, 63);\n    ctx.fill();\n\n    // spell 6\n    ctx.beginPath();\n    ctx.rect(455, 502, 63, 63);\n    ctx.fill();\n  }\n\n  drawMonsterBox(ctx){\n    // monster hp\n    ctx.fillStyle = '#cc0000';\n    ctx.beginPath();\n    ctx.rect(605, 55, 300, 26);\n    ctx.fill();\n\n    // monster box\n    // ctx.fillStyle = '#33cc33';\n    // ctx.beginPath();\n    // ctx.rect(633, 104, 245, 350);\n    // ctx.fill();\n\n    // monster cast bar\n    ctx.fillStyle = '#9900cc';\n    ctx.beginPath();\n    ctx.rect(605, 476, 300, 26);\n    ctx.fill();\n  }\n\n\n  draw(ctx){\n\n    // npc bounding box\n    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);\n    ctx.fillStyle = '#CCCCCC';\n    ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);\n    \n    // ctx.beginPath();\n    ctx.drawImage(this.bg, 0, 0, Game.DIM_X, Game.DIM_Y);\n\n    ctx.fillStyle = \"rgba(82, 82, 122, 0.5)\";\n    ctx.beginPath();\n    ctx.rect(40, 40, 475, 375);\n    ctx.fill();\n\n    // drawing player spell list\n    this.drawPlayerSpells(ctx);\n\n    //drawing monster box\n    this.drawMonsterBox(ctx);\n    this.boss.draw(ctx);\n\n    // rendering all npc frames\n    this.party.forEach(member => {\n      member.draw(ctx);\n      // this.showSelected();\n    });\n    this.playerCastBar(ctx);\n    // this.logCurrHp();\n    // this.findSelected();\n    this.manaBar(ctx);\n    this.animateGCD(ctx);\n  }\n}\n\nGame.DIM_X = 1000;\nGame.DIM_Y = 600;\nGame.FPS = 30;\n\nGame.NPC_POS = [\n  [57,90], [148, 90], [239,90], [330,90], [421,90],\n  [57,171], [148, 171], [239,171], [330,171], [421,171],\n  [57,252], [148, 252], [239,252], [330,252], [421,252],\n  [57,333], [148, 333], [239,333], [330,333], [421,333]\n];\n\nmodule.exports = Game;\n\n\n//# sourceURL=webpack:///./src/game.js?");

/***/ }),

/***/ "./src/game_view.js":
/*!**************************!*\
  !*** ./src/game_view.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const Game = __webpack_require__(/*! ./game.js */ \"./src/game.js\");\n\nclass GameView {\n  constructor(ctx) {\n    this.ctx = ctx;\n\n    this.canvas = document.getElementById('game-canvas');\n  }\n\n  start(){\n    this.ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);\n    this.ctx.fillStyle = '#050505';\n    this.ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);\n\n    // ctx.beginPath();\n    // this.ctx.drawImage(this.bg, 0, 0, Game.DIM_X, Game.DIM_Y);\n\n    this.ctx.fillStyle = '#FFFFFF';\n    this.ctx.font = \"24px Arial\";\n    this.ctx.textAlign = \"center\";\n    this. ctx.fillText(\"Start MMO Healer\", Game.DIM_X/2, Game.DIM_Y/2);\n\n\n// start button event listener\n    const backing = new Path2D();\n    backing.rect(400, 278, 200, 26);\n    this.ctx.fillStyle = \"rgba(0,0,0,0.001\";\n    this.ctx.fill(backing);\n\n    this.canvas.addEventListener('click', (e) => {\n      const rect = this.canvas.getBoundingClientRect();\n      if (this.ctx.isPointInPath(backing, (e.clientX - rect.x), (e.clientY - rect.y))) {\n        \n        this.level1();\n      }\n    });\n\n  }\n\n  gameOverScreen() {\n    // removing event listener for spell. refactor later.\n    document.removeEventListener('keydown', (e) => {\n      switch (e.which) {\n        case 49:\n          console.log('1 key was pressed');\n          selected = this.findSelected();\n          if (!this.activeGCD) {\n            new Spells({ game: this }).cure(selected);\n          }\n          break;\n        case 50:\n          console.log('2 key was pressed');\n          selected = this.findSelected();\n          if (!this.activeGCD) {\n            new Spells({ game: this }).regen(selected);\n          }\n          break;\n        case 51:\n          console.log('3 key was pressed');\n          if (!this.activeGCD) {\n            new Spells({ game: this }).aoeHeal();\n          }\n          break;\n        case 48:\n          console.log('0 key pressed, you gonna win!');\n          this.boss.currentHp = 1;\n          break;\n      }\n    });\n\n    // gameover screen\n\n    this.ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);\n    this.ctx.fillStyle = '#000000';\n    this.ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);\n\n    const overhealVal = Math.floor((this.game.overheal/this.game.healed) * 100);\n    const overhealText = \"Overheal percentage %\" + overhealVal;\n\n    const eb = new Path2D();\n    eb.rect(360,304,280,2);\n    this.ctx.fillStyle = \"rgba(255,255,255,1)\";\n    this.ctx.fill(eb);\n    \n    this.ctx.fillStyle = 'FFFFFF';\n    this.ctx.font = \"24px Arial\";\n    this.ctx.textAlign = \"center\";\n    this.ctx.fillText(overhealText, Game.DIM_X / 2, Game.DIM_Y / 2 );\n\n    this.ctx.fillStyle = 'FF0000';\n    this.ctx.font = \"24px Arial\";\n    this.ctx.textAlign = \"center\";\n    this.ctx.fillText(\"Play again?\", 500, 360);\n\n    // event listener to restart the game\n    const backing = new Path2D();\n    backing.rect(430, 340, 150, 26);\n    this.ctx.fillStyle = \"rgba(0,0,0,0.05)\";\n    this.ctx.fill(backing);\n\n    this.canvas.addEventListener('click', (e) => {\n      const rect = this.canvas.getBoundingClientRect();\n      if (this.ctx.isPointInPath(backing, (e.clientX - rect.x), (e.clientY - rect.y))) {\n\n        this.level1();\n      }\n    });\n    // end event listener\n  }\n\n\n\n\n  level1(){\n    document.removeEventListener('click', (e) => {\n      const rect = this.canvas.getBoundingClientRect();\n      if(this.ctx.isPointInPath(backing, (e.clientX - rect.x), (e.clientY - rect.y))) {\n\n      this.level1();\n    }});\n\n    document.getElementById('bossfight').pause();\n    document.getElementById('bossfight').currentTime = 0;\n\n    document.getElementById('bossfight').play();\n\n    const canvasEl = document.getElementById('game-canvas');\n    const ctx = canvasEl.getContext(\"2d\");\n    const boss = document.getElementById('bahamut');\n    const dead = document.getElementById('skull');\n    const bg = document.getElementById('dungeon1');\n\n    const cureIcon = document.getElementById('cure');\n    const regenIcon = document.getElementById('regen');\n    const aoeHeal = document.getElementById('aoeheal');\n\n    const spellIcons = { cureIcon, regenIcon, aoeHeal };\n\n    const options = {\n      comp: { tank: 1, healer: 1, dps: 3 },\n      ctx, canvas: canvasEl, bossSrc: boss,\n      dead, bg, spellIcons\n    };\n\n\n    this.game = new Game(options);\n    \n    setInterval(() => {\n      if (this.game.gameOver) {\n        this.gameOverScreen();\n      } else {\n        this.game.draw(this.ctx);\n      }\n    }, 120);\n  }\n}\n\n\n\nmodule.exports = GameView;\n\n//# sourceURL=webpack:///./src/game_view.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const Game = __webpack_require__(/*! ./game.js */ \"./src/game.js\");\nconst GameView = __webpack_require__(/*! ./game_view.js */ \"./src/game_view.js\");\n\n\n\n\ndocument.addEventListener('DOMContentLoaded', () => {\n  const canvasEl = document.getElementById('game-canvas');\n  const ctx = canvasEl.getContext(\"2d\");\n  canvasEl.width = Game.DIM_X;\n  canvasEl.height = Game.DIM_Y;\n\n  new GameView(ctx).start();\n});\n\n// const options = { maxHp: 200, attackRate: 1800, attackValue: 4, color: \"#003399\", pos: [40,40]}\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/npc.js":
/*!********************!*\
  !*** ./src/npc.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const Tank = __webpack_require__(/*! ./units/tank.js */ \"./src/units/tank.js\");\nconst Spells = __webpack_require__(/*! ./spells.js */ \"./src/spells.js\");\n\nclass NPC {\n  constructor(options){\n    this.maxHp = options.maxHp;\n    this.currentHp = options.maxHp;\n    this.attackRate = options.attackRate || 1500;\n    this.attackValue = options.attackValue;\n    this.color = options.color || \"#CC22CC\";\n    this.pos = options.pos;\n    this.buffs = [];\n    this.debuffs = [];\n    this.selected = false;\n    this.game = options.game;\n\n    this.ctx = options.ctx;\n    this.canvas = options.canvas;\n\n    this.startAttack();\n\n    const backing = new Path2D();\n    backing.rect(this.pos[0], this.pos[1], 76, 66);\n    this.ctx.fillStyle = \"#000000\";\n    this.ctx.fill(backing);\n\n    this.canvas.addEventListener('click', (e) => {\n      const rect = this.canvas.getBoundingClientRect();\n      if (this.ctx.isPointInPath(backing, (e.clientX - rect.x), (e.clientY - rect.y))){\n\n        this.game.clearSelected();\n        this.selected = true;\n        this.game.showSelected(this);\n      }\n    });\n\n  }\n\n  startAttack(){\n    setInterval(() => {\n      this.attack(this.game.boss);\n    }, this.attackRate);\n  }\n\n  attack(target){\n    if (target.currentHp > 0 && this.currentHp > 0){\n      target.currentHp = target.currentHp - this.attackValue;\n    }\n    if (target.currentHp < 0){\n      target.currentHp = 0;\n    }\n  }\n\n  receiveDamage(amount){\n    this.currentHp = this.currentHp - amount;\n  }\n\n  isDead(){\n    if (this.currentHp <= 0){\n      return true;\n    }\n    return false;\n  }\n\n  draw(ctx) {\n    ctx.fillStyle = this.color;\n    ctx.beginPath();\n\n    if (this.isDead()){\n      ctx.lineWidth = 2;\n      ctx.strokeStyle = \"black\";\n      ctx.strokeRect(this.pos[0], this.pos[1], 76, 66);\n\n      ctx.rect(\n        this.pos[0],\n        this.pos[1],\n        76, 66\n      );\n      ctx.fill();\n      ctx.save();\n\n      ctx.restore();\n      ctx.shadowBlur = 0;\n      ctx.shadowColor = 'rgba(0,0,0,0)';\n\n      ctx.drawImage(\n        this.game.dead,\n        this.pos[0] + 2,\n        this.pos[1] + 2,\n        71,\n        50\n      );\n    } else {\n      ctx.lineWidth = 2;\n      ctx.strokeStyle = \"white\";\n      ctx.strokeRect(this.pos[0], this.pos[1], 76, 66);\n\n      ctx.rect(\n        this.pos[0],\n        this.pos[1],\n        76, 66\n        );\n        ctx.fill();\n      ctx.save();\n\n      if (this.selected){\n        // ctx.shadowBlur = 10;\n        // ctx.shadowColor = \"white\";\n        ctx.lineWidth = 2;\n        ctx.strokeStyle = 'yellow';\n        ctx.strokeRect(this.pos[0], this.pos[1], 76, 66);\n      }\n\n      ctx.restore();\n      ctx.shadowBlur = 0;\n      ctx.shadowColor = 'rgba(0,0,0,0)';\n    }\n    this.drawMaxHP(ctx);\n    this.drawCurrentHp(ctx);\n    // 120 is hardcoded currently to the refresh rate\n    this.statusAction(800);\n  }\n\n  statusAction(rate){\n    if (this.buffs.length > 0) {\n      this.buffs.forEach(buff => {\n        this.executeBuff(buff);\n        buff.duration -= rate;\n      });\n      // console.log(this.buffs);\n      // console.log(rate);\n      this.buffs = this.buffs.filter(buff => buff.duration > rate);\n      // console.log(this.buffs);\n    }\n  }\n\n  executeBuff(buff){\n    switch (buff.type){\n      case \"heal\":\n        this.game.healed += buff.heal;\n        if (this.currentHp !== this.maxHp){\n          this.currentHp = this.currentHp + buff.heal;\n        } else {\n          this.game.overheal += buff.heal;\n        }\n        break;\n    }\n  }\n\n  drawMaxHP(ctx) {\n    const posX = this.pos[0] + 5;\n    const posY = this.pos[1] + 48; \n    ctx.fillStyle = \"#000000\";\n    \n    ctx.lineWidth = 2;\n    ctx.strokeStyle = \"black\";\n    ctx.strokeRect(posX, posY, 66, 10);\n    ctx.beginPath();\n    ctx.rect(\n      posX, posY, 66, 10\n    );\n\n    ctx.fill();\n  }\n\n  drawCurrentHp(ctx) {\n    const posX = this.pos[0] + 5;\n    const posY = this.pos[1] + 48;\n    ctx.fillStyle = '#cc0000';\n    const currentHpVal = Math.floor((this.currentHp / this.maxHp) * 66);\n\n    ctx.beginPath();\n    ctx.rect(\n      posX, posY, currentHpVal, 10\n    );\n    ctx.fill();\n  }\n\n  receiveBuff(buff){\n    // buffs should come in with a buff type\n    // buffs should come in with a duration\n\n    this.buffs.push(buff);\n  }\n\n  remove(buff){\n    this.buffs.splice(this.buffs.indexOf(buff), 1);\n  }\n\n  buffTime(){\n    if (this.buffs){\n      this.buffs.forEach(buff => {\n        buff.time = buff.time - 1;\n        if (buff.time <= 0) {\n          this.remove(buff);\n        }\n      });\n      \n    }\n  }\n}\n\nmodule.exports = NPC;\n\n\n//# sourceURL=webpack:///./src/npc.js?");

/***/ }),

/***/ "./src/spells.js":
/*!***********************!*\
  !*** ./src/spells.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("class Spells {\n  constructor(options){\n    this.game = options.game;\n  }\n\n  cure(target) {\n    // add cast time and animation\n    if (this.game.mp > 10){\n      setTimeout(() => {\n        console.log(`cure was used!`);\n        target.currentHp += 20;\n        this.game.healed += 20;\n        if (target.currentHp > target.maxHp){\n          this.game.overheal += target.currentHp - target.maxHp;\n          target.currentHp = target.maxHp;\n        }\n        this.game.mp = this.game.mp - 10;\n      }, 1500);\n      this.game.activeGCD = true;\n      this.game.spellText = \"Cure\";\n      this.game.castTime = 0;\n      this.game.isCasting = true;\n      this.game.castTimeInitial = 1500;\n      // this.game.gcdWait();\n    }\n  }\n\n  regen(target) {\n    const regen = { type: 'heal', heal: 5, duration: 15000 };\n    target.buffs.push(regen);\n    this.game.mp -= 15;\n    this.game.activeGCD = true;\n    // this.game.gcdWait();\n  }\n\n  aoeHeal() {\n    //no target needed\n    if (this.game.mp > 30) {\n      setTimeout(() => {\n        this.game.party.forEach(member => {\n          member.currentHp += 15;\n          this.game.healed += 15;\n          if (member.currentHp > member.maxHp) {\n            this.game.overheal += member.currentHp - member.maxHp;\n            member.currentHp = member.maxHp;\n          }\n        });\n        this.game.mp = this.game.mp - 30;\n      }, 1500);\n      this.game.activeGCD = true;\n      this.game.spellText = \"Aoe Heal\";\n      this.game.castTime = 0;\n      this.game.isCasting = true;\n      this.game.castTimeInitial = 1500;\n      console.log(this.game.mp);\n    }\n  }\n}\n\nmodule.exports = Spells;\n\n//# sourceURL=webpack:///./src/spells.js?");

/***/ }),

/***/ "./src/units/boss.js":
/*!***************************!*\
  !*** ./src/units/boss.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const NPC = __webpack_require__(/*! ../npc.js */ \"./src/npc.js\");\n\nclass Boss extends NPC {\n  constructor(options){\n\n    options.maxHp = 2000;\n    options.attackRate = 1800;\n    options.attackValue = 15;\n    options.color = '#003399';\n    options.pos = options.pos;\n    super(options);\n    this.bossSrc = options.bossSrc;\n\n    this.startAttack();\n  }\n\n  startAttack(){\n    setInterval(() => {\n      this.attackRandom();\n    }, this.attackRate);\n  }\n\n\n\n    // // monster box\n    // ctx.fillStyle = '#33cc33';\n    // ctx.beginPath();\n    // ctx.rect(633, 104, 245, 350);\n    // ctx.fill();\n\n    // // monster cast bar\n    // ctx.beginPath();\n    // ctx.rect(605, 476, 300, 26);\n    // ctx.fill();\n// 1.317\n// 186 nat\n\n  draw(ctx){\n    if (this.isDead()){\n      ctx.fillStyle = '#1d1d1d';\n    }\n    \n    ctx.beginPath();\n    ctx.drawImage(\n      this.bossSrc,\n      this.pos[0],\n      this.pos[1] + 10,\n      245,\n      326.5\n    );\n\n    this.drawMaxHP(ctx);\n    this.drawCurrentHp(ctx);\n  }\n\n  drawMaxHP(ctx) {\n    const posX = 605;\n    const posY = 55; \n    ctx.fillStyle = \"#000000\";\n    \n\n    ctx.beginPath();\n    ctx.rect(\n      posX, posY, 300, 26\n    );\n\n    ctx.fill();\n  }\n\n  drawCurrentHp(ctx) {\n    const posX = 605;\n    const posY = 55;\n    ctx.fillStyle = '#cc0000';\n    const currentHpVal = Math.floor((this.currentHp / this.maxHp) * 300);\n\n    if (this.currentHp <= 0){\n      setTimeout(() => { this.game.gameOver = true; }, 2000);\n    }\n\n    ctx.beginPath();\n    ctx.rect(\n      posX, posY, currentHpVal, 26\n    );\n    ctx.fill();\n  }\n\n  selectRandom() {\n    let weights = [];\n    this.game.party.forEach((member, idx) => {\n      for (let i = 0; i < member.weight; i++){\n        weights.push(idx);\n      }\n    });\n    const selectedIdx = Math.floor(Math.random() * weights.length);\n    return weights[selectedIdx];\n  }\n\n  attackRandom(){\n    let selectedTarget = this.selectRandom();\n    \n    if (this.game.party[selectedTarget].currentHp <= 0){\n      const alive = this.game.party.find(target => target.currentHp > 0);\n      // console.log(alive, 'is alive');\n      // console.log(selectedTarget);\n      selectedTarget = this.game.party.indexOf(alive);\n    }\n    this.attack(this.game.party[selectedTarget]);\n  }\n\n}\n\nmodule.exports = Boss;\n\n//# sourceURL=webpack:///./src/units/boss.js?");

/***/ }),

/***/ "./src/units/dps.js":
/*!**************************!*\
  !*** ./src/units/dps.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const NPC = __webpack_require__(/*! ../npc.js */ \"./src/npc.js\");\n\nclass Dps extends NPC {\n  constructor(options){\n\n    options.maxHp = 100;\n    options.attackRate = 1500;\n    options.attackValue = 8;\n    options.color = '#990000';\n    options.pos = options.pos;\n    super(options);\n\n    this.weight = this.calcWeight();\n  }\n\n  calcWeight(){\n    const nonTanks = this.game.comp.healer + this.game.comp.dps;\n\n    const weight = 30 / nonTanks;\n    return weight;\n  }\n}\n\nmodule.exports = Dps;\n\n//# sourceURL=webpack:///./src/units/dps.js?");

/***/ }),

/***/ "./src/units/healer.js":
/*!*****************************!*\
  !*** ./src/units/healer.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const NPC = __webpack_require__(/*! ../npc.js */ \"./src/npc.js\");\n\nclass Healer extends NPC {\n  constructor(options){\n\n    options.maxHp = 100;\n    options.attackRate = 1800;\n    options.attackValue = 0;\n    options.color = '#009933';\n    options.pos = options.pos;\n    super(options);\n    this.weight = this.calcWeight();\n  }\n\n  calcWeight(){\n    // tanks are statically weighted to 70%\n    // const numTanks = this.game.comp.tank;\n\n    // weighting the rest to be attacked 30% of the time\n    const nonTanks = this.game.comp.healer + this.game.comp.dps;\n\n    const weight = 30 / nonTanks;\n    return weight;\n  }\n}\n\nmodule.exports = Healer;\n\n//# sourceURL=webpack:///./src/units/healer.js?");

/***/ }),

/***/ "./src/units/tank.js":
/*!***************************!*\
  !*** ./src/units/tank.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const NPC = __webpack_require__(/*! ../npc.js */ \"./src/npc.js\");\n\nclass Tank extends NPC {\n  constructor(options){\n\n    options.maxHp = 200;\n    options.attackRate = 1800;\n    options.attackValue = 4;\n    options.color = '#003399';\n    options.pos = options.pos;\n    super(options);\n\n    this.weight = 70;\n  }\n}\n\nmodule.exports = Tank;\n\n//# sourceURL=webpack:///./src/units/tank.js?");

/***/ })

/******/ });