var senseChecker = {
  validRegions: ['China', 'UK', 'USA'],
  validShares: ["Fusionex", "Empiric Student Prop", "Worldpay", "Pets At Home", "Cyprotex", "Robinson", "Softcat", "Royal Bank of Scotland Group", "NCC", "Stadium"],
  validInvestments: function(user){
    var investments = user.portfolio.investments;
    return investments;
  },

  isShare: function(share){
    var filtered = this.validShares.filter(function(value){
      return value === share;
    });
    if(filtered.length == 0){
      return false;
    }
    else{
      return true;
    }
  },

  isNotNegative: function(quantity){
    if(quantity <= 0){
      return false;
    }
  },

  isInvestment: function(investment, user){
    var filtered = this.validInvestments(user).filter(function(value){
      return value === investment;
    });
    if(filtered.length == 0){
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
      return false;
    }
    else{
      return true;
    }
  }
}

module.exports = senseChecker;