var User = require('../user.js');
var Investment = require('../Investment.js');

var chai = require('chai')
var assert = chai.assert;
var expect = chai.expect;

describe('User', function(){
  beforeEach(function(){
    testUser = new User('Barry');
    testInvestment = new Investment({
      "name": 'BarryCorp',
      "epic": "BRC",
      "price": 210.75,
      "quantity": 1000,
      "buyPrice": 198.22,
    });
  });

  it('should have a name', function(){
    expect(testUser.name).to.equal('Barry');
  });

  it('should have an account with money', function(){
    expect(testUser.accountBalance).to.equal(500);
  });

  it('should be able to buy shares', function(){
    // THIS AWAITS INTEGRATION OF MODELS
    expect(true).to.equal(false);
  });

  it('should lose money appropriately on purchase', function(){
    testUser.buyShares(testInvestment, 1);
    expect(testUser.accountBalance).to.equal(500 - 210.75);
  });
})