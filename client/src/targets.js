var TargetChecker = function(user, investment){
  var targetsView = document.getElementById('targetsView');
  targetsView.innerHTML = "";

  var targetValue = "";
  var targets = user.findTargetsByShareName(investment.shareName);
  for(target of targets){
    if(target.property === "currentValue" && target.check === "gt"){
      targetValue = target.target / 100;
    }
  }

  var p = document.createElement('p');
  p.innerHTML = "Target value for this investment (£): <input type='text' id='targetValue' value='" + targetValue + "''><button id='targetValueButton'>Check</button><br>Price required to meet this target with current share quantity: <span id='targetValuePrice'></span><br><br>Days to hit target if current trend continues: <span id='targetValueDays'></span>";

  targetsView.appendChild(p);

  var button = document.getElementById('targetValueButton');
  button.onclick = function(){
    var input = document.getElementById('targetValue').value;
    if(input === "" || isNaN(input)){
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