var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name:  String,
  accountBalance: Number,
  portfolio: Object
});

var User = mongoose.model('User', userSchema);

module.exports = User;
