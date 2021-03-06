var senseChecker = require('./senseChecker.js');

var Portfolio = function(){
  this.investments = [];  
}
Portfolio.prototype = {
  addInvestment: function(investment){
    this.investments.push(investment);
  },
  removeInvestment: function(investment, user){
    if(senseChecker.isInvestment(investment, user)){
      var index = this.findInvestmentIndex(investment);
      this.investments.splice(index, 1);
    }
  },
  findInvestmentIndex: function(investmentToFind){
    arrayLoop:
    for (var i = 0; i < this.investments.length; i++) {
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
},
totalValue: function(){
  var sum = 0;
  for (var investment of this.investments) {
    sum += investment.currentValue();
  }
  return sum;
},
pastTotalValue: function(day){
  var sum = 0;
  for(var investment of this.investments) {
    var dayTotal = investment.quantity * investment.share.pastCloseOfDayPrices[7 - day];
    sum += dayTotal;
  }
  return sum;
},
totalValueOfRegion: function(region){
  var sum = 0;
  for(var investment of this.investments){
    if(investment.share.location === region){
      var total = investment.quantity * investment.share.currentPrice;
      sum += total;
    }
  }
  return sum;
},
find: function(search){
    // accepts an object where the key is the search field and the value is the search term
    // e.g. find({name: 'My Investment'});
    arrayLoop:
    for (var investment of this.investments) {
      for (var key in search){
        if (investment.share[key] != search[key]) {
          continue arrayLoop;
        }
      }   
      return investment;
    }
  },
  findByName: function(name){
    return this.find({shareName: name})
  },
  findByEpic: function(epic){
    return this.find({epic: epic})
  },
  largestInvestment: function(){
    var largest = this.investments[0];
    for (var investment of this.investments) {
      if (investment.currentValue() > largest.currentValue()) { 
        largest = investment;
      }
    }
    return largest; 
  },
  findLargestChange: function(measurement){
    var highestInvestment = this.investments[0];
    for (investment of this.investments) {
      if(investment.valueChange(measurement) > highestInvestment.valueChange(measurement)){
        highestInvestment = investment;
      }
    }
    return highestInvestment;
  },
  findLargestPriceChange: function(){
    return this.findLargestChange('price');
  },
  findLargestPercentageChange: function(){
    return this.findLargestChange('percentage');
  }
};

module.exports = Portfolio;
