var User = require('./models/user.js');
var Portfolio = require('./models/portfolio.js');
var Investment = require('./models/investment.js');
var investmentsSample = require('./shareSample.json');




var Barry = new User("Barry Manilow");

var barryPortfolio = new Portfolio();

console.log(investmentsSample);

for (share of investmentsSample){
  var newShare = new Share(share);
  var newInvestment = new Investment(share, params);
  barryPortfolio.addInvestment(newInvestment); 
}

Barry.portfolio = barryPortfolio;

module.exports = Barry;
