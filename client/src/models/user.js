var Investment = require('./investment.js')

var User = function(name){
  this.name = name,
  this.portfolio = undefined,
  this.accountBalance = 5000,
  this.insideTrader = false
};

User.prototype = {
  buyShares: function(share, quantity, params){
    var outlay = share.currentPrice * quantity;

    if(this.portfolio.find({shareName: share.shareName})){
      var investment = this.portfolio.find({shareName: share.shareName})
      investment.quantity += quantity;
    }
    else {
      var investment = new Investment(share, params);
      investment.quantity = quantity;
      this.portfolio.addInvestment(investment);
    }
    this.accountBalance -= (outlay / 100);
  },
  sellShares: function(investment, quantity){
    var outlay = investment.share.currentPrice * quantity;

    if(investment.quantity >= quantity){
      investment.quantity -= quantity;
    }
    else {
      this.portfolio.removeInvestment(investment);
    }
    this.accountBalance += (outlay / 100);
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