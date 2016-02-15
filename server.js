var express = require('express');
var app = express();
var path = require('path')
var api = require('./api.js');

var User = require('./client/src/models/user.js');
var Portfolio = require('./client/src/models/portfolio.js');
var Investment = require('./client/src/models/investment.js');
var Share = require('./client/src/models/share.js');
var userID = '56c0f16a61c1654319c185ac';
var mongoose = require('mongoose');
var UserModel = require('./client/src/models/mongooseSchema');
mongoose.connect('mongodb://localhost/project2');

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

app.get('/share/:symbol', function(req, res) {
  api.getLatestData(req.params.symbol, function(latestPrice){
    res.send(latestPrice);
  }); 
});

app.get('/user/:id', function(req, res) {
  UserModel.findById(userID, function(err, user){
    if(err){ console.log(err) }
    res.json(user);
  }); 
});

app.use(express.static('client/build'));

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
