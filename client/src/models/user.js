var User = function(name){
  this.name = name,
  this.portfolio = [],
  this.accountBalance = 500
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
  }
}

module.exports = User;