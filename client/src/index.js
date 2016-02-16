var Target = require('./models/target.js')
var Barry;
var getUser = require('./getUser.js');
getUser('Barry Manilow', function(user) {
  Barry = user;
  init();
});

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

var showTargets = function(){
  var targetsArea = document.getElementById('targets')
  targetsArea.innerHTML = '';
  for (var target of Barry.targets) {
    var p = document.createElement('p');
    p.innerText = target.description;
    targetsArea.appendChild(p); 
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
      Barry.save();
    });
  }
}

var init = function(){
  console.log('I have loaded');
  var shareSelect = document.getElementById('shareSelect');
  var portfolioButton = document.getElementById('portfolioView');
  var targetsButton = document.getElementById('targetsButton');
  var portfolioInfo = document.getElementById('portfolioInfo');
  var investmentInfo = document.getElementById('investmentInfo');
  var targetsInfo = document.getElementById('targetsInfo');
  var targetFormButton = document.getElementById('targetFormButton');

  Highcharts.setOptions(chartStyles);

  populateSelect();
  displayCurrentPortfolioValue();
  displayLargestPercChange();
  displayAccountBalance();

  shareSelect.onchange = function(){
    portfolioInfo.style.display = "none";
    targetsInfo.style.display = "none";
    investmentInfo.style.display = "block";
    showInvestmentInfo(shareSelect.value, Barry);
  };
  portfolioButton.onclick = function(){
    investmentInfo.style.display = "none";
    targetsInfo.style.display = "none";
    portfolioInfo.style.display = "block";
    targetsView.innerHTML = "";
    new pieChart(Barry.portfolio);
    new scatterChart();
  }
  targetsButton.onclick = function(){
    portfolioInfo.style.display = "none";
    investmentInfo.style.display = "none";
    targetsInfo.style.display = "block";
    targetsView.innerHTML = "";
    showTargets();
  }
  notificationArea = new NotificationArea();  
  setUpPriceWatchers();
  window.setInterval(function(){
    getLatestShareInfo();
  }, 10000);
  var portfolioTarget = new Target({
    description: 'Get portfolio value to above £65,000',
    object: Barry.portfolio,
    property: 'totalValue',
    check: 'gt',
    target: 6500000,
    checkTime: 10000
  }, function(){
    Barry.targets.splice(Barry.targets.indexOf(portfolioTarget), 1);
    notificationArea.newNotification({
      title: 'Target reached!',
      content: 'You have reached your target of getting your portfolio value to £65,000',
      type: 'success'
    });
  })
  Barry.targets.push(portfolioTarget);
};

//window.onload = init;
