var singleScatterChart = require('./charts/singleScatterChart.js');
var TargetChecker = require('./targets.js');

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

  var basicInfo = document.getElementById('basicInfo');
  basicInfo.innerHTML = "";
  var p = document.createElement('p');
  p.innerHTML = "<h2>Current Total Value</h2>£" + Number(user.portfolio.totalValue() / 100).toLocaleString();
  basicInfo.appendChild(p);

  var balanceInfo = document.getElementById('balanceInfo');
  balanceInfo.innerHTML = "";
  var p = document.createElement('p');
  p.innerHTML = "<h2>Account Credit</h2>£" + Number(user.accountBalance / 100).toLocaleString();
  balanceInfo.appendChild(p);

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
}


module.exports = showInvestmentInfo;
