var Investment = function(params){
  this.shareName = params.name;
  this.epic = params.epic;
  this.currentPrice = params.price;
  this.quantity = params.quantity;
  this.buyPrice = params.buyPrice;
  this.pastCloseOfDayPrices = params.pastCloseOfDayPrices;
  this.buyDate = params.buyDate;
};

module.exports = Investment;