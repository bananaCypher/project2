var Barry = require('../seedObjects.js')

var ScatterChart = function(){
  var container = document.getElementById("scatterChart");
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
    
    },
    yAxis: {
      title: {
        text: "Total Value"
      }
    },
    series: [{
      regression: true ,
      regressionSettings: {
        type: 'linear',
        color:  'rgba(223, 83, 83, .9)',
        dashStyle: 'ShortDash'
        },
        type: "line",
      name: "Portfolio",
      data: [ [1, Barry.portfolio.pastTotalValue(7) / 100], [2, Barry.portfolio.pastTotalValue(6) / 100], [3, Barry.portfolio.pastTotalValue(5) / 100], [4, Barry.portfolio.pastTotalValue(4) / 100], [5, Barry.portfolio.pastTotalValue(3) / 100], [6, Barry.portfolio.pastTotalValue(2) / 100], [7, Barry.portfolio.pastTotalValue(1) / 100] ],
    }],

  });
}

module.exports = ScatterChart;
