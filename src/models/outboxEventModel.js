const mongoose = require('mongoose');

const outboxEventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
  },
  eventData: {
    type: Object,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('OutboxEvent', outboxEventSchema);
