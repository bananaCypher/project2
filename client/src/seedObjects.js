var User = require('./models/user.js');
var Portfolio = require('./models/portfolio.js');
var Investment = require('./models/investment.js');
var investmentsSample = require('./shareSample.json');


var Barry = new User("Barry Manilow");

var barryPortfolio = new Portfolio();

console.log(investmentsSample);
for(investment of investmentsSample){
  var newInvestment = new Investment(investment);
  barryPortfolio.addInvestment(newInvestment); 
}

Barry.portfolio = barryPortfolio;

module.exports = Barry;
