var Barry = require('./seedObjects.js');
var scatterChart = require('./charts/scatterChart.js');
var singleScatterChart = require('./charts/singleScatterChart.js');
var pieChart = require('./charts/pieChart.js');

var displayLargestPercChange = function(){
  var basicInfo = document.getElementById('basicInfo');
  var p = document.createElement('p');
  var largestPercChangeInvestment = Barry.portfolio.findLargestPercentageChange();
  var largestPercChangeValue = largestPercChangeInvestment.valueChange('percentage');
  p.innerHTML = "<h2>Largest percentage stock change</h2>"
  p.innerHTML += largestPercChangeInvestment.shareName + ": " + Number(largestPercChangeValue).toLocaleString() + "%";
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

  var info = document.createElement('p');
  info.innerHTML = "<h2>" + investment.shareName + "</h2><h3>Current Price</h3>" + investment.share.currentPrice;

  var investmentInfo = document.getElementById('investmentInfo');

  investmentInfo.appendChild(info); 

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

  populateSelect();
  displayCurrentPortfolioValue();
  displayLargestPercChange();
  new scatterChart();
  shareSelect.onchange = function(){
    showInvestmentInfo(shareSelect.value);
  };
  new pieChart(Barry.portfolio);
  
};

window.onload = init;
