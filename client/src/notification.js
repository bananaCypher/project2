var Notification = function(params){
  this.title = params.title || 'Notification';
  this.content = params.content || '';
  this.type = params.type || 'info';
  this.time = params.time || 10000;
  this.element = document.createElement('div');
  this.element.classList.add('notification-' + this.type);
  this.element.innerHTML += '<h2>' + this.title + '</h2>'
  this.element.innerHTML += '<p>' + this.content + '</p>' 
  this.closeButton = document.createElement('span');
  this.closeButton.innerText = 'X'; 
  this.element.appendChild(this.closeButton);
  this.closeButton.onclick = function(){
    this.hide();
  }.bind(this);
}
Notification.prototype = {
  show: function(){
    var container = document.getElementById('notification-container');
    if (!container) {
      var container = document.createElement('div');
      container.id = 'notification-container';
      document.body.appendChild(container); 
    }
    container.appendChild(this.element)
    setTimeout(function() {
      this.hide();
    }.bind(this), this.time);
  },
  hide: function(){
    var container = document.getElementById('notification-container');
    if (!container) {
      var container = document.createElement('div');
      container.id = 'notification-container';
      document.body.appendChild(container); 
    }
    container.removeChild(this.element);
  }
}
module.exports = Notification;
