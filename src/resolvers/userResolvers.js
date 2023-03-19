const mongoose = require('mongoose');
const User = require('../models/userModel');
const OutboxEvent = require('../models/outboxEventModel');
const myEmitter = require('../events');

const userResolvers = {
  Query: {
    users: () => User.find(),
    user: (_, { id }) => User.findById(id),
  },
  Mutation: {
    createUser: async (_, { name, email, age }) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
          const user = new User({ name, email, age });
          await user.save({ session });
      
          const outboxEvent = new OutboxEvent({
            eventName: 'user.created',
            eventData: user,
          });
          await outboxEvent.save({ session });
      
          await session.commitTransaction();
          return user;
        } catch (error) {
          await session.abortTransaction();
      
          // Check for duplicate key error
          if (error.code === 11000) {
            throw new Error('User with the provided name already exists');
          }
      
          throw error;
        } finally {
          session.endSession();
        }
      },
      
    updateUser: async (_, { id, name, email, age }) => {
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        const user = await User.findByIdAndUpdate(
          id,
          { name, email, age },
          { new: true, session }
        );

        const outboxEvent = new OutboxEvent({
          eventName: 'user.updated',
          eventData: user,
        });
        await outboxEvent.save({ session });

        await session.commitTransaction();
        return user;
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }
    },
    deleteUser: async (_, { id }) => {
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        const user = await User.findByIdAndDelete(id, { session });

        const outboxEvent = new OutboxEvent({
          eventName: 'user.deleted',
          eventData: user,
        });
        await outboxEvent.save({ session });

        await session.commitTransaction();
        return user;
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }
    },
  },
};

module.exports = userResolvers;
