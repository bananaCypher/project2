var assert = require('assert');
var Portfolio = require('../portfolio.js')
var Investment = require('../investment.js');
var Share = require('../share.js');
var User = require('../user.js');
var investmentsSample = require('./shareSample.js');

describe('Portfolio', function(){
  beforeEach(function(){
    portfolio = new Portfolio();
    testUser = new User('Barry');
    for (var investment of investmentsSample) {
      var newShare= new Share(investment);
      var newInvestment = new Investment(newShare, investment);
      portfolio.addInvestment(newInvestment); 
    }
    testUser.portfolio = portfolio;
    newData = {
      "name": "Softcat",
      "epic":"SCT",
      "price": 322.90,
      "quantity": 2000,
      "buyPrice": 420.00,
      "pastCloseOfDayPrices": [324.40, 325.10, 323.90, 323.40, 323.10, 323.00, 322.20],
      "buyDate":"2015-02-18"
    }
  });

  // BASIC MODEL ATTRIBUTES
  it('should have an array of Investments', function(){
    assert.notEqual(portfolio.investments[0].shareName, undefined);
  }); 

  // MODEL FUNCTIONALITY
  it('should be able to add a new Investment', function(){
    var share = new Share(newData);
    var investment = new Investment(share, newData);
    portfolio.addInvestment(investment);
    assert.equal(portfolio.investments[portfolio.investments.length - 1].shareName, 'Softcat');
  });
  it('should be able to remove an Investment', function(){
    var previousLength = portfolio.investments.length;
    var investment = portfolio.findByName("Pets At Home");
    portfolio.removeInvestment(investment, testUser);
    assert.equal(portfolio.investments.length, previousLength - 1);
  });
  it('should be able to get the array index of a given investment', function(){
    var share = new Share(newData);
    var investment = new Investment(share, newData);
    portfolio.addInvestment(investment);
    assert.equal(portfolio.findInvestmentIndex(investment), portfolio.investments.length - 1);
  });
  it('should display the total value of all investments', function(){
    assert.equal(portfolio.totalValue(), 6648800);
  });
  it('should be able to find investments by name', function(){
    var foundInvestment = portfolio.findByName('Softcat');
    assert.equal('SCT', foundInvestment.share.epic);
  });
  it('should be able to find investments by epic', function(){
    var foundInvestment = portfolio.findByEpic('SCT');
    assert.equal('Softcat', foundInvestment.shareName);
  });
  it('should be able to find the largest investment', function(){
    assert.equal('Royal Bank of Scotland Group', portfolio.largestInvestment().shareName);
  });
  it('should be able to find the investment with the largest change in value', function(){
    var investment = portfolio.findLargestPriceChange();
    assert.equal(investment.shareName, 'Robinson');
  });
  it('should be able to find out the investment with the largest percentage change', function(){
    var investment = portfolio.findLargestPercentageChange();
    assert.equal(investment.shareName, 'Stadium');
  });
  it('should be able to show total portfolio value for any day of the last week', function(){
    assert.equal(portfolio.pastTotalValue(1), 6547000)
  });
  it('should be able to find total value of investments in a location', function(){
    var investment = portfolio.totalValueOfRegion('China');
    assert.equal(investment, 1895500);
  })
});
