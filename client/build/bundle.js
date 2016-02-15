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
	var pieChart = __webpack_require__(7);
	var chartStyles = __webpack_require__(8);
	var NotificationArea = __webpack_require__(9);
	var showInvestmentInfo = __webpack_require__(10);
	var notificationArea;
	
	var displayLargestPercChange = function(){
	  var moreInfo = document.getElementById('moreInfo');
	  var p = document.createElement('p');
	  var largestPercChangeInvestment = Barry.portfolio.findLargestPercentageChange();
	  var largestPercChangeValue = largestPercChangeInvestment.valueChange('percentage');
	  p.innerHTML = "<h2>Best performing stock</h2>"
	  p.innerHTML += largestPercChangeInvestment.shareName + ": +" + Number(largestPercChangeValue).toLocaleString() + "%";
	  moreInfo.appendChild(p);
	}
	
	var displayCurrentPortfolioValue = function(){
	  var basicInfo = document.getElementById('basicInfo');
	  var p = document.createElement('p');
	  p.innerHTML = "<h2>Current Total Value</h2>£" + Number(Barry.portfolio.totalValue() / 100).toLocaleString();
	  basicInfo.appendChild(p);
	}
	
	var displayAccountBalance = function(){
	  var balanceInfo = document.getElementById('balanceInfo');
	  var p = document.createElement('p');
	  p.innerHTML = "<h2>Account Credit</h2>£" + Number(Barry.accountBalance).toLocaleString();
	  balanceInfo.appendChild(p);
	}
	
	var populateSelect = function(){
	  var shareSelect = document.getElementById('shareSelect');
	  for(investment of Barry.portfolio.investments){
	    var option = document.createElement('option');
	    option.innerText = investment.shareName;
	    shareSelect.appendChild(option);
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
	    });
	  }
	}
	
	var init = function(){
	  console.log('I have loaded');
	  console.log(Barry);
	
	  var shareSelect = document.getElementById('shareSelect');
	  var portfolioButton = document.getElementById('portfolioView');
	  var portfolioInfo = document.getElementById('portfolioInfo');
	  var investmentInfo = document.getElementById('investmentInfo');
	
	  Highcharts.setOptions(chartStyles);
	
	  populateSelect();
	  displayCurrentPortfolioValue();
	  displayLargestPercChange();
	  displayAccountBalance();
	
	  shareSelect.onchange = function(){
	    portfolioInfo.style.display = "none";
	    investmentInfo.style.display = "block";
	    showInvestmentInfo(shareSelect.value, Barry);
	  };
	  portfolioButton.onclick = function(){
	    investmentInfo.style.display = "none";
	    portfolioInfo.style.display = "block"
	    new pieChart(Barry.portfolio);
	    new scatterChart();
	  }
	  notificationArea = new NotificationArea();  
	  setUpPriceWatchers();
	  window.setInterval(function(){
	    getLatestShareInfo();
	  }, 10000);
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
	  "epic":"WPG",
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
	  this.accountBalance = 5000,
	  this.insideTrader = false
	};
	
	User.prototype = {
	  buyShares: function(share, quantity, params){
	    var outlay = share.currentPrice * quantity;
	
	    if(this.portfolio.find({shareName: share.shareName})){
	      var investment = this.portfolio.find({shareName: share.shareName})
	      investment.quantity += quantity;
	    }
	    else {
	      var investment = new Investment(share, params);
	      investment.quantity = quantity;
	      investment.buyPrice = share.currentPrice;
	      this.portfolio.addInvestment(investment);
	    }
	    this.accountBalance -= outlay;
	  },
	  sellShares: function(investment, quantity){
	    var outlay = investment.share.currentPrice * quantity;
	    console.log(outlay);
	    if(investment.quantity >= quantity){
	      investment.quantity -= quantity;
	    }
	    else {
	      this.portfolio.removeInvestment(investment);
	    }
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
	  spreadRumours: function(share, percentage){
	    if(!this.insideTrader){
	      var hypotheticalPrice = share.currentPrice * ((100 - percentage) / 100);
	      return hypotheticalPrice;
	    }
	    else{
	      share.crashValue(percentage);
	    }
	  },
	  pumpStock: function(share, percentage){
	    if(!this.insideTrader){
	      var hypotheticalPrice = share.currentPrice * ((100 + percentage) / 100);
	      return hypotheticalPrice;
	    }
	    else{
	      share.inflateValue(percentage);
	    }
	  },
	  pumpRegion: function(region, percentage){
	    for(investment of this.portfolio.investments){
	      var share = investment.share;
	      if(share.location === region){
	        this.pumpStock(share, percentage);
	      }
	    }
	  },
	  crashRegion: function(region, percentage){
	    for(investment of this.portfolio.investments){
	      var share = investment.share;
	      if(share.location === region){
	        this.spreadRumours(share, percentage);
	      }
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
	totalValueOfRegion: function(region){
	  var sum = 0;
	  for(var investment of this.investments){
	    if(investment.share.location === region){
	      var total = investment.quantity * investment.share.currentPrice;
	      sum += total;
	    }
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
	  this.location = params.location;
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

	var Barry = __webpack_require__(1);
	
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


/***/ },
/* 7 */
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
	    },
	    series: [{
	      name: "Investment",
	      data: investmentData,
	    }],
	
	  });
	}
	
	module.exports = PieChart;

/***/ },
/* 8 */
/***/ function(module, exports) {

	  var chartStyles = {
	    colors: ["#2b908f", "#90ee7e", "#f45b5b", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
	      "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
	    chart: {
	      backgroundColor: {
	        linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
	        stops: [
	          [0, '#2a2a2b'],
	          [1, '#3e3e40']
	        ]
	      },
	      style: {
	        fontFamily: "'Unica One', sans-serif",
	        textTransform: 'uppercase',
	      },
	      plotBorderColor: '#606063'
	    },
	    title: {
	      style: {
	        color: '#E0E0E3',
	        textTransform: 'uppercase',
	        fontSize: '20px'
	      }
	    },
	    subtitle: {
	      style: {
	        color: '#E0E0E3',
	        textTransform: 'uppercase'
	      }
	    },
	    xAxis: {
	      gridLineColor: '#707073',
	      labels: {
	        style: {
	          color: '#E0E0E3'
	        }
	      },
	      lineColor: '#707073',
	      minorGridLineColor: '#505053',
	      tickColor: '#707073',
	      title: {
	        style: {
	          color: '#A0A0A3'
	
	        }
	      }
	    },
	    yAxis: {
	      gridLineColor: '#707073',
	      labels: {
	        style: {
	          color: '#E0E0E3'
	        }
	      },
	      lineColor: '#707073',
	      minorGridLineColor: '#505053',
	      tickColor: '#707073',
	      tickWidth: 1,
	      title: {
	        style: {
	          color: '#A0A0A3'
	        }
	      }
	    },
	    tooltip: {
	      backgroundColor: 'rgba(0, 0, 0, 0.85)',
	      style: {
	        color: '#F0F0F0'
	      }
	    },
	    plotOptions: {
	      series: {
	        dataLabels: {
	          color: '#B0B0B3'
	        },
	        marker: {
	          lineColor: '#333'
	        },
	        color: "#FAFA98"
	      },
	      boxplot: {
	        fillColor: '#505053'
	      },
	      candlestick: {
	        lineColor: 'white'
	      },
	      errorbar: {
	        color: 'white'
	      }
	    },
	    legend: {
	      itemStyle: {
	        color: '#E0E0E3'
	      },
	      itemHoverStyle: {
	        color: '#FFF'
	      },
	      itemHiddenStyle: {
	        color: '#606063'
	      }
	    },
	    credits: {
	      style: {
	        color: '#666'
	      }
	    },
	    labels: {
	      style: {
	        color: '#707073'
	      }
	    },
	
	    drilldown: {
	      activeAxisLabelStyle: {
	        color: '#F0F0F3'
	      },
	      activeDataLabelStyle: {
	        color: '#F0F0F3'
	      }
	    },
	
	    navigation: {
	      buttonOptions: {
	        symbolStroke: '#DDDDDD',
	        theme: {
	          fill: '#505053'
	        }
	      }
	    },
	
	    // scroll charts
	    rangeSelector: {
	      buttonTheme: {
	        fill: '#505053',
	        stroke: '#000000',
	        style: {
	          color: '#CCC'
	        },
	        states: {
	          hover: {
	            fill: '#707073',
	            stroke: '#000000',
	            style: {
	              color: 'white'
	            }
	          },
	          select: {
	            fill: '#000003',
	            stroke: '#000000',
	            style: {
	              color: 'white'
	            }
	          }
	        }
	      },
	      inputBoxBorderColor: '#505053',
	      inputStyle: {
	        backgroundColor: '#333',
	        color: 'silver'
	      },
	      labelStyle: {
	        color: 'silver'
	      }
	    },
	
	    navigator: {
	      handles: {
	        backgroundColor: '#666',
	        borderColor: '#AAA'
	      },
	      outlineColor: '#CCC',
	      maskFill: 'rgba(255,255,255,0.1)',
	      series: {
	        color: '#7798BF',
	        lineColor: '#A6C7ED'
	      },
	      xAxis: {
	        gridLineColor: '#505053'
	      }
	    },
	
	    scrollbar: {
	      barBackgroundColor: '#808083',
	      barBorderColor: '#808083',
	      buttonArrowColor: '#CCC',
	      buttonBackgroundColor: '#606063',
	      buttonBorderColor: '#606063',
	      rifleColor: '#FFF',
	      trackBackgroundColor: '#404043',
	      trackBorderColor: '#404043'
	    },
	
	    // special colors for some of the
	    legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
	    background2: '#505053',
	    dataLabelsColor: '#B0B0B3',
	    textColor: '#C0C0C0',
	    contrastTextColor: '#F0F0F3',
	    maskColor: 'rgba(255,255,255,0.3)'
	}
	
	
	module.exports = chartStyles;

/***/ },
/* 9 */
/***/ function(module, exports) {

	var Notification = function(notificationArea, params) {
	  this.area = notificationArea;
	  this.title = params.title || 'Notification';
	  this.content = params.content || '';
	  this.type = params.type || 'info';
	  this.time = params.time || new Date();
	  this.element = this.setupElement();
	}
	Notification.prototype = {
	  setupElement: function(){
	    var element = document.createElement('div');
	    element.classList.add('notification-' + this.type);
	    var title = document.createElement('h2');
	    title.innerText = this.title;
	    var content = document.createElement('p');
	    content.innerText = this.content; 
	    element.appendChild(this.setupCloseButton());
	    element.appendChild(title);
	    element.appendChild(content);
	    return element;
	  },
	  setupCloseButton: function(){
	    var button = document.createElement('span');
	    button.innerText = 'X'; 
	    button.onclick = function(){
	      this.destroy();
	    }.bind(this);
	    return button;
	  },
	  destroy: function(){
	    this.area.container.removeChild(this.element);
	    this.area.updateIcon();
	  }
	}
	
	var NotificationArea = function(){
	  this.container = this.setupContainer();
	  this.showing = false;
	  this.notificationButton = this.setupNotificationButton();
	  this.countContainer = this.notificationButton.getElementsByTagName('span')[0];
	  this.setupScrolling();
	}
	NotificationArea.prototype = {
	  setupContainer: function(){
	    var container = document.createElement('div');
	    container.id = 'notification-container';
	    document.body.appendChild(container); 
	    return container;
	  },
	  setupNotificationButton: function(){
	    var button = document.getElementById('notifications');
	    button.onclick = function(){
	      if (this.showing == true){
	        this.hide();
	      } else {
	        this.show();
	      }
	      this.countContainer.className = '';
	    }.bind(this);
	    return button;
	  },
	  setupScrolling: function(){
	    document.onscroll = function(event){
	      var newTop = 53 - window.pageYOffset; //will need changed if header height changes
	      if (newTop < 0) {
	        newTop = 0;
	      }
	      var newHeight = screen.height - newTop;
	      this.container.style.height = newHeight + 'px';
	      this.container.style.top = newTop + 'px';
	    }.bind(this);
	  },
	  newNotification: function(params){
	    var notification = new Notification(this, params);
	    this.container.appendChild(notification.element);
	    this.updateIcon();
	  },
	  updateIcon: function(){
	    var notificationCount = this.container.childNodes.length;
	    var prevCount = Number(this.countContainer.innerText);
	    if (notificationCount > 0) {
	      this.countContainer.innerText = notificationCount;
	    } else {
	      this.countContainer.innerText = '';
	      this.hide();
	    }
	    if (prevCount < notificationCount && this.showing == false) {
	      this.countContainer.className = 'pulse';
	    }
	  },
	  show: function(){
	    this.container.className = 'display-notification-container';
	    this.showing = true;
	  },
	  hide: function(){
	    this.container.className = 'hide-notification-container';
	    this.showing = false;
	  }
	}
	
	module.exports = NotificationArea;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var singleScatterChart = __webpack_require__(11);
	var TargetChecker = __webpack_require__(12);
	
	var loadInfo = function(investment, user){
	  new singleScatterChart(investment);
	  var investmentView = document.getElementById('investmentView');
	  investmentView.innerHTML = "";
	
	  if(investment.valueChange("percentage")){
	    var value = "Change in Value Since Bought: " + investment.valueChange("percentage").toFixed(2) + "%<br>";
	  }
	  else {
	    var value = ""
	  }
	  var info = document.createElement('p');
	  info.innerHTML = "<h2>" + investment.shareName + " (" + investment.share.epic + ")</h2><h3>Current Price</h3>" + investment.share.currentPrice + " GBX <h3>Current Value</h3>£" + Number(investment.currentValue() / 100).toLocaleString() + "<br><br>" + value + "Average for Last 7 Days: " + investment.sevenDayAverage().toFixed(2) + " GBX<br>Quantity Held: " + investment.quantity;
	
	  investmentView.appendChild(info); 
	
	  var basicInfo = document.getElementById('basicInfo');
	  basicInfo.innerHTML = "";
	  var p = document.createElement('p');
	  p.innerHTML = "<h2>Current Total Value</h2>£" + Number(user.portfolio.totalValue() / 100).toLocaleString();
	  basicInfo.appendChild(p);
	
	  var balanceInfo = document.getElementById('balanceInfo');
	  balanceInfo.innerHTML = "";
	  var p = document.createElement('p');
	  p.innerHTML = "<h2>Account Credit</h2>£" + Number(user.accountBalance).toLocaleString();
	  balanceInfo.appendChild(p);
	
	}
	
	var TradeForm = function(option, user, investment){
	
	  if(option === "Buy"){
	    var inputId = "buyInput";
	    var submitId = "buySubmit";
	  }
	  else if(option === "Sell"){
	    var inputId = "sellInput";
	    var submitId = "sellSubmit";
	  }
	
	  var form = document.createElement('form');
	  form.innerHTML = "<input type='text' id=" + inputId + " placeholder='Enter Amount'><input type='submit' id=" + submitId + " value='" + option + " Shares'>";
	
	  form.onsubmit = function(event){
	    var value = document.getElementById(inputId).value;
	    event.preventDefault();
	    console.log("form submit", value);
	
	    if(option === "Buy"){
	      user.buyShares(investment.share, parseInt(value), investment);
	      loadInfo(investment, user);
	    }
	    else if(option ==="Sell"){
	      user.sellShares(investment, parseInt(value)) 
	      loadInfo(investment, user);
	    }
	  }  
	  return form;
	}
	
	var showInvestmentInfo = function(inputName, user){
	  var investment = user.portfolio.find({shareName: inputName });
	  var buysellView = document.getElementById('buysellView');
	  buysellView.innerHTML = "";
	
	  loadInfo(investment, user);
	
	  var buyForm = new TradeForm("Buy", user, investment);
	  var sellForm = new TradeForm("Sell", user, investment);
	
	  buysellView.appendChild(buyForm); 
	  buysellView.appendChild(sellForm); 
	
	  new TargetChecker(user, investment);
	}
	
	
	module.exports = showInvestmentInfo;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var Barry = __webpack_require__(1)
	
	
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


/***/ },
/* 12 */
/***/ function(module, exports) {

	var TargetChecker = function(user, investment){
	  var targetsView = document.getElementById('targetsView');
	  targetsView.innerHTML = "";
	
	  var p = document.createElement('p');
	  p.innerHTML = "Target value for this investment (£): <input type='text' id='targetValue'><button id='targetValueButton'>Check</button><br>Price required to meet this target with current share quantity: <span id='targetValuePrice'></span><br><br>Days to hit target if current growth continues: <span id='targetValueDays'></span>";
	
	  targetsView.appendChild(p);
	
	  var button = document.getElementById('targetValueButton');
	
	  button.onclick = function(){
	    var input = document.getElementById('targetValue').value;
	    if(input === ""){
	      return;
	    }
	    input = parseInt(input) * 100;
	    console.log(input);
	
	    var calcPrice = function(){
	      return input / investment.quantity;
	    }
	    var calcDays = function(){
	      if(parseInt(input) <= investment.currentValue()){
	        return "Investment already meets this value!"
	      }
	      else {
	        var difference = parseInt(input) - investment.currentValue();
	        var averageIncrease = (investment.currentValue() - (investment.share.pastCloseOfDayPrices[0] * investment.quantity)) / 8;
	        console.log(investment.share.pastCloseOfDayPrices[0] * investment.quantity)
	        var days = difference / averageIncrease;
	        if(days < 0){
	          return "Investment value is currently decreasing."
	        }
	        return Math.ceil(days);
	      }
	    }
	
	    var spanPrice = document.getElementById('targetValuePrice');
	    spanPrice.innerText = calcPrice() + " GBX";
	    var spanDays = document.getElementById('targetValueDays');
	    spanDays.innerText = calcDays();
	  }
	
	
	}
	
	module.exports = TargetChecker;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map