var singleScatterChart = require('./charts/singleScatterChart.js');
var TargetChecker = require('./targets.js');
var index = require('./basicDisplay.js');

module.exports = function(timer){
  var loadInfo = function(investment, user){
    new singleScatterChart(investment);
    var investmentView = document.getElementById('investmentView');
    var buyPreview = document.getElementById('buyPreview');
    var sellPreview = document.getElementById('sellPreview');
    investmentView.innerHTML = "";
    buyPreview.innerHTML = "";
    sellPreview.innerHTML = "";

    if(investment.valueChange("percentage")){
      var value = "Change in Value Since Bought: " + investment.valueChange("percentage").toFixed(2) + "%<br>";
    }
    else {
      var value = ""
    }

    var currentShareValue = (investment.currentValue() / 100).toFixed(2);

    var info = document.createElement('p');
    info.innerHTML = "<h2>" + investment.shareName + " (" + investment.share.epic + ")</h2><h3>Current Price</h3>" + investment.share.currentPrice.toFixed(2) + " GBX <h3>Current Value</h3>£" + Number(currentShareValue).toLocaleString() + "<br><br>" + value + "7 Day Moving Average: " + investment.sevenDayAverage().toFixed(2) + " GBX<br>Quantity Held: " + investment.quantity + "<br>Country: " + investment.share.location;
    investmentView.appendChild(info); 

    index.displayCurrentPortfolioValue(user);
    index.displayAccountBalance(user);

  }

  var TradeForm = function(option, user, investment){

    if(option === "Buy"){
      var inputId = "buyInput";
      var submitId = "buySubmit"
        var placeholder = '"Enter amount"';
    }
    else if(option === "Sell"){
      var inputId = "sellInput";
      var submitId = "sellSubmit";
      var placeholder = '"Enter amount"';
    }
    else if(option === "BuyShort"){
      var inputId = "buyShortInput";
      var submitId = "buyShortSubmit";
      var placeholder = '"Enter amount"';
    }
    else if(option === "SellShort"){
      var inputId = "sellShortInput";
      var submitId = "sellShortSubmit";
      var placeholder = '"Enter amount"';
    }
    else if(option === "CrashStock"){
      var inputId = "crashStockInput";
      var submitId = "crashStockSubmit";
      var placeholder = '"Enter percentage"';
    }
    else if(option === 'PumpStock'){
      var inputId = "pumpStockInput";
      var submitId = "pumpStockSubmit";
      var placeholder = '"Enter percentage"';
    }
    else if(option === "CrashRegion"){
      var inputId = "crashRegionInput";
      var submitId = "crashRegionSubmit";
      var placeholder = '"Enter percentage"';
    } 
    else if(option === 'PumpRegion'){
      var inputId = "pumpRegionInput";
      var submitId = "pumpRegionSubmit";
      var placeholder = '"Enter percentage"';
    }

    var form = document.createElement('form');
    form.innerHTML = "<input type='text' id=" + inputId + " placeholder=" + placeholder + "><input type='submit' id=" + submitId + " value='" + option + " Shares'>";

    form.onsubmit = function(event){
      var value = document.getElementById(inputId).value;
      event.preventDefault();

      if(option === "Buy"){
        user.buyShares(investment.share, parseInt(value), investment);
        user.save();
        loadInfo(investment, user);
      }
      else if(option ==="Sell"){
        user.sellShares(investment, parseInt(value));
        user.save();
        loadInfo(investment, user);
      }
      else if(option === "BuyShort"){
        user.buyShort(investment, parseInt(value));
        user.save();
        loadInfo(investment, user);
        timer.stopPriceUpdating();
      }
      else if(option == "SellShort"){
        user.sellShort(investment.share, parseInt(value), investment);
        user.save();
        loadInfo(investment, user);
        timer.stopPriceUpdating();
      }
      else if(option === "CrashStock"){
        user.spreadRumours(investment.share, parseInt(value));
        user.save();
        loadInfo(investment, user);
        timer.stopPriceUpdating();
      }
      else if(option === "PumpStock"){
        user.pumpStock(investment.share, parseInt(value));
        user.save();
        loadInfo(investment, user);
        timer.stopPriceUpdating();
      }   
      else if(option === "CrashRegion"){
        user.crashRegion(investment.share.location, parseInt(value));
        user.save();
        loadInfo(investment, user);
        timer.stopPriceUpdating();
      }   
      else if(option === "PumpRegion"){
        user.pumpRegion(investment.share.location, parseInt(value));
        user.save();
        loadInfo(investment, user);
        timer.stopPriceUpdating();
      }
    }
    return form;
  }

  var showPreview = function(investment, user){
    var preview = document.getElementById('preview');
    var buyPreview = document.getElementById('buyPreview');
    var sellPreview = document.getElementById('sellPreview');
    var buyAmount = document.getElementById("buyInput").value;
    var sellAmount = document.getElementById("sellInput").value;
    if(buyAmount === ""){
      buyPreview.style.display = "none";
    }
    else {
      var buyValue = parseInt(buyAmount) * investment.share.currentPrice || "";
      buyPreview.style.display = "inline-block";
      buyPreview.innerHTML = "Buy Price: £" + Number(buyValue / 100).toLocaleString();
      if(buyValue > user.accountBalance){
        buyPreview.style.color = "red";
      }
      else {
        buyPreview.style.color = "green";
      }
    }
    if(sellAmount === ""){
      sellPreview.style.display = "none";
    }
    else{
      var sellValue = parseInt(sellAmount) * investment.share.currentPrice || "";
      sellPreview.style.display = "inline-block";
      if (sellAmount <= investment.quantity){
        sellPreview.style.color = "green";
        sellPreview.innerHTML = "<br>Sell Value: £" + Number(sellValue / 100).toLocaleString();
      }
      else{
        sellPreview.style.color = "red";
        sellPreview.innerHTML = "<br>Not enough shares held.";
      }

    }

  }

  var showInvestmentInfo = function(inputName, user){
    var investment = user.portfolio.find({shareName: inputName });
    var buysellView = document.getElementById('buysellView');
    var insideTradesView = document.getElementById('insideTradesView');
    buysellView.innerHTML = "";
    insideTradesView.innerHTML = "";
    insideTradesView.style.display = "none";

    loadInfo(investment, user);

    var buyForm = new TradeForm("Buy", user, investment);
    var sellForm = new TradeForm("Sell", user, investment);
    var sellShortForm = new TradeForm("SellShort", user, investment);
    var buyShortForm = new TradeForm("BuyShort", user, investment);
    var crashStockForm = new TradeForm("CrashStock", user, investment);
    var pumpStockForm = new TradeForm("PumpStock", user, investment);
    var crashRegionForm = new TradeForm("CrashRegion", user, investment);
    var pumpRegionForm = new TradeForm("PumpRegion", user, investment);
    buysellView.appendChild(buyForm); 
    buysellView.appendChild(sellForm); 

    var insideTradesButton = document.createElement('img');
    insideTradesButton.src = "http://www.docurated.com/wp-content/uploads/2014/11/arrow-300x253.png";
    insideTradesButton.style.height = "30px";
    insideTradesButton.onclick = function(){
      insideTradesView.style.display = "block";
    }
    insideTradesButton.ondblclick = function(){
      insideTradesView.style.display = "none";
    }

    buysellView.appendChild(insideTradesButton);

    insideTradesView.appendChild(buyShortForm); 
    insideTradesView.appendChild(sellShortForm); 
    insideTradesView.appendChild(crashStockForm); 
    insideTradesView.appendChild(pumpStockForm); 
    insideTradesView.appendChild(crashRegionForm); 
    insideTradesView.appendChild(pumpRegionForm); 

    new TargetChecker(user, investment);

    document.onkeyup = function(){
      showPreview(investment, user);
    }
  }
  return showInvestmentInfo;
}
