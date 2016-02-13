var User = function(name){
  this.name = name,
  this.portfolio = undefined,
  this.accountBalance = 500,
  this.insideTrader = false
}

User.prototype = {
  buyShares: function(investment, number){
    var outlay = investment.currentPrice * number;
    investment.quantity = number;
    this.portfolio.addInvestment(investment);
    this.accountBalance -= outlay;
  },
  sellShares: function(investment, number){
    var outlay = investment.currentPrice * number;
    investment.quantity = number;
    this.portfolio.removeInvestment(investment);
    this.accountBalance += outlay;
  },
  spreadRumours: function(investment, percentage){
    if(this.insideTrader == false){
      console.log('this action is illegal!');
    }
    else{
      investment.crashValue(percentage);
    }
  },
  pumpStock: function(investment, percentage){
    if(this.insideTrader == false){
      console.log('this action is illegal!');
    }
    else{
      investment.inflateValue(percentage);
    }
  }
}

module.exports = User;