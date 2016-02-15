var User = require('./models/user.js');
var Portfolio = require('./models/portfolio.js');
var Investment = require('./models/investment.js');
var Share = require('./models/share.js');
var Barry;

var getBarry = function(){
}

module.exports = function (callback) {
  var request = new XMLHttpRequest();
  request.open('GET', '/user/56c0f16a61c1654319c185ac');
  request.onload = function(){
    if (request.status === 200) {
      data = JSON.parse(request.responseText);
      Barry = new User(data.name);

      barryPortfolio = new Portfolio();
      for (var investment of data.portfolio.investments) {
        var newShare = new Share({
          name: investment.share.shareName,
          epic: investment.share.epic,
          location: investment.share.location,
          price: investment.share.currentPrice,
          pastCloseOfDayPrices: investment.share.pastCloseOfDayPrices
        }); 
        console.log(newShare);
        var newInvestment = new Investment(newShare, investment);
        barryPortfolio.investments.push(newInvestment);
      }
      Barry.portfolio = barryPortfolio;
      callback(Barry);
    }
  };
  request.send(null);
};
