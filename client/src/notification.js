var Notification = function(notificationArea, params) {
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
    this.destroy();
  }.bind(this);
  this.area = notificationArea;
}
Notification.prototype = {
  destroy: function(){
    this.area.container.removeChild(this.element);
    this.area.updateIcon();
  }
}

var NotificationArea = function(){
  this.container = document.createElement('div');
  this.container.id = 'notification-container';
  document.body.appendChild(this.container); 
  this.notificationButton = document.getElementById('notifications');
  this.notificationButton.onclick = function(){
    if (this.container.className == 'display-notification-container'){
      this.container.className = 'hide-notification-container';
    } else {
      this.container.className = 'display-notification-container';
    }
  }.bind(this);
  document.onscroll = function(event){
    var newTop = 96 - window.pageYOffset;
    if (newTop < 0) {
      newTop = 0;
    }
    var newHeight = screen.height - newTop;
    this.container.style.height = newHeight + 'px';
    this.container.style.top = newTop + 'px';
  }.bind(this);
}
NotificationArea.prototype = {
  newNotification: function(params){
    var notification = new Notification(this, params);
    this.container.appendChild(notification.element);
    this.updateIcon();
  },
  updateIcon: function(){
    var notificationCount = this.container.childNodes.length;
    var countView = this.notificationButton.getElementsByTagName('span')[0];
    if (notificationCount > 0) {
      countView.innerText = notificationCount;
    } else {
      countView.innerText = '';
      this.container.className = 'hide-notification-container';
    }
  }
}

module.exports = NotificationArea;
