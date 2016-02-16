var Investment = require('./investment.js');
var senseChecker = require('./senseChecker.js');

var User = function(name, id){
  this.name = name,
  this.id = id,
  this.portfolio = undefined,
  this.accountBalance = 500000,
  this.insideTrader = false
};

User.prototype = {
  buyShares: function(share, quantity, params){
    if(senseChecker.isShare(share.shareName)){
      var outlay = share.currentPrice * quantity;
      if(senseChecker.maxedAccount(this.accountBalance, outlay)){
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
      }
    }
  },
  sellShares: function(investment, quantity){
    if(senseChecker.isInvestment(investment, this)){    
      var outlay = investment.share.currentPrice * quantity;
      if(investment.quantity >= quantity){
        investment.quantity -= quantity;
        this.accountBalance += outlay;
      }
      else {
      // does not have enough shares to sell

      this.portfolio.removeInvestment(investment, this);
      this.accountBalance = investment.share.currentPrice * investment.quantity;
    }
  }
},
sellShort: function(share, quantity, params){
  if(senseChecker.isShare(share.shareName)){
    var outlay = share.currentPrice * quantity;
    var investment = new Investment(share, params);
    investment.quantity = quantity;
    investment.short = true;
    this.portfolio.addInvestment(investment);
    this.accountBalance += outlay;
  }
},
buyShort: function(investment){
  var outlay = investment.share.currentPrice * investment.quantity;
  if(senseChecker.maxedAccount(this.accountBalance, outlay)){
    if(senseChecker.isInvestment(investment, this)){
      if(!investment.short){
        console.log('this action is illegal!');
      }
      else{
        this.portfolio.removeInvestment(investment, this);
        this.accountBalance -= outlay;
      }
    }
  }
},
spreadRumours: function(share, percentage){
  if(senseChecker.isShare(share.shareName)){
    if(!this.insideTrader){
      var hypotheticalPrice = share.currentPrice * ((100 - percentage) / 100);
      return hypotheticalPrice;
    }
    else{
      share.crashValue(percentage);
    }
  }
},
pumpStock: function(share, percentage){
  if(senseChecker.isShare(share.shareName)){
    if(!this.insideTrader){
      var hypotheticalPrice = share.currentPrice * ((100 + percentage) / 100);
      return hypotheticalPrice;
    }
    else{
      share.inflateValue(percentage);
    }
  }
},
pumpRegion: function(region, percentage){
  if(senseChecker.isRegion(region)){
    for(investment of this.portfolio.investments){
      var share = investment.share;
      if(share.location === region){
        this.pumpStock(share, percentage);
      }
    }
  }
},
crashRegion: function(region, percentage){
  if(senseChecker.isRegion(region)){    
    for(investment of this.portfolio.investments){
      var share = investment.share;
      if(share.location === region){
        this.spreadRumours(share, percentage);
      }
    }
  }
},

save: function(){
  var request = new XMLHttpRequest();
  request.open('POST', '/user/' + this.id);
  request.setRequestHeader('Content-Type', 'application/json');
  request.send(JSON.stringify(this));
}

}

module.exports = User;
