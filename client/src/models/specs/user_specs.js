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
  });

  it('should have a name', function(){
    expect(testUser.name).to.equal('Barry');
  });

  it('should have an account with money', function(){
    expect(testUser.accountBalance).to.equal(500);
  });

  it('should be able to buy shares', function(){
    testUser.buyShares(testInvestment, 1);
    expect(testUser.portfolio.investments[1]).to.equal(testInvestment)
  });

  it('should lose money appropriately on purchase', function(){
    testUser.buyShares(testInvestment, 1);
    expect(testUser.accountBalance).to.equal(500 - 210.75);
  });

  it('should be able to sell shares', function(){
    testUser.sellShares(testInvestment, 1);
    expect(testUser.portfolio.investments[1]).to.equal(undefined);
  });

  it('should gain money appropriately on sale', function(){
    testUser.sellShares(testInvestment, 1);
    expect(testUser.accountBalance).to.equal(500 + 210.75);
  })
})