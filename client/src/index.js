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

var showSharePerformanceChart = function(inputName){
  var investment = Barry.portfolio.find({shareName: inputName });
  new singleScatterChart(investment);
}

var populateSelect = function(){
  var sharePerformanceSelect = document.getElementById('sharePerformanceSelect');
  for(investment of Barry.portfolio.investments){
    var option = document.createElement('option');
    option.innerText = investment.shareName;
    sharePerformanceSelect.appendChild(option);
  }
}

var updateShare = function(share){
  var request = new XMLHttpRequest();
  request.open('GET', '/share/' + share.epic);
  request.onload = function(){
    if (request.status === 200) {
      var newPrice = Number(request.responseText);
      if (newPrice != share.currentPrice) {
        share.currentPrice = newPrice;
      }
    }
  };
  request.send(null);
}

var init = function(){
  console.log('I have loaded');
  console.log(Barry);

  var sharePerformanceSelect = document.getElementById('sharePerformanceSelect');

  populateSelect();
  displayCurrentPortfolioValue();
  displayLargestPercChange();
  new scatterChart();
  sharePerformanceSelect.onchange = function(){
    showSharePerformanceChart(sharePerformanceSelect.value);
  };
  new pieChart(Barry.portfolio);

  window.setInterval(function(){
    var sharePerformanceSelect = document.getElementById('sharePerformanceSelect');
    var investment = Barry.portfolio.find({shareName: sharePerformanceSelect.value});
    if (investment) { 
      var share = investment.share;
      updateShare(share);
      Object.observe(share, function(){
        console.log("price change on", share.epic); 
        showSharePerformanceChart(sharePerformanceSelect.value);
      })
    };
  }, 10000);
};

window.onload = init;
