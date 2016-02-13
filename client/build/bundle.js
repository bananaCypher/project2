/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Barry = __webpack_require__(1);
	var scatterChart = __webpack_require__(6);
	var singleScatterChart = __webpack_require__(7);
	var pieChart = __webpack_require__(8);
	
	var displayLargestPercChange = function(){
	  var basicInfo = document.getElementById('basicInfo');
	  var p = document.createElement('p');
	  var largestPercChangeInvestment = Barry.portfolio.findLargestPercentageChange();
	  var largestPercChangeValue = largestPercChangeInvestment.valueChange('percentage');
	  p.innerHTML = "<h2>Largest percentage stock change</h2>"
	  p.innerHTML += largestPercChangeInvestment.shareName + ": " + Number(largestPercChangeValue).toLocaleString() + "%";
	  basicInfo.appendChild(p);
	}
	
	var displayCurrentPortfolioValue = function(){
	  var basicInfo = document.getElementById('basicInfo');
	  var p = document.createElement('p');
	  p.innerHTML = "<h2>Current Total Value</h2>£" + Number(Barry.portfolio.totalValue() / 100).toLocaleString();
	  basicInfo.appendChild(p);
	}
	
	var showSharePerformanceChart = function(inputName){
	  var investment = Barry.portfolio.find({shareName: inputName });
	  new singleScatterChart(investment);
	}
	
	var populateSelect = function(){
	  var sharePerformanceSelect = document.getElementById('sharePerformanceSelect');
	  for(investment of Barry.portfolio.investments){
	    var option = document.createElement('option');
	    option.innerText = investment.shareName;
	    sharePerformanceSelect.appendChild(option);
	  }
	}
	var init = function(){
	  console.log('I have loaded');
	  console.log(Barry);
	
	  var sharePerformanceSelect = document.getElementById('sharePerformanceSelect');
	
	  populateSelect();
	  displayCurrentPortfolioValue();
	  displayLargestPercChange();
	  new scatterChart();
	  sharePerformanceSelect.onchange = function(){
	    showSharePerformanceChart(sharePerformanceSelect.value);
	  };
	  new pieChart(Barry.portfolio);
	  
	};
	
	window.onload = init;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var User = __webpack_require__(2);
	var Portfolio = __webpack_require__(4);
	var Investment = __webpack_require__(3);
	var Share = __webpack_require__(5);
	var investmentsSample = [
	{
	  "name": "Fusionex",
	  "epic":"FXI",
	  "location": "USA",
	  "price": 120.00,
	  "quantity": 2000,
	  "buyPrice": 80.00,
	  "pastCloseOfDayPrices": [92.00, 89.00, 103.00, 125.00, 108.00, 98.00, 110.00],
	  "buyDate":"2014-11-15"
	},
	{
	  "name": "Empiric Student Prop",
	  "epic":"ESP",
	  "location": "UK",
	  "price": 112.00,
	  "quantity": 3500,
	  "buyPrice": 100.00,
	  "pastCloseOfDayPrices": [90.00, 78.50, 82.50, 110.00, 109.00, 109.00, 110.50],
	  "buyDate":"2013-10-23"
	},
	{
	  "name": "Worldpay",
	  "epic":"WGP",
	  "location": "China",
	  "price": 301.00,
	  "quantity": 1000,
	  "buyPrice": 209.40,
	  "pastCloseOfDayPrices": [232.60, 220.00, 222.00, 221.60, 240.00, 238.00, 235.40],
	  "buyDate":"2015-12-22"
	},
	{
	  "name": "Pets At Home",
	  "epic":"PETS",
	  "location": "USA",
	  "price": 247.40,
	  "quantity": 2500,
	  "buyPrice": 250.50,
	  "pastCloseOfDayPrices": [230.00, 232.30, 235.90, 236.60, 237.00, 240.00, 242.70],
	  "buyDate":"2014-08-23"
	},
	{
	  "name": "Cyprotex",
	  "epic":"CRX",
	  "location": "UK",
	  "price": 87.00,
	  "quantity": 5000,
	  "buyPrice": 90.00,
	  "pastCloseOfDayPrices": [92.00, 91.00, 91.50, 92.10, 92.70, 91.00, 88.70],
	  "buyDate":"2015-01-11"
	},
	{
	  "name": "Robinson",
	  "epic":"RBN",
	  "location": "China",
	  "price": 202.00,
	  "quantity": 5000,
	  "buyPrice": 80.50,
	  "pastCloseOfDayPrices": [201.00, 200.50, 200.00, 202.30, 202.40, 202.10, 203.00],
	  "buyDate":"2014-04-10"
	},
	{
	  "name": "Softcat",
	  "epic":"SCT",
	  "location": "USA",
	  "price": 322.90,
	  "quantity": 2000,
	  "buyPrice": 420.00,
	  "pastCloseOfDayPrices": [324.40, 325.10, 323.90, 323.40, 323.10, 323.00, 322.20],
	  "buyDate":"2015-02-18"
	},
	{
	  "name": "Royal Bank of Scotland Group",
	  "epic":"RBS",
	  "location": "UK",
	  "price": 233.00,
	  "quantity": 8000,
	  "buyPrice": 790.00,
	  "pastCloseOfDayPrices": [228.00, 229.10, 228.10, 229.70, 230.90, 231.10, 231.40],
	  "buyDate":"2016-01-15"
	},
	{
	  "name": "NCC",
	  "epic":"NCC",
	  "location": "USA",
	  "price": 279.00,
	  "quantity": 2000,
	  "buyPrice": 500.00,
	  "pastCloseOfDayPrices": [279.10, 285.00, 285.20, 286.00, 286.00, 285.20, 280.00],
	  "buyDate":"2014-11-15"
	},
	{
	  "name": "Stadium",
	  "epic":"SDM",
	  "location": "China",
	  "price": 116.90,
	  "quantity": 5000,
	  "buyPrice": 9.00,
	  "pastCloseOfDayPrices": [115.00, 115.00, 115.50, 115.90, 116.30, 116.40, 116.80],
	  "buyDate":"2014-04-04"
	}
	];
	
	var Barry = new User("Barry Manilow");
	var barryPortfolio = new Portfolio();
	var newShareArray = [];
	var newInvestmentArray = [];
	
	
	for(share of investmentsSample){
	  var newShare = new Share(share);
	  newShareArray.push(newShare);
	};
	
	for (var i = 0; i < investmentsSample.length; i++) {
	  var investment = new Investment(newShareArray[i], investmentsSample[i]);
	  newInvestmentArray.push(investment);
	};
	
	for(investment of newInvestmentArray){
	  barryPortfolio.investments.push(investment);
	};
	
	Barry.portfolio = barryPortfolio;
	
	module.exports = Barry;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Investment = __webpack_require__(3)
	
	var User = function(name){
	  this.name = name,
	  this.portfolio = undefined,
	  this.accountBalance = 500,
	  this.insideTrader = false
	};
	
	User.prototype = {
	  buyShares: function(share, quantity, params){
	    var outlay = share.currentPrice * quantity;
	    var investment = new Investment(share, params);
	    investment.quantity = quantity
	    this.portfolio.addInvestment(investment);
	    this.accountBalance -= outlay;
	  },
	  sellShares: function(investment){
	    var outlay = investment.share.currentPrice * investment.quantity;
	    this.portfolio.removeInvestment(investment);
	    this.accountBalance += outlay;
	  },
	  sellShort: function(share, quantity, params){
	    var outlay = share.currentPrice * quantity;
	    var investment = new Investment(share, params);
	    investment.quantity = quantity;
	    investment.short = true;
	    this.portfolio.addInvestment(investment);
	    this.accountBalance += outlay;
	  },
	  buyShort: function(investment){
	    if(!investment.short){
	      console.log('this action is illegal!');
	    }
	    else{
	      var outlay = investment.share.currentPrice * investment.quantity;
	      this.portfolio.removeInvestment(investment);
	      this.accountBalance -= outlay;
	    }
	  },
	  spreadRumours: function(investment, percentage){
	    if(!this.insideTrader){
	      console.log('this action is illegal!');
	    }
	    else{
	      investment.crashValue(percentage);
	    }
	  },
	  pumpStock: function(investment, percentage){
	    if(!this.insideTrader){
	      console.log('this action is illegal!');
	    }
	    else{
	      investment.inflateValue(percentage);
	    }
	  }
	}
	
	module.exports = User;

/***/ },
/* 3 */
/***/ function(module, exports) {

	var Investment = function(share, params){
	  this.share = share;
	  this.shareName = share.shareName;
	  this.quantity = params.quantity;
	  this.buyPrice = params.buyPrice;
	  this.buyDate = params.buyDate;
	  this.short = false;
	};
	
	Investment.prototype = {
	  currentValue: function(){
	    return this.share.currentPrice * this.quantity;
	  },
	  buyDateValue: function(){
	    return this.buyPrice * this.quantity;
	  },
	  valueChange: function(measurement){
	    var priceChange = this.currentValue() - this.buyDateValue();
	    if(measurement === "price"){
	      return priceChange;
	    }
	    else if(measurement === "percentage"){
	      return (priceChange / this.buyDateValue()) * 100;
	    }
	  },
	  sevenDayAverage: function(){
	    var total = 0;
	    for(price of this.share.pastCloseOfDayPrices){
	      total += price;
	    }
	    return total / 7;
	  },
	};
	
	module.exports = Investment;

/***/ },
/* 4 */
/***/ function(module, exports) {

	var Portfolio = function(){
	  this.investments = [];  
	}
	Portfolio.prototype = {
	  addInvestment: function(investment){
	    this.investments.push(investment);
	  },
	
	  removeInvestment: function(investment){
	    var index = this.findInvestmentIndex(investment);
	    this.investments.splice(index, 1);
	  },
	  findInvestmentIndex: function(investmentToFind){
	    arrayLoop:
	    for (var i = 0, len = this.investments.length; i < len; i++) {
	     var investment = this.investments[i];
	      for (var key in investmentToFind) {
	        if (investmentToFind[key] != investment[key]) {
	          continue arrayLoop;
	        }
	      } 
	      for (var key in investment) {
	        if (investmentToFind[key] != investment[key]) {
	          continue arrayLoop;
	        }
	      } 
	      return i;
	    }
	  },
	  totalValue: function(){
	    var sum = 0;
	    for (var investment of this.investments) {
	      sum += investment.currentValue();
	    }
	    return sum;
	  },
	  pastTotalValue: function(day){
	    var sum = 0;
	    for(var investment of this.investments) {
	      var dayTotal = investment.quantity * investment.share.pastCloseOfDayPrices[7 - day];
	      sum += dayTotal;
	    }
	    return sum;
	  },
	  find: function(search){
	    // accepts an object where the key is the search field and the value is the search term
	    // e.g. find({name: 'My Investment'});
	    arrayLoop:
	    for (var investment of this.investments) {
	      for (var key in search){
	        if (investment.share[key] != search[key]) {
	          continue arrayLoop;
	        }
	      }   
	      return investment;
	    }
	  },
	  findByName: function(name){
	    return this.find({shareName: name})
	  },
	  findByEpic: function(epic){
	    return this.find({epic: epic})
	  },
	  largestInvestment: function(){
	    var largest = this.investments[0];
	    for (var investment of this.investments) {
	      if (investment.currentValue() > largest.currentValue()) { 
	        largest = investment;
	      }
	    }
	    return largest; 
	  },
	  findLargestChange: function(measurement){
	    var highestInvestment = this.investments[0];
	    for (investment of this.investments) {
	      if(investment.valueChange(measurement) > highestInvestment.valueChange(measurement)){
	        highestInvestment = investment;
	      }
	    }
	    return highestInvestment;
	  },
	  findLargestPriceChange: function(){
	    return this.findLargestChange('price');
	  },
	  findLargestPercentageChange: function(){
	    return this.findLargestChange('percentage');
	  }
	};
	
	module.exports = Portfolio;


/***/ },
/* 5 */
/***/ function(module, exports) {

	var Share = function(params){
	  this.shareName = params.name;
	  this.epic = params.epic;
	  this.currentPrice = params.price;
	  this.pastCloseOfDayPrices = params.pastCloseOfDayPrices;
	  this.location = params.location;
	};
	
	Share.prototype = {
	  crashValue: function(percentage){
	    if(percentage >= 100){
	      console.log('cannot reduce a shareprice below zero');
	    }
	    else{
	      var newPrice = this.currentPrice * ((100 - percentage)/ 100);
	      this.currentPrice = newPrice;
	    }
	  },
	  inflateValue: function(percentage){
	    var newPrice = this.currentPrice * ((100 + percentage) / 100);
	    this.currentPrice = newPrice;
	  }
	}
	
	module.exports = Share;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Barry = __webpack_require__(1)
	
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


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var Barry = __webpack_require__(1)
	
	
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
	      name: "Portfolio",
	      data: [ [1, investment.share.pastCloseOfDayPrices[0]], [2, investment.share.pastCloseOfDayPrices[1]], [3, investment.share.pastCloseOfDayPrices[2]], [4, investment.share.pastCloseOfDayPrices[3]], [5, investment.share.pastCloseOfDayPrices[4]], [6, investment.share.pastCloseOfDayPrices[5]], [7, investment.share.pastCloseOfDayPrices[6]]  ],
	    }],
	
	  });
	}
	
	module.exports = SingleScatterChart;


/***/ },
/* 8 */
/***/ function(module, exports) {

	
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
	      style: {
	        "color": "rebeccapurple",
	        "text-decoration": "underline",
	        "font-weight": "700"
	      }
	    },
	    series: [{
	      name: "Investment",
	      data: investmentData,
	    }],
	
	  });
	}
	
	module.exports = PieChart;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map