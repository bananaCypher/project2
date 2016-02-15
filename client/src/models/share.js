var Share = function(params){
  this.shareName = params.name;
  this.epic = params.epic;
  this.location = params.location;
  this.currentPrice = params.price;
  this.pastCloseOfDayPrices = params.pastCloseOfDayPrices;
};

Share.prototype = {
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
}

module.exports = Share;
