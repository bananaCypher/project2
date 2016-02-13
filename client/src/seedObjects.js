var User = require('./models/user.js');
var Portfolio = require('./models/portfolio.js');
var Investment = require('./models/investment.js');
var Share = require('./models/share.js');
var investmentsSample = require('./shareSample.json');




var Barry = new User("Barry Manilow");

var barryPortfolio = new Portfolio();

console.log(investmentsSample);

for (investment of investmentsSample){
  var newShare = new Share({
    name: investment.name,
    epic: investment.epic,
    price: investment.price,
    pastCloseOfDayPrices: investment.pastCloseOfDayPrices,
  });
  var params = {
    quantity: investment.quantity,
    buyPrice: investment.buyPrice,
    buyDate: investment.buyDate
  };
  var newInvestment = new Investment(newShare, params);
  barryPortfolio.addInvestment(newInvestment); 
}

Barry.portfolio = barryPortfolio;

module.exports = Barry;
