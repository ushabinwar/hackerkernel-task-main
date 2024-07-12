const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/hackerkernal");


const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile: String
});

const User = mongoose.model('User', userSchema);
module.exports = User;