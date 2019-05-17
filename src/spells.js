class Spells {
  constructor(options){
    this.mp = 1000;
  }

  cure(target) {
    // add cast time and animation
    target.currentHp += 20;
    this.mp -= 10;
  }

  // regen(target) {
  //   target.buff.push(regen);
  //   this.mp -= 15;
  // }
}