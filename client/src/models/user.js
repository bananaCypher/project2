var Investment = require('./investment.js')

var User = function(name){
  this.name = name,
  this.portfolio = undefined,
  this.accountBalance = 500,
  this.insideTrader = false
};

User.prototype = {
  buyShares: function(share, quantity, params){
    var outlay = share.currentPrice * quantity;
    var investment = new Investment(share, params);
    investment.quantity = quantity
    this.portfolio.addInvestment(investment);
    this.accountBalance -= outlay;
  },
  sellShares: function(investment){
    var outlay = investment.share.currentPrice * investment.quantity;
    this.portfolio.removeInvestment(investment);
    this.accountBalance += outlay;
  },
  sellShort: function(share, quantity, params){
    var outlay = share.currentPrice * quantity;
    var investment = new Investment(share, params);
    investment.quantity = quantity;
    investment.short = true;
    this.portfolio.addInvestment(investment);
    this.accountBalance += outlay;
  },
  buyShort: function(investment){
    if(!investment.short){
      console.log('this action is illegal!');
    }
    else{
      var outlay = investment.share.currentPrice * investment.quantity;
      this.portfolio.removeInvestment(investment);
      this.accountBalance -= outlay;
    }
  },
  spreadRumours: function(share, percentage){
    if(!this.insideTrader){
      console.log('this action is illegal!');
    }
    else{
      share.crashValue(percentage);
    }
  },
  pumpStock: function(share, percentage){
    if(!this.insideTrader){
      console.log('this action is illegal!');
    }
    else{
      share.inflateValue(percentage);
    }
  }
}

module.exports = User;