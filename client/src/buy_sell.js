var singleScatterChart = require('./charts/singleScatterChart.js');

var loadInfo = function(investment){
new singleScatterChart(investment);
var investmentView = document.getElementById('investmentView');
investmentView.innerHTML = "";

var info = document.createElement('p');
info.innerHTML = "<h2>" + investment.shareName + " (" + investment.share.epic + ")</h2><h3>Current Price</h3>" + investment.share.currentPrice + " GBX <h3>Current Value</h3>£" + Number(investment.currentValue() / 100).toLocaleString() + "<br><br>Change in Value Since Bought: " + investment.valueChange("percentage").toFixed(2) + "%<br>Average for Last 7 Days: " + investment.sevenDayAverage().toFixed(2) + " GBX<br>Quantity Held: " + investment.quantity;

investmentView.appendChild(info); 
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
    console.log(user);
    loadInfo(investment);
    }
    else if(option ==="Sell"){
    user.sellShares(investment, parseInt(value)) 
    console.log(user);
    loadInfo(investment);
    }
  }  
return form;
}

var showInvestmentInfo = function(inputName, user){
  var investment = user.portfolio.find({shareName: inputName });
  var buysellView = document.getElementById('buysellView');

  loadInfo(investment);

  var buyForm = new TradeForm("Buy", user, investment);
  var sellForm = new TradeForm("Sell", user, investment);

  buysellView.appendChild(buyForm); 
  buysellView.appendChild(sellForm); 
}


module.exports = showInvestmentInfo;