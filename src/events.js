const EventEmitter = require('events');
const nodeCron = require('node-cron');
const OutboxEvent = require('./models/outboxEventModel');

class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

// Add your event listeners here, e.g.:
myEmitter.on('user.created', async (user) => {
  console.log('User created:', user);
});

myEmitter.on('user.updated', async (user) => {
  console.log('User updated:', user);
});

myEmitter.on('user.deleted', async (user) => {
  console.log('User deleted:', user);
});

// Process events from the outbox collection
const processOutboxEvents = async () => {
  try {
    const events = await OutboxEvent.find().sort({ createdAt: 1 });

    for (const event of events) {
      myEmitter.emit(event.eventName, event.eventData);
      await OutboxEvent.findByIdAndDelete(event._id);
    }
  } catch (error) {
    console.error('Error processing outbox events:', error);
  }
};

// Schedule the outbox events processing
nodeCron.schedule('* * * * *', processOutboxEvents);

module.exports = myEmitter;
