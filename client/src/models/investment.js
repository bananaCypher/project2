var Investment = function(params){
  this.shareName = params.name;
  this.epic = params.epic;
  this.currentPrice = params.price;
  this.quantity = params.quantity;
  this.buyPrice = params.buyPrice;
  this.pastCloseOfDayPrices = params.pastCloseOfDayPrices;
  this.buyDate = params.buyDate;
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
  }
};

module.exports = Investment;