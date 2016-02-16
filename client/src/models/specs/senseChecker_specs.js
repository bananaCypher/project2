var User = require('../user.js');
var Portfolio = require('../portfolio');
var Investment = require('../investment.js');
var Share = require('../share.js');
var senseChecker = require('../senseChecker.js');

var chai = require('chai')
var assert = chai.assert;
var expect = chai.expect;

describe('senseChecker', function(){
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

  it('should reject non-existing regions', function(){
    expect(senseChecker.isRegion('France')).to.equal(false);
  });
  it('should pass existing regions', function(){
    expect(senseChecker.isRegion('USA')).to.equal(true);
  });
  it('should reject non-existing shares', function(){
    expect(senseChecker.isShare('ObviousFake')).to.equal(false);
  });
  it('should pass existing shares', function(){
    expect(senseChecker.isShare('Fusionex')).to.equal(true);
  });
  it('should reject non-existing investments', function(){
    expect(senseChecker.isInvestment('a fake', testUser)).to.equal(false);
  });
  it('should pass existing investments', function(){
    expect(senseChecker.isInvestment(testInvestment, testUser)).to.equal(true);
  });
  it('should reject negative numbers on quantity', function(){
    expect(senseChecker.isNotNegative(-5)).to.equal(false);
  });
  it('should reject positive numbers higher than testInvestment.quantity', function(){
    expect(senseChecker.isBelowMax(3000, testInvestment)).to.equal(false);
  });
  it('should pass positive numbers lower than testInvestment.quantity', function(){
    expect(senseChecker.isBelowMax(1000, testInvestment)).to.equal(true);
  });
  it('should reject buy attempts that exceed user balance', function(){
    testUser.buyShares(testShare, 10000, testData);
    expect(testUser.accountBalance).to.equal(testBalance);
  });
  it('should pass failures to an errorlist', function(){
    senseChecker.errorList = [];
    senseChecker.isShare('ObviousFake');
    expect(senseChecker.errorList[0]).to.equal('Error #1: is not a share');
  });

})