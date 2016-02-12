var User = require('../user.js');

var assert = require('assert');
var expect = require('expect');

describe('User', function(){
  beforeEach(function(){
    var user = new User('Barry');
  });
  it('should have a name', function(){
    expect(User.name).to.equal('Barry');
  });
})