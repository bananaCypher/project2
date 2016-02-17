var Target = function(params, callback){
  this.object = params.object;
  this.property = params.property;
  this.check = params.check;
  this.target = params.target;
  this.checkTime = params.checkTime || 1000;
  this.description = params.description || this.property + ' ' + this.check + ' ' + this.target;
  this.callback = callback;
  this.complete = false;
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
