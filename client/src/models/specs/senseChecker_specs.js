var User = require('../user.js');
var Portfolio = require('../portfolio');
var Investment = require('../investment.js');
var Share = require('../share.js');
var SenseChecker = require('../senseChecker.js');

var chai = require('chai')
var assert = chai.assert;
var expect = chai.expect;

describe('SenseChecker', function(){
  beforeEach(function(){
    testData = {
      "name": "Fusionex",
      "epic":"FXI",
      "location": "USA",
      "price": 120.00,
      "quantity": 2000,
      "buyPrice": 80.00,
      "pastCloseOfDayPrices": [92.00, 89.00, 103.00, 125.00, 108.00, 98.00, 110.00],
      "buyDate":"2014-11-15"
    },
    testUser = new User('Barry');
    testPortfolio = new Portfolio();
    testShare = new Share(testData);
    testInvestment = new Investment(testShare, testData);
    testPortfolio.investments = [testInvestment];
    testUser.portfolio = testPortfolio;
    testUser.insideTrader = false;
    testBalance = testUser.accountBalance;
    testPortfolioBalance = testUser.portfolio.totalValue();
    testSharePrice = testShare.currentPrice;
  })

  it('should catch non-existing regions', function(){
    
  });

})