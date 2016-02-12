var User = function(name){
  this.name = name,
  this.portfolio = null,
  this.accountBalance = 500
}

User.prototype = {
  buyShares: function(investment, number){
    var outlay = investment.currentPrice * number;

    this.accountBalance -= outlay;
  },
}

module.exports = User;