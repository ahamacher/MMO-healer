class Spells {
  constructor(options){
    this.target = options.target;
    this.boss = options.boss;
    this.game = options.game;
  }

  flare() {
    const { party } = this.game;
    const randomDmg = (Math.random() * 5) + 10;
    setTimeout(() => {

      party.forEach(member => {
        if (member.currentHp > 0 && this.currentHp > 0) {
          member.currentHp = member.currentHp - randomDmg;
        }
        if (member.currentHp < 0) {
          member.currentHp = 0;
        }
      });
    }, 2500);
  }
}


module.exports = Spells;
