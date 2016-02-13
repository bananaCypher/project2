var Barry = require('../seedObjects.js')

var LineChart = function(){
  var container = document.getElementById("lineChart");
  var chart = new Highcharts.Chart({
    chart: {
      type: 'line',
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
      categories: ["1", "2", "3", "4", "5", "6", "7"]
    },
    yAxis: {
      title: {
        text: "Total Value"
      }
    },
    series: [{
      name: "Portfolio",
      data: [ Barry.portfolio.pastTotalValue(7) / 100, Barry.portfolio.pastTotalValue(6) / 100, Barry.portfolio.pastTotalValue(5) / 100, Barry.portfolio.pastTotalValue(4) / 100, Barry.portfolio.pastTotalValue(3) / 100, Barry.portfolio.pastTotalValue(2) / 100, Barry.portfolio.pastTotalValue(1) / 100 ],
    }],

  });
}

module.exports = LineChart;