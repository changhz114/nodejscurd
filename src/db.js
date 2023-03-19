const mongoose = require('mongoose');

async function connectDb() {
  try {
    await mongoose.connect('mongodb://localhost:27017/mygraphqlapi?replicaSet=rs0', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useFindAndModify: false,
      // useCreateIndex: true,
    });
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection error:', error);
  }
}

module.exports = connectDb;