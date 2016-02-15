var Notification = function(notificationArea, params) {
  this.area = notificationArea;
  this.title = params.title || 'Notification';
  this.content = params.content || '';
  this.type = params.type || 'info';
  this.time = params.time || new Date();
  this.element = this.setupElement();
}
Notification.prototype = {
  setupElement: function(){
    var element = document.createElement('div');
    element.classList.add('notification-' + this.type);
    var title = document.createElement('h2');
    title.innerText = this.title;
    var content = document.createElement('p');
    content.innerText = this.content; 
    element.appendChild(this.setupCloseButton());
    element.appendChild(title);
    element.appendChild(content);
    return element;
  },
  setupCloseButton: function(){
    var button = document.createElement('span');
    button.innerText = 'X'; 
    button.onclick = function(){
      this.destroy();
    }.bind(this);
    return button;
  },
  destroy: function(){
    this.area.container.removeChild(this.element);
    this.area.updateIcon();
  }
}

var NotificationArea = function(){
  this.container = this.setupContainer();
  this.showing = false;
  this.notificationButton = this.setupNotificationButton();
  this.countContainer = this.notificationButton.getElementsByTagName('span')[0];
  this.setupScrolling();
}
NotificationArea.prototype = {
  setupContainer: function(){
    var container = document.createElement('div');
    container.id = 'notification-container';
    document.body.appendChild(container); 
    return container;
  },
  setupNotificationButton: function(){
    var button = document.getElementById('notifications');
    button.onclick = function(){
      if (this.showing == true){
        this.hide();
      } else {
        this.show();
      }
      this.countContainer.className = '';
    }.bind(this);
    return button;
  },
  setupScrolling: function(){
    document.onscroll = function(event){
      var newTop = 53 - window.pageYOffset; //will need changed if header height changes
      if (newTop < 0) {
        newTop = 0;
      }
      var newHeight = screen.height - newTop;
      this.container.style.height = newHeight + 'px';
      this.container.style.top = newTop + 'px';
    }.bind(this);
  },
  newNotification: function(params){
    var notification = new Notification(this, params);
    this.container.appendChild(notification.element);
    this.updateIcon();
  },
  updateIcon: function(){
    var notificationCount = this.container.childNodes.length;
    var prevCount = Number(this.countContainer.innerText);
    if (notificationCount > 0) {
      this.countContainer.innerText = notificationCount;
    } else {
      this.countContainer.innerText = '';
      this.hide();
    }
    if (prevCount < notificationCount && this.showing == false) {
      this.countContainer.className = 'pulse';
    }
  },
  show: function(){
    this.container.className = 'display-notification-container';
    this.showing = true;
  },
  hide: function(){
    this.container.className = 'hide-notification-container';
    this.showing = false;
  }
}

module.exports = NotificationArea;
