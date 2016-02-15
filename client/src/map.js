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
    element.style.display = 'none';
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
    var customMapType = new google.maps.StyledMapType([
        {
          stylers: [
          {hue: '#006c00'},
          {gamma: 0.1},
          {weight: 0.5}
          ]
        },
        {
          elementType: 'labels',
          stylers: [
            {color: '#FFFFFF'}
          ]
        },
        {
          featureType: 'water',
          stylers: [{color: '#0F0F0F'}]
        },
        {
          featureType: 'administrative.country',
          stylers: [
            {color: '#FFFFFF'}
          ]
        }
    ], {
      name: 'Custom Style'
    });
    var customMapTypeId = 'custom_style';
    var map = new google.maps.Map(this.element, {
      center: this.latlng,
      zoom: 4,
      mapTypeControlOptions: {
        mapTypeIds: [google.maps.MapTypeId.HYBRID, customMapTypeId]
      }
    });
    map.mapTypes.set(customMapTypeId, customMapType);
    map.setMapTypeId(customMapTypeId);
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
      content: 'stuff'
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
    this.element.style.display = 'block'; 
  },
  hide: function(){
    this.element.style.display = 'none'; 
  },
  changeLocation: function(loc){
    this.location = loc;
    this.latlng = this.getLatLng();
  }
}

module.exports = Map;
