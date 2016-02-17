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

	var Target = __webpack_require__(1)
	var Barry;
	var getUser = __webpack_require__(2);
	getUser('Barry Manilow', function(user) {
	  Barry = user;
	  init();
	});
	
	var index = __webpack_require__(8);
	var scatterChart = __webpack_require__(9);
	var pieChart = __webpack_require__(10);
	var chartStyles = __webpack_require__(11);
	var NotificationArea = __webpack_require__(12);
	var senseChecker = __webpack_require__(5);
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
	var showInvestmentInfo = __webpack_require__(13)(timer);
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
	  __webpack_require__(16)(notificationArea, Barry);
	  setUpPriceWatchers();
	  timer.startPriceUpdating();
	};


/***/ },
/* 1 */
/***/ function(module, exports) {

	var Target = function(params, callback){
	  this.object = params.object;
	  this.property = params.property;
	  this.check = params.check;
	  this.target = params.target;
	  this.checkTime = params.checkTime || 1000;
	  this.description = params.description || this.property + ' ' + this.check + ' ' + this.target;
	  this.callback = callback;
	  this.complete = false;
	  this.startingValue;
	  if (typeof(this.object[this.property]) == 'function') {
	    this.startingValue = this.object[this.property]();
	  } else {
	    this.startingValue = this.object[this.property];
	  }
	  this.observeFunction = function(){
	    for (var key in this.object) {
	      if(key == this.property || typeof(this.object[this.property]) == 'function'){
	        var result = this.hasMetTarget();
	        if(result == true){
	          this.complete = true;
	          this.callback();
	          return;
	        } else {
	          this.setupWatcher();
	          return;
	        }
	      } 
	    }
	  }.bind(this);
	  this.observeFunction();
	}
	Target.prototype = {
	  fullCheck: function(){
	    switch(this.check) {
	      case 'gt':
	        return 'greater than';
	        break;
	      case 'gte':
	        return 'greater than or equal to'
	        break;
	      case 'eq':
	        return 'equal to'
	        break;
	      case 'lte':
	        return 'less than or equal to'
	        break;
	      case 'lt':
	        return 'less than'
	        break;
	    }
	  },
	  setupWatcher: function(){
	    setTimeout(this.observeFunction, this.checkTime);
	  },
	  hasMetTarget: function(){
	    if (typeof(this.object[this.property]) == 'function') {
	      var property = this.object[this.property]();
	    } else {
	      var property = this.object[this.property];
	    }
	    switch(this.check) {
	      case 'gt':
	        if(property > this.target){
	          return true;
	        }
	        break;
	      case 'gte':
	        if(property >= this.target){
	          return true;
	        }
	        break;
	      case 'eq':
	        if(property == this.target){
	          return true;
	        }
	        break;
	      case 'lte':
	        if(property <= this.target){
	          return true;
	        }
	        break;
	      case 'lt':
	        if(property < this.target){
	          return true;
	        }
	        break;
	    }
	  }
	}
	
	module.exports = Target;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var User = __webpack_require__(3);
	var Portfolio = __webpack_require__(6);
	var Investment = __webpack_require__(4);
	var Share = __webpack_require__(7);
	var Target = __webpack_require__(1);
	var Barry;
	
	var getUser = function (userName, callback) {
	  var request = new XMLHttpRequest();
	  request.open('GET', '/user/' + userName);
	  request.onload = function(){
	    if (request.status === 200) {
	      data = JSON.parse(request.responseText);
	      Barry = new User(data.name, data._id);
	      Barry.accountBalance = data.accountBalance;
	      Barry.insideTrader = data.insideTrader;
	
	      barryPortfolio = new Portfolio();
	      for (var investment of data.portfolio.investments) {
	        var newShare = new Share({
	          name: investment.share.shareName,
	          epic: investment.share.epic,
	          location: investment.share.location,
	          price: investment.share.currentPrice,
	          pastCloseOfDayPrices: investment.share.pastCloseOfDayPrices
	        }); 
	        var newInvestment = new Investment(newShare, investment);
	        barryPortfolio.investments.push(newInvestment);
	      }
	      Barry.portfolio = barryPortfolio;
	      callback(Barry);
	    }
	  };
	  request.send(null);
	};
	
	module.exports = getUser;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var Investment = __webpack_require__(4);
	var senseChecker = __webpack_require__(5);
	
	var User = function(name, id){
	  this.name = name,
	  this.id = id,
	  this.portfolio = undefined,
	  this.accountBalance = 500000
	    this.targets = [];
	};
	
	User.prototype = {
	  buyShares: function(share, quantity, params){
	    var outlay = share.currentPrice * quantity;
	    if(senseChecker.isShare(share.shareName) && senseChecker.isQuantity(quantity) && senseChecker.maxedAccount(this.accountBalance, outlay)){
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
	    }
	  },
	  sellShares: function(investment, quantity){
	    var outlay = investment.share.currentPrice * quantity;
	    if(senseChecker.isInvestment(investment, this)){    
	      if(investment.quantity >= quantity){
	        investment.quantity -= quantity;
	        this.accountBalance += outlay;
	      }
	      else if(investment.quantity <= quantity){
	        var difference = quantity - investment.quantity
	          senseChecker.errorMessage('10: you are ' + difference + ' shares short');
	      }
	    }
	  },
	  sellShort: function(share, quantity, params){
	    if(senseChecker.isShare(share.shareName)){
	      var outlay = share.currentPrice * quantity;
	      var investment = new Investment(share, params);
	      investment.quantity = quantity;
	      investment.short = true;
	      this.portfolio.addInvestment(investment);
	      this.accountBalance += outlay;
	    }
	  },
	  buyShort: function(investment, quantity){
	    var outlay = investment.share.currentPrice * investment.quantity;
	    if(senseChecker.maxedAccount(this.accountBalance, outlay) && senseChecker.isInvestment(investment, this)){
	      if(!investment.short){
	        senseChecker.errorMessage('9: this investment is not a short sale');
	      }
	      else{
	        if(investment.quantity < quantity){
	          investment.quantity -= quantity;
	        }
	        else{
	          this.portfolio.removeInvestment(investment, this);
	        }
	        this.accountBalance -= outlay;
	      }
	    }
	  },
	  spreadRumours: function(share, percentage){
	    if(senseChecker.isShare(share.shareName)){
	      share.crashValue(percentage);
	    }
	  },
	  pumpStock: function(share, percentage){
	    if(senseChecker.isShare(share.shareName)){
	      share.inflateValue(percentage);
	    }
	  },
	  pumpRegion: function(region, percentage){
	    if(senseChecker.isRegion(region)){
	      for(investment of this.portfolio.investments){
	        var share = investment.share;
	        if(share.location === region){
	          this.pumpStock(share, percentage);
	        }
	      }
	    }
	  },
	  crashRegion: function(region, percentage){
	    if(senseChecker.isRegion(region)){    
	      for(investment of this.portfolio.investments){
	        var share = investment.share;
	        if(share.location === region){
	          this.spreadRumours(share, percentage);
	        }
	      }
	    }
	  },
	
	  save: function(){
	    var request = new XMLHttpRequest();
	    request.open('POST', '/user/' + this.id);
	    request.setRequestHeader('Content-Type', 'application/json');
	    request.send(JSON.stringify(this));
	  },
	  findTargetsByShareName: function(shareName){
	    var targets = [];
	    for (var target of this.targets) {
	      if (target.object.shareName == shareName) {
	        targets.push(target); 
	      } 
	    }
	    return targets;
	  }
	}
	
	module.exports = User;


/***/ },
/* 4 */
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
/* 5 */
/***/ function(module, exports) {

	var senseChecker = {
	  errorList: [],
	  validRegions: ['China', 'UK', 'USA'],
	  validShares: ["Fusionex", "Empiric Student Prop", "Worldpay", "Pets At Home", "Cyprotex", "Robinson", "Softcat", "Royal Bank of Scotland Group", "NCC", "Stadium"],
	  validInvestments: function(user){
	    var investments = user.portfolio.investments;
	    return investments;
	  },
	
	  errorMessage: function(error){
	    var error = 'Error #' + error;
	    var newErrorList = this.errorList;
	    newErrorList.push(error);
	    this.errorList = newErrorList;
	  },
	
	  isShare: function(share){
	    var filtered = this.validShares.filter(function(value){
	      return value === share;
	    });
	    if(filtered.length == 0){
	      this.errorMessage('1: is not a share');
	      return false;
	    }
	    else{
	      return true;
	    }
	  },
	
	  isNotNegative: function(quantity){
	    if(quantity <= 0){
	      this.errorMessage('2: cannot use negative number');
	      return false;
	    }
	    else{
	      return true;
	    }
	  },
	
	  isBelowMax: function(quantity, investment){
	    if(quantity > investment.quantity){
	      return false;
	      this.errorMessage('3: more shares than available');
	    }
	    else{
	      return true;
	    }
	  },
	
	  isInvestment: function(investment, user){
	    var filtered = this.validInvestments(user).filter(function(value){
	      return value === investment;
	    });
	    if(filtered.length == 0){
	      this.errorMessage('4: not an investment');
	      return false;
	    }
	    else{
	      return true;
	    }
	  },
	
	  isRegion:  function(region){
	    var filtered = this.validRegions.filter(function(value){
	      return value === region;
	    });
	    if (filtered.length == 0){
	      this.errorMessage('5: not a region');
	      return false;
	    }
	    else{
	      return true;
	    }
	  },
	
	  isGoodPercentage: function(percentage){
	    if(percentage >= 100){
	      this.errorMessage('6: cannot reduce by 100% or above');
	      return false;
	    }
	    else{
	      return true;
	    }
	  },
	
	  maxedAccount: function(userBalance, spend){
	    if(userBalance < spend){
	      this.errorMessage('7: not enough money');
	      return false;
	    }
	    else{
	      return true;
	    }
	  },
	
	  isQuantity: function(quantity){
	    if((typeof(quantity) != 'number') || (isNaN(quantity))) {
	      this.errorMessage('8: not a number');
	      return false;
	    }
	    else{
	      return true;
	    }
	  }
	}
	
	module.exports = senseChecker;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var senseChecker = __webpack_require__(5);
	
	var Portfolio = function(){
	  this.investments = [];  
	}
	Portfolio.prototype = {
	  addInvestment: function(investment){
	    this.investments.push(investment);
	  },
	  removeInvestment: function(investment, user){
	    if(senseChecker.isInvestment(investment, user)){
	      var index = this.findInvestmentIndex(investment);
	      this.investments.splice(index, 1);
	    }
	  },
	  findInvestmentIndex: function(investmentToFind){
	    arrayLoop:
	    for (var i = 0; i < this.investments.length; i++) {
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
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var senseChecker = __webpack_require__(5);
	
	
	var Share = function(params){
	  this.shareName = params.name;
	  this.epic = params.epic;
	  this.location = params.location;
	  this.currentPrice = params.price;
	  this.pastCloseOfDayPrices = params.pastCloseOfDayPrices;
	};
	
	Share.prototype = {
	  crashValue: function(percentage){
	    if(senseChecker.isGoodPercentage(percentage)){
	      var newPrice = this.currentPrice * ((100 - percentage)/ 100);
	      this.currentPrice = newPrice;
	    }
	  },
	  inflateValue: function(percentage){
	    var newPrice = this.currentPrice * ((100 + percentage) / 100);
	    this.currentPrice = newPrice;
	  }
	};
	
	module.exports = Share;


/***/ },
/* 8 */
/***/ function(module, exports) {

	
	var displayLargestPercChange = function(user){
	  var moreInfo = document.getElementById('moreInfo');
	  var p = document.createElement('p');
	  var largestPercChangeInvestment = user.portfolio.findLargestPercentageChange();
	  var largestPercChangeValue = largestPercChangeInvestment.valueChange('percentage');
	  p.innerHTML = "<h2>Best performing stock</h2>"
	  p.innerHTML += largestPercChangeInvestment.shareName + ": +" + Number(largestPercChangeValue).toLocaleString() + "%";
	  moreInfo.appendChild(p);
	}
	
	var displayCurrentPortfolioValue = function(user){
	  var basicInfo = document.getElementById('basicInfo');
	  basicInfo.innerHTML = "";
	  var p = document.createElement('p');
	  p.innerHTML = "<h2>Current Total Value</h2>£" + Number(user.portfolio.totalValue() / 100).toLocaleString();
	  basicInfo.appendChild(p);
	}
	
	var displayAccountBalance = function(user){
	  var balanceInfo = document.getElementById('balanceInfo');
	  balanceInfo.innerHTML = "";
	  var p = document.createElement('p');
	  p.innerHTML = "<h2>Account Credit</h2>£" + Number(user.accountBalance / 100).toLocaleString();
	  balanceInfo.appendChild(p);
	}
	
	var populateSelect = function(user){
	  var shareSelect = document.getElementById('shareSelect');
	  for(investment of user.portfolio.investments){
	    var option = document.createElement('option');
	    option.innerText = investment.shareName;
	    shareSelect.appendChild(option);
	  }
	}
	
	module.exports = {
	  displayLargestPercChange: displayLargestPercChange,
	  displayAccountBalance: displayAccountBalance,
	  displayCurrentPortfolioValue: displayCurrentPortfolioValue,
	  populateSelect: populateSelect
	}


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var Barry;
	var getUser = __webpack_require__(2);
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


/***/ },
/* 10 */
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
/* 11 */
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
/* 12 */
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
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var singleScatterChart = __webpack_require__(14);
	var TargetChecker = __webpack_require__(15);
	var index = __webpack_require__(8);
	
	module.exports = function(timer){
	  var loadInfo = function(investment, user){
	    new singleScatterChart(investment);
	    var investmentView = document.getElementById('investmentView');
	    var buyPreview = document.getElementById('buyPreview');
	    var sellPreview = document.getElementById('sellPreview');
	    investmentView.innerHTML = "";
	    buyPreview.innerHTML = "";
	    sellPreview.innerHTML = "";
	
	    if(investment.valueChange("percentage")){
	      var value = "Change in Value Since Bought: " + investment.valueChange("percentage").toFixed(2) + "%<br>";
	    }
	    else {
	      var value = ""
	    }
	
	    var currentShareValue = (investment.currentValue() / 100).toFixed(2);
	
	    var info = document.createElement('p');
	    info.innerHTML = "<h2>" + investment.shareName + " (" + investment.share.epic + ")</h2><h3>Current Price</h3>" + investment.share.currentPrice.toFixed(2) + " GBX <h3>Current Value</h3>£" + Number(currentShareValue).toLocaleString() + "<br><br>" + value + "7 Day Moving Average: " + investment.sevenDayAverage().toFixed(2) + " GBX<br>Quantity Held: " + investment.quantity + "<br>Country: " + investment.share.location;
	    investmentView.appendChild(info); 
	
	    index.displayCurrentPortfolioValue(user);
	    index.displayAccountBalance(user);
	
	  }
	
	  var TradeForm = function(option, user, investment){
	
	    if(option === "Buy"){
	      var inputId = "buyInput";
	      var submitId = "buySubmit"
	        var placeholder = '"Enter amount"';
	    }
	    else if(option === "Sell"){
	      var inputId = "sellInput";
	      var submitId = "sellSubmit";
	      var placeholder = '"Enter amount"';
	    }
	    else if(option === "BuyShort"){
	      var inputId = "buyShortInput";
	      var submitId = "buyShortSubmit";
	      var placeholder = '"Enter amount"';
	    }
	    else if(option === "SellShort"){
	      var inputId = "sellShortInput";
	      var submitId = "sellShortSubmit";
	      var placeholder = '"Enter amount"';
	    }
	    else if(option === "CrashStock"){
	      var inputId = "crashStockInput";
	      var submitId = "crashStockSubmit";
	      var placeholder = '"Enter percentage"';
	    }
	    else if(option === 'PumpStock'){
	      var inputId = "pumpStockInput";
	      var submitId = "pumpStockSubmit";
	      var placeholder = '"Enter percentage"';
	    }
	    else if(option === "CrashRegion"){
	      var inputId = "crashRegionInput";
	      var submitId = "crashRegionSubmit";
	      var placeholder = '"Enter percentage"';
	    } 
	    else if(option === 'PumpRegion'){
	      var inputId = "pumpRegionInput";
	      var submitId = "pumpRegionSubmit";
	      var placeholder = '"Enter percentage"';
	    }
	
	    var form = document.createElement('form');
	    form.innerHTML = "<input type='text' id=" + inputId + " placeholder=" + placeholder + "><input type='submit' id=" + submitId + " value='" + option + " Shares'>";
	
	    form.onsubmit = function(event){
	      var value = document.getElementById(inputId).value;
	      event.preventDefault();
	
	      if(option === "Buy"){
	        user.buyShares(investment.share, parseInt(value), investment);
	        user.save();
	        loadInfo(investment, user);
	      }
	      else if(option ==="Sell"){
	        user.sellShares(investment, parseInt(value));
	        user.save();
	        loadInfo(investment, user);
	      }
	      else if(option === "BuyShort"){
	        user.buyShort(investment, parseInt(value));
	        user.save();
	        loadInfo(investment, user);
	        timer.stopPriceUpdating();
	      }
	      else if(option == "SellShort"){
	        user.sellShort(investment.share, parseInt(value), investment);
	        user.save();
	        loadInfo(investment, user);
	        timer.stopPriceUpdating();
	      }
	      else if(option === "CrashStock"){
	        user.spreadRumours(investment.share, parseInt(value));
	        user.save();
	        loadInfo(investment, user);
	        timer.stopPriceUpdating();
	      }
	      else if(option === "PumpStock"){
	        user.pumpStock(investment.share, parseInt(value));
	        user.save();
	        loadInfo(investment, user);
	        timer.stopPriceUpdating();
	      }   
	      else if(option === "CrashRegion"){
	        user.crashRegion(investment.share.location, parseInt(value));
	        user.save();
	        loadInfo(investment, user);
	        timer.stopPriceUpdating();
	      }   
	      else if(option === "PumpRegion"){
	        user.pumpRegion(investment.share.location, parseInt(value));
	        user.save();
	        loadInfo(investment, user);
	        timer.stopPriceUpdating();
	      }
	    }
	    return form;
	  }
	
	  var showPreview = function(investment, user){
	    var preview = document.getElementById('preview');
	    var buyPreview = document.getElementById('buyPreview');
	    var sellPreview = document.getElementById('sellPreview');
	    var buyAmount = document.getElementById("buyInput").value;
	    var sellAmount = document.getElementById("sellInput").value;
	    if(buyAmount === ""){
	      buyPreview.style.display = "none";
	    }
	    else {
	      var buyValue = parseInt(buyAmount) * investment.share.currentPrice || "";
	      buyPreview.style.display = "inline-block";
	      buyPreview.innerHTML = "Buy Price: £" + Number(buyValue / 100).toLocaleString();
	      if(buyValue > user.accountBalance){
	        buyPreview.style.color = "red";
	      }
	      else {
	        buyPreview.style.color = "green";
	      }
	    }
	    if(sellAmount === ""){
	      sellPreview.style.display = "none";
	    }
	    else{
	      var sellValue = parseInt(sellAmount) * investment.share.currentPrice || "";
	      sellPreview.style.display = "inline-block";
	      if (sellAmount <= investment.quantity){
	        sellPreview.style.color = "green";
	        sellPreview.innerHTML = "<br>Sell Value: £" + Number(sellValue / 100).toLocaleString();
	      }
	      else{
	        sellPreview.style.color = "red";
	        sellPreview.innerHTML = "<br>Not enough shares held.";
	      }
	
	    }
	
	  }
	
	  var showInvestmentInfo = function(inputName, user){
	    var investment = user.portfolio.find({shareName: inputName });
	    var buysellView = document.getElementById('buysellView');
	    buysellView.innerHTML = "";
	
	    loadInfo(investment, user);
	
	    var buyForm = new TradeForm("Buy", user, investment);
	    var sellForm = new TradeForm("Sell", user, investment);
	    var sellShortForm = new TradeForm("SellShort", user, investment);
	    var buyShortForm = new TradeForm("BuyShort", user, investment);
	    var crashStockForm = new TradeForm("CrashStock", user, investment);
	    var pumpStockForm = new TradeForm("PumpStock", user, investment);
	    var crashRegionForm = new TradeForm("CrashRegion", user, investment);
	    var pumpRegionForm = new TradeForm("PumpRegion", user, investment);
	    buysellView.appendChild(buyForm); 
	    buysellView.appendChild(sellForm); 
	    buysellView.appendChild(buyShortForm); 
	    buysellView.appendChild(sellShortForm); 
	    buysellView.appendChild(crashStockForm); 
	    buysellView.appendChild(pumpStockForm); 
	    buysellView.appendChild(crashRegionForm); 
	    buysellView.appendChild(pumpRegionForm); 
	
	    new TargetChecker(user, investment);
	
	    document.onkeyup = function(){
	      showPreview(investment, user);
	    }
	  }
	  return showInvestmentInfo;
	}


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	//var Barry = require('../seedObjects.js')
	var Barry;
	var getUser = __webpack_require__(2);
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


/***/ },
/* 15 */
/***/ function(module, exports) {

	var TargetChecker = function(user, investment){
	  var targetsView = document.getElementById('targetsView');
	  targetsView.innerHTML = "";
	
	  var p = document.createElement('p');
	  p.innerHTML = "Target value for this investment (£): <input type='text' id='targetValue'><button id='targetValueButton'>Check</button><br>Price required to meet this target with current share quantity: <span id='targetValuePrice'></span><br><br>Days to hit target if current trend continues: <span id='targetValueDays'></span>";
	
	  targetsView.appendChild(p);
	
	  var button = document.getElementById('targetValueButton');
	  button.onclick = function(){
	    var input = document.getElementById('targetValue').value;
	    if(input === "" || isNan(input)){
	      return;
	    }
	    input = parseInt(input) * 100;
	
	    var calcPrice = function(){
	      var price = input / investment.quantity;
	      return price.toFixed(2);
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

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function(notificationArea, Barry){
	  var Target = __webpack_require__(1)
	  var targetsView = document.getElementById('targetsView');
	  var targetsInfo = document.getElementById('targetsInfo');
	  var targetFormButton = document.getElementById('targetFormButton');
	  var targetFormType = document.getElementById('targetFormType');
	  var targetFormFields = document.getElementById('targetFormFields');
	
	  var showFormForPortfolio = function(){
	    var label = document.getElementById('targetFormLabel'); 
	    var select = document.getElementById('targetFormObject');
	    var propSelect = document.getElementById('targetFormProp');
	    select.innerHTML = '';
	    propSelect.innerHTML = '';
	    label.innerText = 'Portfolio';
	    var option = document.createElement('option');
	    option.innerText = 'My Portfolio';
	    select.appendChild(option);
	    var propOption = document.createElement('option');
	    propOption.innerText = 'Total value';
	    propOption.value = 'totalValue';
	    propSelect.appendChild(propOption);
	  }
	  var showFormForInvestment = function(){
	    var label = document.getElementById('targetFormLabel'); 
	    var select = document.getElementById('targetFormObject');
	    var propSelect = document.getElementById('targetFormProp');
	    select.innerHTML = '';
	    propSelect.innerHTML = '';
	    label.innerText = 'Investment';
	    for (var investment of Barry.portfolio.investments) {
	      var option = document.createElement('option');
	      option.value = investment.shareName;
	      option.innerText = investment.shareName;
	      select.appendChild(option);
	    }
	    var propOption = document.createElement('option');
	    propOption.innerText = 'Current value';
	    propOption.value = 'currentValue';
	    propSelect.appendChild(propOption);
	    var propOption = document.createElement('option');
	    propOption.innerText = 'Seven day average';
	    propOption.value = 'sevenDayAverage';
	    propSelect.appendChild(propOption);
	  }
	  var showFormForShare = function(){
	    var label = document.getElementById('targetFormLabel'); 
	    var select = document.getElementById('targetFormObject');
	    var propSelect = document.getElementById('targetFormProp');
	    select.innerHTML = '';
	    propSelect.innerHTML = '';
	    label.innerText = 'Share';
	    for (var investment of Barry.portfolio.investments) {
	      var option = document.createElement('option');
	      option.value = investment.share.shareName;
	      option.innerText = investment.share.shareName;
	      select.appendChild(option);
	    }
	    var propOption = document.createElement('option');
	    propOption.innerText = 'Current price';
	    propOption.value = 'currentPrice';
	    propSelect.appendChild(propOption);
	  }
	
	  targetFormType.onchange = function(){
	    if (this.value == 'Portfolio'){
	      targetFormFields.style.display = 'block';
	      showFormForPortfolio();
	    } else if (this.value == 'Investment'){
	      targetFormFields.style.display = 'block';
	      showFormForInvestment();
	    } else if (this.value == 'Share') {
	      targetFormFields.style.display = 'block';
	      showFormForShare();
	    } else {
	      targetFormFields.style.display = 'none';
	    }
	  }
	
	  var submitTargetForm = function(){
	    var value = document.getElementById('targetFormValue').value;
	    var check = document.getElementById('targetFormCheck').value;
	    var description = document.getElementById('targetFormDescription').value;
	    var prop = document.getElementById('targetFormProp').value;
	    var target;
	    if (targetFormType.value == 'Portfolio'){
	      target = new Target({
	        description: description,
	        object: Barry.portfolio,
	        property: prop,
	        check: check,
	        target: value,
	        checkTime: 10000
	      }, function(){
	        showTargets();
	        notificationArea.newNotification({
	          title: 'Target reached!',
	          content: 'You have reached your target ' + description,
	          type: 'success'
	        });
	      })
	      Barry.targets.push(target);
	      showTargets();
	    } else if (targetFormType.value == 'Investment') {
	      var investmentName = document.getElementById('targetFormObject').value;
	      var investment = Barry.portfolio.findByName(investmentName);
	      target = new Target({
	        description: description,
	        object: investment,
	        property: prop,
	        check: check,
	        target: value,
	        checkTime: 10000
	      }, function(){
	        showTargets();
	        notificationArea.newNotification({
	          title: 'Target reached!',
	          content: 'You have reached your target ' + description,
	          type: 'success'
	        });
	      })
	      Barry.targets.push(target);
	      showTargets();
	    } else if (targetFormType.value == 'Share'){
	      var shareName = document.getElementById('targetFormObject').value;
	      var share = Barry.portfolio.findByName(shareName).share;
	      target = new Target({
	        description: description,
	        object: investment,
	        property: prop,
	        check: check,
	        target: value,
	        checkTime: 10000
	      }, function(){
	        showTargets();
	        notificationArea.newNotification({
	          title: 'Target reached!',
	          content: 'You have reached your target ' + description,
	          type: 'success'
	        });
	      })
	      Barry.targets.push(target);
	      showTargets();
	    }
	    targetFormFields.style.display = 'none';
	    targetFormType.selectedIndex = 0;
	  }
	
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
	
	  targetFormButton.onclick = submitTargetForm;
	
	  //Create sample targets
	  var portfolioTarget = new Target({
	    description: 'Get portfolio value to above £65,000',
	    object: Barry.portfolio,
	    property: 'totalValue',
	    check: 'gt',
	    target: 6500000,
	    checkTime: 10000
	  }, function(){
	    showTargets();
	  })
	  Barry.targets.push(portfolioTarget);
	  var portfolioTarget = new Target({
	    description: 'Get portfolio value to above £100,000',
	    object: Barry.portfolio,
	    property: 'totalValue',
	    check: 'gt',
	    target: 10000000,
	    checkTime: 10000
	  }, function(){
	    showTargets();
	    notificationArea.newNotification({
	      title: 'Target reached!',
	      content: 'You have reached your target of getting your portfolio value to £100,000',
	      type: 'success'
	    });
	  })
	  Barry.targets.push(portfolioTarget);
	};


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map