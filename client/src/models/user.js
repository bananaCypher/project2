var Investment = require('./investment.js');
var senseChecker = require('./senseChecker.js');

var User = function(name, id){
  this.name = name,
  this.id = id,
  this.portfolio = undefined,
  this.accountBalance = 500000
};

User.prototype = {
  buyShares: function(share, quantity, params){
    var outlay = share.currentPrice * quantity;
    if(senseChecker.isShare(share.shareName) && senseChecker.isQuantity(quantity) && senseChecker.maxedAccount(this.accountBalance, outlay)){
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
  },
  sellShares: function(investment, quantity){
    var outlay = investment.share.currentPrice * quantity;
    if(senseChecker.isInvestment(investment, this)){    
      if(investment.quantity >= quantity){
        investment.quantity -= quantity;
        this.accountBalance += outlay;
      }
      else if(investment.quantity <= quantity){
      var difference = quantity - investment.quantity
      senseChecker.errorMessage('10: you are ' + difference + ' shares short');
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
buyShort: function(investment, quantity){
  var outlay = investment.share.currentPrice * investment.quantity;
  if(senseChecker.maxedAccount(this.accountBalance, outlay) && senseChecker.isInvestment(investment, this)){
    if(!investment.short){
      senseChecker.errorMessage('9: this investment is not a short sale');
    }
    else{
      if(investment.quantity < quantity){
        investment.quantity -= quantity;
      }
      else{
      this.portfolio.removeInvestment(investment, this);
    }
      this.accountBalance -= outlay;
    }
  }
},
spreadRumours: function(share, percentage){
  if(senseChecker.isShare(share.shareName)){
      share.crashValue(percentage);
  }
},
pumpStock: function(share, percentage){
  if(senseChecker.isShare(share.shareName)){
      share.inflateValue(percentage);
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
