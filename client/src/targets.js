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