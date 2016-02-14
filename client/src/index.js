var Barry = require('./seedObjects.js');
var scatterChart = require('./charts/scatterChart.js');
var singleScatterChart = require('./charts/singleScatterChart.js');
var pieChart = require('./charts/pieChart.js');

var displayLargestPercChange = function(){
  var basicInfo = document.getElementById('basicInfo');
  var p = document.createElement('p');
  var largestPercChangeInvestment = Barry.portfolio.findLargestPercentageChange();
  var largestPercChangeValue = largestPercChangeInvestment.valueChange('percentage');
  p.innerHTML = "<h2>Best performing stock</h2>"
  p.innerHTML += largestPercChangeInvestment.shareName + ": +" + Number(largestPercChangeValue).toLocaleString() + "%";
  basicInfo.appendChild(p);
}

var displayCurrentPortfolioValue = function(){
  var basicInfo = document.getElementById('basicInfo');
  var p = document.createElement('p');
  p.innerHTML = "<h2>Current Total Value</h2>£" + Number(Barry.portfolio.totalValue() / 100).toLocaleString();
  basicInfo.appendChild(p);
}

var showInvestmentInfo = function(inputName){
  var investment = Barry.portfolio.find({shareName: inputName });
  new singleScatterChart(investment);


  var investmentView = document.getElementById('investmentView');
  investmentView.innerHTML = "";

  var info = document.createElement('p');
  info.innerHTML = "<h2>" + investment.shareName + " (" + investment.share.epic + ")</h2><h3>Current Price</h3>" + investment.share.currentPrice + " GBX <h3>Current Value</h3>£" + (investment.currentValue() / 100) + "<br><br>Change in Value Since Bought: " + investment.valueChange("percentage").toFixed(2) + "%<br>Average for Last 7 Days: " + investment.sevenDayAverage().toFixed(2) + " GBX";

  investmentView.appendChild(info); 

}

var populateSelect = function(){
  var shareSelect = document.getElementById('shareSelect');
  for(investment of Barry.portfolio.investments){
    var option = document.createElement('option');
    option.innerText = investment.shareName;
    shareSelect.appendChild(option);
  }
}
var init = function(){
  console.log('I have loaded');
  console.log(Barry);

  var shareSelect = document.getElementById('shareSelect');
  var portfolioButton = document.getElementById('portfolioView');
  var portfolioInfo = document.getElementById('portfolioInfo');
  var investmentInfo = document.getElementById('investmentInfo');

  populateSelect();
  displayCurrentPortfolioValue();
  displayLargestPercChange();
  new scatterChart();
  shareSelect.onchange = function(){
    portfolioInfo.style.display = "none";
    investmentInfo.style.display = "block";
    showInvestmentInfo(shareSelect.value);
  };
  portfolioButton.onclick = function(){
  investmentInfo.style.display = "none";
  new pieChart(Barry.portfolio);
  portfolioInfo.style.display = "block";
  }
  
};

window.onload = init;
