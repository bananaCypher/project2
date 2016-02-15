var User = require('../user.js');
var Portfolio = require('../portfolio');
var Investment = require('../investment.js');
var Share = require('../share.js');

var chai = require('chai')
var assert = chai.assert;
var expect = chai.expect;

describe('User', function(){
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
  });

  it('should have a name', function(){
    expect(testUser.name).to.equal('Barry');
  });

  it('should have an account with money', function(){
    expect(testUser.accountBalance).to.equal(testBalance);
  });

  it('should be able to have a portfolio', function(){
    expect(testUser.portfolio).to.equal(testPortfolio);
  })

  it('should be able to buy shares', function(){
    testUser.buyShares(testShare, 1, testData);
    expect(testUser.portfolio.investments[1].share).to.equal(testShare)
  });

  it('should lose money appropriately on purchase', function(){
    testUser.buyShares(testShare, 1, testData);
    expect(testUser.accountBalance).to.equal(testBalance - testSharePrice);
  });

  it('should be able to sell shares', function(){
    testUser.sellShares(testInvestment);
    expect(testUser.portfolio.investments[1]).to.equal(undefined);
  });

  it('should gain money appropriately on sale', function(){
    testUser.sellShares(testInvestment);
    expect(testUser.accountBalance).to.equal(testBalance + (testSharePrice * testInvestment.quantity));
  });

  it('should be able to short sell shares', function(){
    testUser.sellShort(testShare, 10, testData);
    expect(testUser.accountBalance).to.equal(testBalance + (testSharePrice * 10));
  });

  it('should be able to settle short sales', function(){
    testUser.sellShort(testShare, 10, testData);
    testUser.buyShort(testUser.portfolio.investments[1]);
    expect(testUser.accountBalance).to.equal(testBalance);
  });

  it('should be unable to engage in insider trading without an opt-in', function(){
    testUser.spreadRumours(testShare, 10);
    expect(testShare.currentPrice).to.equal(testSharePrice);
  });

  it('should be able to see the projected results of insider trading only if it lacks opt-in', function(){
    testUser.spreadRumours(testShare, 10);
    expect(testUser.spreadRumours(testShare, 10)).to.equal(108);
  })

  it('should be able to engage in insider trading after opting in', function (){
    testUser.insideTrader = true;
    testUser.spreadRumours(testShare, 10);
    expect(testShare.currentPrice).to.equal(testSharePrice * 0.9);
  });

  it('should be able to inflate stocks', function(){
    testUser.insideTrader = true;
    testUser.pumpStock(testShare, 10);
    expect(testShare.currentPrice).to.equal(testSharePrice * 1.1);
  });

  it('should be able to inflate stocks by region', function(){
    testUser.insideTrader = true;
    var usaTotal = portfolio.totalValueOfRegion('USA');
    testUser.pumpRegion('USA', 10);
    expect(testShare.currentPrice).to.equal(testSharePrice * 1.1);
  });
  it('should be able to deflate stocks by region', function(){
    testUser.insideTrader = true;
    var usaTotal = portfolio.totalValueOfRegion('USA');
    testUser.crashRegion('USA', 10);
    expect(testShare.currentPrice).to.equal(testSharePrice * 0.9);
  });
})