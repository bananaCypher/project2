var Investment = require('../investment.js');
var assert = require('assert');

describe('Investment', function(){
  beforeEach(function(){
   newInvestment = new Investment({
        name: "Worldpay",
        epic:"WGP",
        price: 301.00,
        quantity: 1000,
        buyPrice: 209.40,
        pastCloseOfDayPrices: [232.60, 220.00, 222.00, 221.60, 240.00, 238.00, 235.40],
        buyDate:"2015-12-22"
      });
  });
  it('should have a share name', function(){
    assert.equal('Worldpay', newInvestment.shareName);
  });
  it('should have an epic', function(){
    assert.equal('WGP', newInvestment.epic);
  });
  it('should have current price', function(){
    assert.equal(301.00, newInvestment.currentPrice);
  });
  it('should have a quantity', function(){
    assert.equal(1000, newInvestment.quantity);
  });
  it('should have a buy price', function(){
    assert.equal(209.40, newInvestment.buyPrice);
  });
  it('should have an array of past close of day prices', function(){
    assert.equal(232.60, newInvestment.pastCloseOfDayPrices[0]);
  });
  it('should have a buy date', function(){
    assert.equal("2015-12-22", newInvestment.buyDate);
  });

})