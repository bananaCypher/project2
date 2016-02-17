var assert = require('assert');
var Portfolio = require('../portfolio.js')
var Investment = require('../investment.js');
var Share = require('../share.js');
var Target = require('../target.js');

var investmentSample = {
  "name": "Worldpay",
  "epic":"WGP",
  "price": 301.00,
  "quantity": 1000,
  "buyPrice": 209.40,
  "pastCloseOfDayPrices": [232.60, 220.00, 222.00, 221.60, 240.00, 238.00, 235.40],
  "buyDate":"2015-12-22"
}

describe('Target', function(){
  beforeEach(function(){
    share = new Share(investmentSample);
    investment = new Investment(share, investmentSample);
  });
  it("should do nothing if the price isn't changed enough", function(){
    var test = false;
    var target = new Target({
      object: share,
      property: 'price',
      check: 'gt',
      target: 400 
    }, function(description){
      test = true;
      assert.equal(test, false);
      done();
    })
    share.price = 380;
  });
  it("should run the callback if the price is greater than the given target", function(done){
    var test = false;
    var finishTest = function(){
      done();
    }
    var target = new Target({
      object: share,
      property: 'price',
      check: 'gt',
      target: 400 
    }, function(description){
      test = true;
      assert.equal(test, true);
      finishTest()
    })
    share.price = 405;
  });
  it('should run the callback when the price is less than the given target', function(done){
    var test = false;
    var target = new Target({
      object: share,
      property: 'price',
      check: 'lt',
      target: 200 
    }, function(description){
      test = true;
      assert.equal(test, true);
      done();
    })
    share.price = 150;
  });
  it('should run the callback when the price is equal to the given target', function(done){
      var test = false;
      var target = new Target({
        object: share,
        property: 'price',
        check: 'eq',
        target: 100 
      }, function(description){
        test = true;
        assert.equal(test, true);
        done();
      })
      share.price = 100;
  });
  it('should work on an invesetment as well', function(done){
      var test = false;
      var target = new Target({
        object: investment,
        property: 'currentValue',
        check: 'gt',
        target: 30100
      }, function(description){
        test = true;
        assert.equal(test, true);
        done();
      })
      investment.share.price += 400;
  });
});