var Investment = function(share){
  this.shareName = share.name;
  this.epic = share.epic;
  this.currentPrice = share.price;
  this.quantity = share.quantity;
  this.buyPrice = share.buyPrice;
  this.pastCloseOfDayPrices = share.pastCloseOfDayPrices;
  this.buyDate = share.buyDate;
};

Investment.prototype = {
  currentValue: function(){
    return this.currentPrice * this.quantity;
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
    for(price of this.pastCloseOfDayPrices){
      total += price;
    }
    return total / 7;
  },
};

module.exports = Investment;