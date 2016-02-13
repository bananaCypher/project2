var Investment = function(share, params){
  this.share = share;
  this.shareName = share.shareName;
  this.quantity = params.quantity;
  this.buyPrice = params.buyPrice;
  this.buyDate = params.buyDate;
};

Investment.prototype = {
  currentValue: function(){
    return this.share.currentPrice * this.quantity;
  },
  buyDateValue: function(){
    return this.buyPrice * this.quantity;
  },
  valueChange: function(measurement){
    var priceChange = this.currentValue() - this.buyDateValue();
    if(measurement === "price"){
      return priceChange;
    }
    else if(measurement === "percentage"){
      return (priceChange / this.buyDateValue()) * 100;
    }
  },
  sevenDayAverage: function(){
    var total = 0;
    for(price of this.share.pastCloseOfDayPrices){
      total += price;
    }
    return total / 7;
  },
};

module.exports = Investment;