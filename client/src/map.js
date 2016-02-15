var Map = function(params){
  this.location = params.location;
  this.element = this.setupMapElement();
  this.latlng = this.getLatLng();
  this.map;
  this.marker;
  this.infoWindow;
  Object.observe(this, function(changes){
    for (var change of changes) {
      if (change.name == 'latlng'){
        this.map = this.setupMap();
        this.marker = this.addMarker();
        this.infoWindow = this.addInfoWindow();
      }
    }
  }.bind(this));
}
Map.prototype = {
  setupMapElement: function(){
    var element = document.createElement('div');
    element.id = 'google-map';
    element.classList.add('google-map-container'); 
    document.body.appendChild(element);
    return element;
  },
  getLatLng: function(){
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': this.location }, function(results, status) {
      this.latlng = results[0].geometry.location;
    }.bind(this));
  },
  setupMap: function(){
    var map = new google.maps.Map(this.element, {
      center: this.latlng,
      zoom: 4,
      mapTypeId: google.maps.MapTypeId.HYBRID
    });
    return map;
  },
  addMarker: function(){
    var marker = new google.maps.Marker({
      position: this.latlng,
      map: this.map,
    }); 
    marker.addListener('click', function(){
      this.showInfoWindow();
    }.bind(this));
    this.map.addListener('click', function(){
      this.hideInfoWindow();
    }.bind(this)); 
    return marker
  },
  addInfoWindow: function(){
    var infoWindow = new google.maps.InfoWindow({
      content: '<p>stuff</p'
    }); 
    return infoWindow;
  },
  showInfoWindow: function(){
    this.infoWindow.open(this.map, this.marker); 
  },
  hideInfoWindow: function(){
    this.infoWindow.close(); 
  },
  show: function(){

  },
  hide: function(){

  },
  changeLocation: function(){

  }
}

module.exports = Map;
