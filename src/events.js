const EventEmitter = require('events');
const nodeCron = require('node-cron');
const OutboxEvent = require('./models/outboxEventModel');

class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

// Add your event listeners here, e.g.:
myEmitter.on('fruit.created', async (fruit) => {
  console.log('fruit created:', fruit);
});

myEmitter.on('fruit.updated', async (fruit) => {
  console.log('fruit updated:', fruit);
});

myEmitter.on('fruit.deleted', async (fruit) => {
  console.log('fruit deleted:', fruit);
});

myEmitter.on('fruit.stored', async (fruit) => {
  console.log('fruit stored:', fruit);
});

myEmitter.on('fruit.removed', async (fruit) => {
  console.log('fruit removed:', fruit);
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
    console.log('Error processing outbox events:', error);
  }
};

// Schedule the outbox events processing
nodeCron.schedule('* * * * *', processOutboxEvents);

module.exports = myEmitter;
