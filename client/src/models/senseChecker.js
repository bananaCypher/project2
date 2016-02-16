var senseChecker = {
  errorList: [],
  validRegions: ['China', 'UK', 'USA'],
  validShares: ["Fusionex", "Empiric Student Prop", "Worldpay", "Pets At Home", "Cyprotex", "Robinson", "Softcat", "Royal Bank of Scotland Group", "NCC", "Stadium"],
  validInvestments: function(user){
    var investments = user.portfolio.investments;
    return investments;
  },

  errorMessage: function(error){
    var error = 'Error #' + error;
    var newErrorList = this.errorList;
    newErrorList.push(error);
    this.errorList = newErrorList;
  },

  isShare: function(share){
    var filtered = this.validShares.filter(function(value){
      return value === share;
    });
    if(filtered.length == 0){
      this.errorMessage('1: is not a share');
      return false;
    }
    else{
      return true;
    }
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

  isRegion:  function(region){
    var filtered = this.validRegions.filter(function(value){
      return value === region;
    });
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
      this.errorMessage('6: cannot reduce by 100% or above');
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