//var Barry = require('../seedObjects.js')
var Barry;
var getUser = require('../getUser.js');
getUser('Barry Manilow', function(user){
  Barry = user;
});


var SingleScatterChart = function(investment){
  var container = document.getElementById("singleScatterChart");

  var lineColor = function(){
    if(investment.share.currentPrice > investment.share.pastCloseOfDayPrices[0]) {
      return  "rgb(110,216,84)"
      }
    else { 
      return'rgba(223, 83, 83, .9)'
    }
  }

  var chart = new Highcharts.Chart({
    chart: {
      type: 'scatter',
      renderTo: container
    },
    title: {
      text: "7 Day Performance - " + investment.shareName,
      style: {
        "text-decoration": "underline",
        "font-weight": "700"
      }
    },
    xAxis: {
      title: {
        text: "Previous Week's Days"
      },
      tickAmount: 8,
      tickInterval: 1
    },
    yAxis: {
      title: {
        text: "Value of Share (GBX)"
      }
    },
    series: [{
      regression: true ,
      regressionSettings: {
        type: 'linear',
        color:  lineColor(),
        dashStyle: 'ShortDash',
        name: "Line of Best Fit"
        },
        type: "line",
      name: "Value of Share",
      data: [ [1, investment.share.pastCloseOfDayPrices[0]], [2, investment.share.pastCloseOfDayPrices[1]], [3, investment.share.pastCloseOfDayPrices[2]], [4, investment.share.pastCloseOfDayPrices[3]], [5, investment.share.pastCloseOfDayPrices[4]], [6, investment.share.pastCloseOfDayPrices[5]], [7, investment.share.pastCloseOfDayPrices[6]], [8, investment.share.currentPrice] ],
    }],

  });
}

module.exports = SingleScatterChart;
