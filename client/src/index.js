var Barry = require('./seedObjects.js');
var lineChart = require('./charts/lineChart.js');

var init = function(){
  console.log('I have loaded');

  var basicInfo = document.getElementById('basicInfo');
  console.log(Barry);

  var p = document.createElement('p');
  p.innerHTML = "<h2>Current Total Value</h2>£" + Number(Barry.portfolio.totalValue() / 100).toLocaleString();
  basicInfo.appendChild(p);

  new lineChart();
};


window.onload = init;