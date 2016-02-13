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
  },
  sevenDayAverage: function(){
    var total = 0;
    for(price of this.pastCloseOfDayPrices){
      total += price;
    }
    return total / 7;
  },
  crashValue: function(percentage){
    if(percentage >= 100){
      console.log('cannot reduce a shareprice below zero');
    }
    else{
      var newPrice = this.currentPrice * ((100 - percentage)/ 100);
      this.currentPrice = newPrice;
    }
  },
  inflateValue: function(percentage){
    var newPrice = this.currentPrice * ((100 + percentage) / 100);
    this.currentPrice = newPrice;
  }
};

module.exports = Investment;