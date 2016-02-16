var Barry;
var getUser = require('../getUser.js');
getUser('Barry Manilow', function(user){
  Barry = user;
});

var ScatterChart = function(){
  var container = document.getElementById("scatterChart");

  var lineColor = function(){
    if(Barry.portfolio.pastTotalValue(1) > Barry.portfolio.pastTotalValue(7)) {
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
      text: "7 Day Performance - Total Portfolio Value",
      style: {
        "text-decoration": "underline",
        "font-weight": "700"
      }
    },
    xAxis: {
      title: {
        text: "Previous Week's Days"
      },
      tickAmount: 7,
      tickInterval: 1
    },
    yAxis: {
      title: {
        text: "Total Value (GBP)"
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
      name: "Portfolio",
      data: [ [1, Barry.portfolio.pastTotalValue(7) / 100], [2, Barry.portfolio.pastTotalValue(6) / 100], [3, Barry.portfolio.pastTotalValue(5) / 100], [4, Barry.portfolio.pastTotalValue(4) / 100], [5, Barry.portfolio.pastTotalValue(3) / 100], [6, Barry.portfolio.pastTotalValue(2) / 100], [7, Barry.portfolio.pastTotalValue(1) / 100] ],
    }],

  });
}

module.exports = ScatterChart;
