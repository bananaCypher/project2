
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
