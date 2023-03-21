const mongoose = require('mongoose');

const fruitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Make the name field unique
    
  },
  description: {
    type: String,
    required: true,
    maxlength: 30, 
  },
  amount: {
    type: Number,
    required: true,
    default:0,
  },
  limit: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

fruitSchema.index({ name: 1 }); // Add an index on the name field

const Fruit = mongoose.model('Fruit', fruitSchema);

module.exports = Fruit;
