const mongoose = require('mongoose');

// define the User schema
// Note: minLength and maxLength can be written in lowercase: minlength
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'Please provide name'],
    minLength: 3,
    maxLength: 50,
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide valid email',
    ],
    unique: true, // create a unique index
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minLength: 6,
    maxLength: 12,
  },
});

// create a model from the schema then export it
module.exports = mongoose.model('User', userSchema);
