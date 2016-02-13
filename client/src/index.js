var Barry = require('./seedObjects.js');
var scatterChart = require('./charts/scatterChart.js');
var singleScatterChart = require('./charts/singleScatterChart.js');

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

var init = function(){
  console.log('I have loaded');
  console.log(Barry);
  displayCurrentPortfolioValue();
  displayLargestPercChange();
  new scatterChart();
  new singleScatterChart(Barry.portfolio.investments[1]);
};

window.onload = init;
