var shareSample = require('./specs/shareSample.js');

var senseChecker = {
  errorList: [],

  validInvestments: function(user){
    var investments = user.portfolio.investments;
    return investments;
  },

  validRegions: function(sample){
    var regionArray = []
    for(entry of sample){
      if(entry.location != regionArray[0] && entry.location != regionArray[1] && entry.location != regionArray[2]){
        regionArray.push(entry.location);
      }
    }
    return regionArray;
  },

  validShares: function(sample){
    var shareArray = [];
    for(entry of sample){
      shareArray.push(entry);
    }
    return shareArray;
  },

  errorMessage: function(error){
    var error = 'Error #' + error;
    var newErrorList = this.errorList;
    newErrorList.push(error);
    this.errorList = newErrorList;
  },

  isNotNegative: function(quantity){
    if(quantity <= 0){
      this.errorMessage('2: cannot use negative number');
      return false;
    }
    else{
      return true;
    }
  },

  isBelowMax: function(quantity, investment){
    if(quantity > investment.quantity){
      return false;
      this.errorMessage('3: more shares than available');
    }
    else{
      return true;
    }
  },

  isInvestment: function(investment, user){
    var filtered = this.validInvestments(user).filter(function(value){
      return value === investment;
    });
    if(filtered.length == 0){
      this.errorMessage('4: not an investment');
      return false;
    }
    else{
      return true;
    }
  },

  isShare: function(shareName){
    var filtered = [];
    for(entry of this.validShares(shareSample)){
      if(entry.name === shareName){
        filtered.push(entry)
      }
    }
    if(filtered.length == 0){
      this.errorMessage('1: is not a share');
      return false;
    }
    else{
      return true;
    }
  },

  isRegion:  function(region){
    var filtered = [];
    for(entry of this.validRegions(shareSample)){
      if(entry === region){
        filtered.push(entry);
      }
    }
    if (filtered.length == 0){
      this.errorMessage('5: not a region');
      return false;
    }
    else{
      return true;
    }
  },

  isGoodPercentage: function(percentage){
    if(percentage >= 100){
      this.errorMessage('6: cannot reduce by 100% or more');
      return false;
    }
    else{
      return true;
    }
  },

  maxedAccount: function(userBalance, spend){
    if(userBalance < spend){
      this.errorMessage('7: not enough money');
      return false;
    }
    else{
      return true;
    }
  },

  isQuantity: function(quantity){
    if((typeof(quantity) != 'number') || (isNaN(quantity))) {
      this.errorMessage('8: not a number');
      return false;
    }
    else{
      return true;
    }
  }
}

module.exports = senseChecker;