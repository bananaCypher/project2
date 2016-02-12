var Portfolio = function(){
  this.investments = [];  
}
Portfolio.prototype = {
  addInvestment: function(investment){
    this.investments.push(investment);
  },
  removeInvestment: function(investment){
    var index = this.findInvestmentIndex(investment);
    this.investments.splice(index, 1);
  },
  findInvestmentIndex: function(investmentToFind){
    arrayLoop:
    for (var i = 0, len = this.investments.length; i < len; i++) {
     var investment = this.investments[i];
      for (var key in investmentToFind) {
        if (investmentToFind[key] != investment[key]) {
          continue arrayLoop;
        }
      } 
      for (var key in investment) {
        if (investmentToFind[key] != investment[key]) {
          continue arrayLoop;
        }
      } 
      return i;
    }
  }
};

module.exports = Portfolio;
