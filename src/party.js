class Party {
  constructor(options){
    // sizes can be 5,10,20
    this.size = options.size;
    // comp ex: [ 1,1,3 ]
    this.comp = options.comp;
    this.team = [];
    this.addMembers();
  }

  // addMembers(num, type){
    
  // }
}

module.exports = Party;