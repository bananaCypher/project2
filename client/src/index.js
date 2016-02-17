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
var chartStyles = require('./charts/chartStyles.js');
var NotificationArea = require('./notification.js');
var senseChecker = require('./models/senseChecker.js');
var timer = {
  time: 10000,
  timer: undefined,
  startPriceUpdating: function(){
    this.timer = setInterval(getLatestShareInfo, this.time);
  },
  stopPriceUpdating: function(){
    console.log('stopping', this.timer);
    clearInterval(this.timer);
  }
};
var showInvestmentInfo = require('./investmentInfo.js')(timer);
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

var getLatestShareInfo = function(){
  var investments = Barry.portfolio.investments;
  for (var investment of investments) {
    var share = investment.share;
    updateShare(share);
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
  });

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
  };

  targetsButton.onclick = function(){
    portfolioInfo.style.display = "none";
    investmentInfo.style.display = "none";
    targetsInfo.style.display = "block";
    targetsView.innerHTML = "";
    showTargets();
  };

  notificationArea = new NotificationArea();  
  require('./targetForm.js')(notificationArea, Barry);
  setUpPriceWatchers();
  timer.startPriceUpdating();
};
