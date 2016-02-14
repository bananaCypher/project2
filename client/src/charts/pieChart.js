
var PieChart = function(portfolio){
  var container = document.getElementById("pieChart");
  var investmentData = []

  for(investment of portfolio.investments){
    var dataItem = {
    name: investment.share.epic,
    y: investment.currentValue(),
    }
    investmentData.push(dataItem);
  }
  var chart = new Highcharts.Chart({
    chart: {
      type: 'pie',
      renderTo: container
    },
    title: {
      text: "Investments as proportion of total portfolio value",
    },
    series: [{
      name: "Investment",
      data: investmentData,
    }],

  });
}

module.exports = PieChart;