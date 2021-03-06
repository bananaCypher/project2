var User = require('./models/user.js');
var Portfolio = require('./models/portfolio.js');
var Investment = require('./models/investment.js');
var Share = require('./models/share.js');
var Target = require('./models/target.js');
var Barry;

var getUser = function (userName, callback) {
  var request = new XMLHttpRequest();
  request.open('GET', '/user/' + userName);
  request.onload = function(){
    if (request.status === 200) {
      data = JSON.parse(request.responseText);
      Barry = new User(data.name, data._id);
      Barry.accountBalance = data.accountBalance;
      Barry.insideTrader = data.insideTrader;

      barryPortfolio = new Portfolio();
      for (var investment of data.portfolio.investments) {
        var newShare = new Share({
          name: investment.share.shareName,
          epic: investment.share.epic,
          location: investment.share.location,
          price: investment.share.currentPrice,
          pastCloseOfDayPrices: investment.share.pastCloseOfDayPrices
        }); 
        var newInvestment = new Investment(newShare, investment);
        barryPortfolio.investments.push(newInvestment);
      }
      Barry.portfolio = barryPortfolio;
      callback(Barry);
    }
  };
  request.send(null);
};

module.exports = getUser;
