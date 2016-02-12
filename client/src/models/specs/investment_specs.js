var Investment = require('../investment.js');
var assert = require('assert');

describe('account', function(){
  it('should have a share name', function(){
    var newInvestment = new Investment({ name: "Worldpay" });
    assert.equal('Worldpay', newInvestment.shareName);
  });

})