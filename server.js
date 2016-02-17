var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path')
var api = require('./api.js');

var User = require('./client/src/models/user.js');
var Portfolio = require('./client/src/models/portfolio.js');
var Investment = require('./client/src/models/investment.js');
var Share = require('./client/src/models/share.js');
var mongoose = require('mongoose');
var UserModel = require('./client/src/models/mongooseSchema');
mongoose.connect('mongodb://localhost/project2');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

app.get('/share/:symbol', function(req, res) {
  api.getLatestData(req.params.symbol, function(latestPrice){
    res.send(latestPrice);
  }); 
});

//persistence
app.get('/user/:name', function(req, res) {
  var query = UserModel.where({ name: req.params.name });
  query.findOne(function(err, user){
    if(err){ console.log(err) }
    res.json(user);
  }); 
});
app.post('/user/:id', function(req, res) {
  UserModel.findByIdAndUpdate(req.params.id, req.body, function(err, user){
    if(err){ console.log(err) }
    console.log(user.name, 'saved!');
    res.send('saved!');
  });
});

app.use(express.static('client/build'));

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
