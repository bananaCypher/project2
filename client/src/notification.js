var Notification = function(params){
  this.title = params.title || 'Notification';
  this.content = params.content || '';
  this.time = params.time || 10000;
}
