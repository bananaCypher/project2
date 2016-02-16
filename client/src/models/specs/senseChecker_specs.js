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
    senseChecker.errorList = [];
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
  it('should when asked reject percentages of 100 or more', function(){
    senseChecker.isGoodPercentage(250);
    expect(senseChecker.errorList[0]).to.equal('Error #6: cannot reduce by 100% or above');
  });
  it('should reject quantity submissions that are not numbers', function(){
    expect(senseChecker.isQuantity('a brick')).to.equal(false);
  });
  it('should reject quantity submissions that are NaN', function(){
    expect(senseChecker.isQuantity(NaN)).to.equal(false);
  });
  it('should pass quantity submissions that are numbers', function(){
    expect(senseChecker.isQuantity(10)).to.equal(true);
  });

// ACTIONS

  it('should pass failures to an errorlist', function(){
    senseChecker.isShare('ObviousFake');
    expect(senseChecker.errorList[0]).to.equal('Error #1: is not a share');
  });

})