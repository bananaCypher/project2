var assert = require('assert');
var Portfolio = require('../portfolio.js')
var Investment = require('../investment.js');
var investmentsSample = require('../../shareSample.json');

describe('Portfolio', function(){
  beforeEach(function(){
    portfolio = new Portfolio();
    for (var investment of investmentsSample) {
      var newInvestment = new Investment(investment);
      portfolio.addInvestment(newInvestment); 
    }
  });
  it('should have an array of Investments', function(){
    assert.notEqual(portfolio.investments[0].shareName, undefined);
  }); 
  it('should be able to add a new Investment', function(){
    var investment = new Investment(
        {
          "name": "Softcat",
          "epic":"SCT",
          "price": 322.90,
          "quantity": 2000,
          "buyPrice": 420.00,
          "pastCloseOfDayPrices": [324.40, 325.10, 323.90, 323.40, 323.10, 323.00, 322.20],
          "buyDate":"2015-02-18"
        }
    );
    portfolio.addInvestment(investment);
    assert.equal(portfolio.investments[portfolio.investments.length - 1].shareName, 'Softcat');
  });
  it('should be able to remove an Investment', function(){
    var previousLength = portfolio.investments.length;
    var investment = new Investment(
        {
          "name": "Pets At Home",
          "epic":"PETS",
          "price": 247.40,
          "quantity": 2500,
          "buyPrice": 250.50,
          "pastCloseOfDayPrices": [230.00, 232.30, 235.90, 236.60, 237.00, 240.00, 242.70],
          "buyDate":"2014-08-23"
        }    
    );
    portfolio.removeInvestment(investment);
    assert.equal(portfolio.investments.length, previousLength - 1);
  });
  it('should be able to get the array index of a given investment', function(){
    var investment = new Investment(
        {
          "name": "Softcat",
          "epic":"SCT",
          "price": 322.90,
          "quantity": 2000,
          "buyPrice": 420.00,
          "pastCloseOfDayPrices": [324.40, 325.10, 323.90, 323.40, 323.10, 323.00, 322.20],
          "buyDate":"2015-02-18"
        }
    );
    portfolio.addInvestment(investment);
    assert.equal(portfolio.findInvestmentIndex(investment), portfolio.investments.length - 1);
  });
  it('should display the total value of all investments', function(){
    assert.equal(portfolio.totalValue(), 6648800);
  });
  it('should be able to find investments by name', function(){
    var foundInvestment = portfolio.findByName('Softcat');
    assert.equal('SCT', foundInvestment.epic);
  });
  it('should be able to find investments by epic', function(){
    var foundInvestment = portfolio.findByEpic('SCT');
    assert.equal('Softcat', foundInvestment.shareName);
  });
  it('should be able to find the largest investment', function(){
    assert.equal('Royal Bank of Scotland Group', portfolio.largestInvestment().shareName);
  });
  it('should be able to find the investment with the largest change in value', function(){
    assert.equal(portfolio.findLargestChange('percentage').toFixed(2), 1198.89);
  });
});
