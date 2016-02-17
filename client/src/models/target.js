// Target accepts an object and a callback to be run when the target has been met e.g.
// var target = new Target({
//  object: myObj, //The object you want the target to be on.
//  property: 'myProperty', //This is the property of the object you want the target to be for, this can be a function as long as it requires no parameters.
//  check: 'gt', //This is the check you want to do gt is greater than, you can also use gte, eq, lt and lte.
//  target: 200, //This is the value you want your target to reach.
//  checkTime: 1000, //The interval you want to check if you have reached your target in ms.
//  description: 'Get myProperty to above 200', //The description you want to give the Target, this will be returned with callback
// }, function(description){ 
//    console.log(description); //The callback function
// });
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
          this.callback(this.description);
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
  currentValue: function(){
    if (typeof(this.object[this.property]) == 'function') {
      var value = this.object[this.property]();
    } else {
      var value = this.object[this.property];
    }
    return value;
  },
  hasMetTarget: function(){
    var property = this.currentValue();
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
