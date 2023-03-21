const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Make the name field unique
    
  },
  description: {
    type: String,
    required: true,
    maxlength: 30, // Limit email length to a maximum of 50 characters
  },
  amount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.index({ name: 1 }); // Add an index on the name field

const Fruit = mongoose.model('Fruit', userSchema);

module.exports = Fruit;
