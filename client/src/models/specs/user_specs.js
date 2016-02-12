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
})