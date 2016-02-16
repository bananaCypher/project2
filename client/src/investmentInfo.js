var singleScatterChart = require('./charts/singleScatterChart.js');
var TargetChecker = require('./targets.js');
var index = require('./basicDisplay.js');

var loadInfo = function(investment, user){
  new singleScatterChart(investment);
  var investmentView = document.getElementById('investmentView');
  investmentView.innerHTML = "";

  if(investment.valueChange("percentage")){
    var value = "Change in Value Since Bought: " + investment.valueChange("percentage").toFixed(2) + "%<br>";
  }
  else {
    var value = ""
  }
  var info = document.createElement('p');
  info.innerHTML = "<h2>" + investment.shareName + " (" + investment.share.epic + ")</h2><h3>Current Price</h3>" + investment.share.currentPrice + " GBX <h3>Current Value</h3>£" + Number(investment.currentValue() / 100).toLocaleString() + "<br><br>" + value + "7 Day Moving Average: " + investment.sevenDayAverage().toFixed(2) + " GBX<br>Quantity Held: " + investment.quantity;
  investmentView.appendChild(info); 

  index.displayCurrentPortfolioValue(user);
  index.displayAccountBalance(user);

}

var TradeForm = function(option, user, investment){

  if(option === "Buy"){
    var inputId = "buyInput";
    var submitId = "buySubmit";
  }
  else if(option === "Sell"){
    var inputId = "sellInput";
    var submitId = "sellSubmit";
  }

  var form = document.createElement('form');
  form.innerHTML = "<input type='text' id=" + inputId + " placeholder='Enter Amount'><input type='submit' id=" + submitId + " value='" + option + " Shares'>";

  form.onsubmit = function(event){
    var value = document.getElementById(inputId).value;
    event.preventDefault();
    console.log("form submit", value);

    if(option === "Buy"){
      user.buyShares(investment.share, parseInt(value), investment);
      user.save();
      loadInfo(investment, user);
    }
    else if(option ==="Sell"){
      user.sellShares(investment, parseInt(value)) 
      user.save();
      loadInfo(investment, user);
    }
  }  
  return form;
}

var showPreview = function(investment, user){
  var preview = document.getElementById('preview');
  var buyPreview = document.getElementById('buyPreview');
  var sellPreview = document.getElementById('sellPreview');
  var buyValue = document.getElementById("buyInput").value;
  var sellValue = document.getElementById("sellInput").value;
  if(buyValue === ""){
  buyPreview.style.display = "none";
  }
  else {
    buyValue = parseInt(buyValue) * investment.share.currentPrice || "";
    buyPreview.style.display = "inline-block";
    buyPreview.innerHTML = "Buy Price: £" + Number(buyValue / 100).toLocaleString();
    if(buyValue > user.accountBalance){
      buyPreview.style.color = "red";
    }
    else {
      buyPreview.style.color = "green";
    }
  }
  if(sellValue === ""){
    sellPreview.style.display = "none";
  }
  else{
    sellValue = parseInt(sellValue) * investment.share.currentPrice || "";
    sellPreview.style.display = "inline-block";
    sellPreview.innerHTML = "<br>Sell Value: £" + Number(sellValue / 100).toLocaleString();
  }

}

var showInvestmentInfo = function(inputName, user){
  var investment = user.portfolio.find({shareName: inputName });
  var buysellView = document.getElementById('buysellView');
  buysellView.innerHTML = "";

  loadInfo(investment, user);

  var buyForm = new TradeForm("Buy", user, investment);
  var sellForm = new TradeForm("Sell", user, investment);

  buysellView.appendChild(buyForm); 
  buysellView.appendChild(sellForm); 

  new TargetChecker(user, investment);

  document.onkeyup = function(){
    showPreview(investment, user);
  }
}

module.exports = showInvestmentInfo;

