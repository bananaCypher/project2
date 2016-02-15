var Investment = require('./investment.js')

var User = function(name, id){
  this.name = name,
  this.id = id,
  this.portfolio = undefined,
  this.accountBalance = 5000,
  this.insideTrader = false
  Object.observe(this, function(){
    this.save();
  }.bind(this));
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
      investment.buyPrice = share.currentPrice;
      this.portfolio.addInvestment(investment);
    }
    this.accountBalance -= outlay;
  },
  sellShares: function(investment, quantity){
    var outlay = investment.share.currentPrice * quantity;
    console.log(outlay);
    if(investment.quantity >= quantity){
      investment.quantity -= quantity;
    }
    else {
      this.portfolio.removeInvestment(investment);
    }
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
      var hypotheticalPrice = share.currentPrice * ((100 - percentage) / 100);
      return hypotheticalPrice;
    }
    else{
      share.crashValue(percentage);
    }
  },
  pumpStock: function(share, percentage){
    if(!this.insideTrader){
      var hypotheticalPrice = share.currentPrice * ((100 + percentage) / 100);
      return hypotheticalPrice;
    }
    else{
      share.inflateValue(percentage);
    }
  },
  pumpRegion: function(region, percentage){
    for(investment of this.portfolio.investments){
      var share = investment.share;
      if(share.location === region){
        this.pumpStock(share, percentage);
      }
    }
  },
  crashRegion: function(region, percentage){
    for(investment of this.portfolio.investments){
      var share = investment.share;
      if(share.location === region){
        this.spreadRumours(share, percentage);
      }
    }
  },
  save: function(){
    console.log(this);
    var request = new XMLHttpRequest();
    request.open('POST', '/user/' + this.id);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify(this));
  }
}

module.exports = User;
