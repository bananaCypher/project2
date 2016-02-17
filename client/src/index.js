var Target = require('./models/target.js')
var Barry;
var getUser = require('./getUser.js');
getUser('Barry Manilow', function(user) {
  Barry = user;
  init();
});

var index = require('./basicDisplay.js');
var scatterChart = require('./charts/scatterChart.js');
var pieChart = require('./charts/pieChart.js');
var gaugeChart = require('./charts/gaugeChart.js');
var chartStyles = require('./charts/chartStyles.js');
var NotificationArea = require('./notification.js');
var senseChecker = require('./models/senseChecker.js');
var showInvestmentInfo = require('./investmentInfo.js');
var notificationArea;


var showTargets = function(){
  var targetsArea = document.getElementById('targets')
  targetsArea.innerHTML = '';
  for (var target of Barry.targets) {
    var li = document.createElement('li');
    if(target.complete == true){
      li.classList.add('completed-target')
    } else {
      li.classList.add('incomplete-target');
    }
    li.innerText = target.description;
    targetsArea.appendChild(li); 
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

  var errorList = document.getElementById('errorNotifications');
  var errorImage = document.getElementById('errorImage');

  errorImage.onclick = function(){
    errorList.style.width = "295px";
    errorList.firstChild.style.display = "inline-block";
    errorImage.style.display = "none"
    setTimeout(function(){
     errorList.style.width = "0"; 
     errorList.firstChild.style.display = "none"; 
   }, 4000)
  }

// ERRORLIST POPULATION

  Object.observe(senseChecker.errorList, function(changes){
    
        errorList.innerHTML = '';
        errorImage.style.display = "inline-block";
        var li = document.createElement('li');
        li.innerText = senseChecker.errorList[senseChecker.errorList.length - 1];
        errorList.appendChild(li);
        }
    );

  var targetsView = document.getElementById('targetsView');
  var targetsInfo = document.getElementById('targetsInfo');
  var targetFormButton = document.getElementById('targetFormButton');

  Highcharts.setOptions(chartStyles);

  index.populateSelect(Barry);
  index.displayCurrentPortfolioValue(Barry);
  index.displayLargestPercChange(Barry);
  index.displayAccountBalance(Barry);

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
    new gaugeChart();
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
  //Create Targets
  var portfolioTarget = new Target({
    description: 'Get portfolio value to above £65,000',
    object: Barry.portfolio,
    property: 'totalValue',
    check: 'gt',
    target: 6500000,
    checkTime: 10000
  }, function(){
    showTargets();
    notificationArea.newNotification({
      title: 'Target reached!',
      content: 'You have reached your target of getting your portfolio value to £65,000',
      type: 'success'
    });
  })
  Barry.targets.push(portfolioTarget);
  var portfolioTarget = new Target({
    description: 'Get portfolio value to above £100,000',
    object: Barry.portfolio,
    property: 'totalValue',
    check: 'gt',
    target: 10000000,
    checkTime: 10000
  }, function(){
    showTargets();
    notificationArea.newNotification({
      title: 'Target reached!',
      content: 'You have reached your target of getting your portfolio value to £100,000',
      type: 'success'
    });
  })
  Barry.targets.push(portfolioTarget);
};

//window.onload = init;
