var senseChecker = function(){
this.validRegions = ['China', 'UK', 'USA'];


isRegion: function(region){
  var filtered = this.validRegions.filter(function(value){
    return value === region;
  })
  if (filtered.length == 0){
  return false;
}
else{
  return true;
}

  }
}

}