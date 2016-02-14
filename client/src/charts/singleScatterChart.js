var Barry = require('../seedObjects.js')


var SingleScatterChart = function(investment){
  var container = document.getElementById("singleScatterChart");
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
      tickAmount: 7,
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
        color:  'rgba(223, 83, 83, .9)',
        dashStyle: 'ShortDash'
        },
        type: "line",
      name: "Share Price",
      data: [ [1, investment.share.pastCloseOfDayPrices[0]], [2, investment.share.pastCloseOfDayPrices[1]], [3, investment.share.pastCloseOfDayPrices[2]], [4, investment.share.pastCloseOfDayPrices[3]], [5, investment.share.pastCloseOfDayPrices[4]], [6, investment.share.pastCloseOfDayPrices[5]], [7, investment.share.pastCloseOfDayPrices[6]]  ],
    }],

  });
}

module.exports = SingleScatterChart;
