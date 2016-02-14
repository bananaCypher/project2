var User = require('../user.js');
var Portfolio = require('../portfolio');
var Investment = require('../investment.js');
var Share = require('../share.js');

var chai = require('chai')
var assert = chai.assert;
var expect = chai.expect;

describe('Share', function(){
  beforeEach(function(){
    newShare = new Share({
      name: "Worldpay",
      epic:"WGP",
      location: "England",
      price: 301.00,
      pastCloseOfDayPrices: [232.60, 220.00, 222.00, 221.60, 240.00, 238.00, 235.40]
    })
  });

  // BASIC MODEL ATTRIBUTES

  it('should have a share name', function(){
    assert.equal('Worldpay', newShare.shareName);
  });
  it('should have an epic', function(){
    assert.equal('WGP', newShare.epic);
  });
  it('should have current price', function(){
    assert.equal(301.00, newShare.currentPrice);
  });
  it('should have an array of past close of day prices', function(){
    assert.equal(232.60, newShare.pastCloseOfDayPrices[0]);
  });
  it('should have a location', function(){
    assert.equal("England", newShare.location)
  });

  // FUNCTIONALITY
  
  it('should be able to crash in price', function(){
    var newSharePrice = newShare.currentPrice;
    newShare.crashValue(15);
    expect(newShare.currentPrice).to.equal(newSharePrice * 0.85);
  });
  it('should be able to inflate in price', function(){
    var newSharePrice = newShare.currentPrice;
    newShare.inflateValue(15);
    expect(newShare.currentPrice).to.equal(newSharePrice * 1.15);
  });
});
