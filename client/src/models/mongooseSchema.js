var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name:  String,
  accountBalance: Number,
  portfolio: Object,
  insideTrader: Boolean
});

var User = mongoose.model('User', userSchema);

module.exports = User;
