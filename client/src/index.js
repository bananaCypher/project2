var Barry = require('./seedObjects.js');
var scatterChart = require('./charts/scatterChart.js');
var pieChart = require('./charts/pieChart.js');
var chartStyles = require('./charts/chartStyles.js');
var NotificationArea = require('./notification.js');
var showInvestmentInfo = require('./buy_sell.js');
var notificationArea;

var displayLargestPercChange = function(){
  var moreInfo = document.getElementById('moreInfo');
  var p = document.createElement('p');
  var largestPercChangeInvestment = Barry.portfolio.findLargestPercentageChange();
  var largestPercChangeValue = largestPercChangeInvestment.valueChange('percentage');
  p.innerHTML = "<h2>Best performing stock</h2>"
  p.innerHTML += largestPercChangeInvestment.shareName + ": +" + Number(largestPercChangeValue).toLocaleString() + "%";
  moreInfo.appendChild(p);
}

var displayCurrentPortfolioValue = function(){
  var basicInfo = document.getElementById('basicInfo');
  var p = document.createElement('p');
  p.innerHTML = "<h2>Current Total Value</h2>£" + Number(Barry.portfolio.totalValue() / 100).toLocaleString();
  basicInfo.appendChild(p);
}

var displayAccountBalance = function(){
  var balanceInfo = document.getElementById('balanceInfo');
  var p = document.createElement('p');
  p.innerHTML = "<h2>Account Credit</h2>£" + Number(Barry.accountBalance / 100).toLocaleString();
  balanceInfo.appendChild(p);
}

var populateSelect = function(){
  var shareSelect = document.getElementById('shareSelect');
  for(investment of Barry.portfolio.investments){
    var option = document.createElement('option');
    option.innerText = investment.shareName;
    shareSelect.appendChild(option);
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

var getLatestShareInfo = function(){
  var investments = Barry.portfolio.investments;
  for (var investment of investments) {
    var share = investment.share;
    updateShare(share);
  }
}

var setUpPriceWatchers = function(){
  for (var investment of Barry.portfolio.investments) {
    var share = investment.share
    Object.observe(share, function(changes){
      for (var change of changes) {
        if(change.name == 'currentPrice') {
          var share = change.object;
          if (change.oldValue > share.currentPrice) {var type = 'error'} else {var type = 'success'}
          notificationArea.newNotification({
            title: share.epic + ' price changed',
            content: share.epic + ' has changed price from ' + change.oldValue + ' to ' + share.currentPrice,
            type: type
          });
        }
      }
    });
  }
}

var init = function(){
  console.log('I have loaded');
  console.log(Barry);

  var shareSelect = document.getElementById('shareSelect');
  var portfolioButton = document.getElementById('portfolioView');
  var portfolioInfo = document.getElementById('portfolioInfo');
  var investmentInfo = document.getElementById('investmentInfo');
  var targetsView = document.getElementById('targetsView');

  Highcharts.setOptions(chartStyles);

  populateSelect();
  displayCurrentPortfolioValue();
  displayLargestPercChange();
  displayAccountBalance();

  shareSelect.onchange = function(){
    portfolioInfo.style.display = "none";
    investmentInfo.style.display = "block";
    showInvestmentInfo(shareSelect.value, Barry);
  };
  
  portfolioButton.onclick = function(){
    investmentInfo.style.display = "none";
    portfolioInfo.style.display = "block";
    targetsView.innerHTML = "";
    new pieChart(Barry.portfolio);
    new scatterChart();
  }
  notificationArea = new NotificationArea();  
  setUpPriceWatchers();
  window.setInterval(function(){
    getLatestShareInfo();
  }, 10000);
};

window.onload = init;
