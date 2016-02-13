var Investment = function(share, quantity, buyPrice, buyDate){
  this.share = share;
  this.shareName = share.shareName;
  this.quantity = quantity;
  this.buyPrice = buyPrice;
  this.buyDate = buyDate;
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