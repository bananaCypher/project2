var User = require('../user.js');
var Portfolio = require('../portfolio');
var Investment = require('../investment.js');

var chai = require('chai')
var assert = chai.assert;
var expect = chai.expect;

describe('User', function(){
  beforeEach(function(){
    testUser = new User('Barry');
    testPortfolio = new Portfolio();
    testInvestment = new Investment({
      "name": 'BarryCorp',
      "epic": "BRC",
      "price": 210.75,
      "quantity": 1000,
      "buyPrice": 198.22,
    });
    testPortfolio.investments = [testInvestment];
    testUser.portfolio = testPortfolio;
    testUser.insideTrader = false;
    testBalance = testUser.accountBalance;
    testPortfolioBalance = testUser.portfolio.totalValue();
    testInvestmentPrice = testInvestment.currentPrice;
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
    testUser.buyShares(testInvestment, 1);
    expect(testUser.portfolio.investments[1]).to.equal(testInvestment)
  });

  it('should lose money appropriately on purchase', function(){
    testUser.buyShares(testInvestment, 1);
    expect(testUser.accountBalance).to.equal(testBalance - testInvestmentPrice);
  });

  it('should be able to sell shares', function(){
    testUser.sellShares(testInvestment, 1);
    expect(testUser.portfolio.investments[1]).to.equal(undefined);
  });

  it('should gain money appropriately on sale', function(){
    testUser.sellShares(testInvestment, 1);
    expect(testUser.accountBalance).to.equal(testBalance + testInvestmentPrice);
  });

  it('should be able to short sell shares', function(){
    expect(true).to.equal(false);
  });

  it('should be able to settle short sales', function(){
    expect(true).to.equal(false);
  });

  it('should be unable to engage in insider trading without an opt-in', function(){
    testUser.spreadRumours(testInvestment, 10);
    expect(testInvestment.currentPrice).to.not.equal(testInvestmentPrice * 0.9);
  });

  it('should be able to engage in insider trading after opting in', function (){
    testUser.insideTrader = true;
    testUser.spreadRumours(testInvestment, 10);
    expect(testInvestment.currentPrice).to.equal(testInvestmentPrice * 0.9);
  });

  it('should be able to inflate stocks', function(){
    testUser.insideTrader = true;
    testUser.pumpStock(testInvestment, 10);
    expect(testInvestment.currentPrice).to.equal(testInvestmentPrice * 1.1);
  })

})