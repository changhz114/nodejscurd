const mongoose = require('mongoose');
const Fruit = require('../models/fruitModel');
const OutboxEvent = require('../models/outboxEventModel');
const myEmitter = require('../events');

const fruitResolvers = {
  Query: {
    fruits: () => Fruit.find(),
    fruit: (_, { id }) => Fruit.findById(id),
  },
  Mutation: {
    createFruit: async (_, { name, description, amount }) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
          const fruit = new Fruit({ name, description, amount });
          await fruit.save({ session });
      
          const outboxEvent = new OutboxEvent({
            eventName: 'fruit.created',
            eventData: fruit,
          });
          await outboxEvent.save({ session });
      
          await session.commitTransaction();
          return fruit;
        } catch (error) {
          await session.abortTransaction();
      
          // Check for duplicate key error
          if (error.code === 11000) {
            throw new Error('Fruit with the provided name already exists');
          }
      
          throw error;
        } finally {
          session.endSession();
        }
      },
      
    updateFruit: async (_, { id, name, description, amount }) => {
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        const fruit = await Fruit.findByIdAndUpdate(
          id,
          { name, description, amount },
          { new: true, session }
        );

        const outboxEvent = new OutboxEvent({
          eventName: 'fruit.updated',
          eventData: fruit,
        });
        await outboxEvent.save({ session });

        await session.commitTransaction();
        return fruit;
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }
    },
    deleteFruit: async (_, { id }) => {
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        const fruit = await Fruit.findByIdAndDelete(id, { session });

        const outboxEvent = new OutboxEvent({
          eventName: 'fruit.deleted',
          eventData: fruit,
        });
        await outboxEvent.save({ session });

        await session.commitTransaction();
        return fruit;
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }
    },
  },
};

module.exports = fruitResolvers;
