var gaugeChart = require('./charts/gaugeChart.js');
var senseChecker = require('./models/senseChecker.js');

module.exports = function(notificationArea, Barry){
  var Target = require('./models/target.js')
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
    var newTarget;
    if (targetFormType.value == 'Portfolio'){
      newTarget = {
        description: description,
        object: Barry.portfolio,
        property: prop,
        check: check,
        target: value * 100,
        checkTime: 10000
      }
    } 
    else if (targetFormType.value == 'Investment') {
      var investmentName = document.getElementById('targetFormObject').value;
      var investment = Barry.portfolio.findByName(investmentName);
      if(prop === "currentValue"){
        value = value * 100;
      }
      newTarget = {
        description: description,
        object: investment,
        property: prop,
        check: check,
        target: value,
        checkTime: 10000
      }
    }
    else if (targetFormType.value == 'Share'){
      var shareName = document.getElementById('targetFormObject').value;
      var share = Barry.portfolio.findByName(shareName).share;
      newTarget = {
        description: description,
        object: share,
        property: prop,
        check: check,
        target: value,
        checkTime: 10000
      }
    }
    
    var currentNewValue = function(){
      if (typeof(newTarget.object[newTarget.property]) == 'function') {
        var value = newTarget.object[newTarget.property]();
      } 
      else {
        var value = newTarget.object[newTarget.property];
      }
      return value;
    }

    if(currentNewValue() >= newTarget.target){
      senseChecker.errorList.push("Error: Target already completed");
      return;
    }

    var target = new Target(newTarget, 
      function(description){
        showTargets();
        notificationArea.newNotification({
          title: 'Target reached!',
          content: 'You have reached your target ' + description,
          type: 'success'
        })
      });


        Barry.targets.push(target);
        showTargets();
        targetFormFields.style.display = 'none';
        targetFormType.selectedIndex = 0;
      
  }

  var showTargets = function(){
    var targetsArea = document.getElementById('targets')
    targetsArea.innerHTML = '';
    for (target of Barry.targets) {
      var li = document.createElement('li');
      if(target.complete == true){
        li.classList.add('completed-target')
      } else {
        li.classList.add('incomplete-target');
      }
      li.innerHTML = target.description;
      var button = document.createElement('button');
      button.innerText = "Show Details";
      li.appendChild(button);

      var addClickEvent = function(target){
        button.addEventListener("click", function(event){
          showTargetDetails(target);
        })
      }
      addClickEvent(target);

      targetsArea.appendChild(li); 
    }
    var div = document.createElement('div');
    div.id = "gaugeChart";
    div.style.height = "200px";
    div.style.display = "none";
    targetsArea.appendChild(div);
  }

  var showTargetDetails = function(target){
    console.log(target);
    var div = document.getElementById('gaugeChart')
    div.className = "chart grid-6";
    div.style.display = "block";
    new gaugeChart(target, div);
  }

  targetFormButton.onclick = submitTargetForm;

  //Create sample targets
  var portfolioTarget = new Target({
    description: 'Get portfolio value to above £70,000',
    object: Barry.portfolio,
    property: 'totalValue',
    check: 'gt',
    target: 7000000,
    checkTime: 10000
  }, function(){
    showTargets();
  })
  Barry.targets.push(portfolioTarget);

  return showTargets;
};

