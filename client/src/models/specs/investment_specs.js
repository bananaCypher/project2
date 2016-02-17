var Investment = require('../investment.js');
var Share = require('../share.js');
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

var investmentSample = {
  "name": "Worldpay",
  "epic":"WGP",
  "price": 301.00,
  "quantity": 1000,
  "buyPrice": 209.40,
  "pastCloseOfDayPrices": [232.60, 220.00, 222.00, 221.60, 240.00, 238.00, 235.40],
  "buyDate":"2015-12-22"
}

describe('Investment', function(){
  beforeEach(function(){
    newShare = new Share(investmentSample);
    newInvestment = new Investment(newShare, investmentSample);
  });

  // BASIC MODEL ATTRIBUTES
  it('should have a Share object', function(){
    assert.equal(newInvestment.share, newShare);
  });
  it('should contain the share name separately', function(){
    assert.equal(newInvestment.shareName, newShare.shareName);
  });
  it('should have a quantity', function(){
    assert.equal(1000, newInvestment.quantity);
  });
  it('should have a buy price', function(){
    assert.equal(209.40, newInvestment.buyPrice);
  });
  it('should have a buy date', function(){
    assert.equal("2015-12-22", newInvestment.buyDate);
  });
  it('should not be a short unless set so', function(){
    assert.equal(newInvestment.short, false);
  });
  it('should be a short if set so', function(){
    newInvestment.short = true;
    assert.equal(newInvestment.short, true);
  });

  // MODEL FUNCTIONALITY
  it('should be able to return its current value', function(){
    assert.equal(301000, newInvestment.currentValue());
  });
  it('should be able to return the value when originally bought', function(){
    assert.equal(209400, newInvestment.buyDateValue());
  }); 
  it('should be able to return the change in value by price', function(){
    assert.equal(91600, newInvestment.valueChange("price"));
  }); 
  it('should be able to return the change in value by percentage', function(){
    assert.equal("43.74", newInvestment.valueChange("percentage").toFixed(2));
  }); 
  it('should be able to return a last 7 days average for the share price', function(){
    assert.equal(229.94, newInvestment.sevenDayAverage().toFixed(2));
  });

})