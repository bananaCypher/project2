var Target = function(params, callback){
  this.object = params.object,
  this.property = params.property,
  this.check = params.check,
  this.target = params.target
  this.callback = callback;
  this.observeFunction = function(){
    for (var key in this.object) {
      if(key == this.property || typeof(this.object[this.property]) == 'function'){
        var result = this.hasMetTarget();
        if(result == true){
          this.callback();
          return;
        } else {
          this.setupWatcher();
        }
      } 
    }
  }.bind(this);
  this.setupWatcher();
}
Target.prototype = {
  setupWatcher: function(){
    setTimeout(this.observeFunction, 500);
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
