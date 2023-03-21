const mongoose = require('mongoose');
const Fruit = require('../models/fruitModel');
const OutboxEvent = require('../models/outboxEventModel');
const myEmitter = require('../events');
const { description } = require('../schema/typeDefs');
const fruitResolvers = {
  Query: {
    fruits: () => Fruit.find(),
    getFruit: async (_, { id }) => {
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        const fruit = await Fruit.findById(id).session(session);

        const outboxEvent = new OutboxEvent({
          eventName: 'fruit.retrieved',
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
    findFruit: async (_, { name }) => {
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        const fruit = await Fruit.findOne({ name: name }).session(session);
        if (!fruit) {
          await session.commitTransaction();
          return {
            message: "No such fruit",
            fail: true,
            id: "None",
            name: "None",
            description: "None",
            amount: 0,
            limit: 0,
          }
        }
        fruit.fail = false;
        fruit.message = "Success";
        const outboxEvent = new OutboxEvent({
          eventName: 'fruit.found',
          eventData: fruit,
        });
        await outboxEvent.save({ session });

        await session.commitTransaction();
        return fruit;
      } catch (error) {
        // console.log(error.message);
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }
    },

  },
  Mutation: {
    createFruitForFruitStorage: async (_, { name, description, limit }) => {
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        description = description.trim();
        if (description.length > 30) {
          const newFruit = {
            id: "None",
            name: 'None',
            description: "None",
            amount: 0,
            createdAt: Date.now,
            __v: 0,
            limit: 0,
            fail: true,
            message: 'description cannot exceed 30 characters'
          };
          await session.commitTransaction();
          return newFruit;
        }
        const amount = 0;
        const fruit = new Fruit({ name, description, limit, amount });
        await fruit.save({ session });
        const outboxEvent = new OutboxEvent({
          eventName: 'fruit.created',
          eventData: fruit,
        });
        let newFruit = JSON.parse(JSON.stringify(fruit));
        newFruit.id = JSON.stringify(fruit._id);
        await outboxEvent.save({ session });
        await session.commitTransaction();
        newFruit.fail = false;
        newFruit.message = "Successfully added";
        return newFruit;
      } catch (error) {
        // console.log(error.message);
        await session.abortTransaction();
        // Check for duplicate key error
        if (error.code === 11000) {
          // console.log(131);
          const newFruit = {
            id: "None",
            name: 'None',
            description: "None",
            amount: 0,
            createdAt: Date.now,
            __v: 0,
            limit: 0,
            fail: true,
            message: 'duplicate names!'
          };
          // console.log(3);
          // console.log(newFruit);
          // console.log(377);
          return newFruit;
        }
        throw error;
      } finally {
        session.endSession();
      }
    },
    storeFruitToFruitStorage: async (_, { name, amount }) => {
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        const fruit = await Fruit.findOne({ name }).session(session);
        if (fruit) {
          let updatedFruit = await Fruit.findOneAndUpdate(
            { name },
            { amount: fruit.amount + amount },
            { new: true, session }
          );
          if (updatedFruit.amount > updatedFruit.limit) {
            updatedFruit = {
              id: "None",
              name: 'None',
              description: "None",
              amount: 0,
              createdAt: Date.now,
              __v: 0,
              limit: 0,
              fail: true,
              message: 'This will exceed the limit!Operation Aborted!'
            };
            await session.abortTransaction();
            return updatedFruit;
          } else {
            const outboxEvent = new OutboxEvent({
              eventName: 'fruit.stored',
              eventData: updatedFruit,
            });
            await outboxEvent.save({ session });
            updatedFruit.fail = false;
            updatedFruit.message = "Succes added" + " " + amount + " " + fruit.name;
            await session.commitTransaction();
            return updatedFruit;
          }
        } else {
          let updatedFruit = {
            id: "None",
            name: 'None',
            description: "None",
            amount: 0,
            createdAt: Date.now,
            __v: 0,
            limit: 0,
            fail: true,
            message: 'No that knid of fruit!'
          };
          return updatedFruit;
        }
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }
    },

    updateFruitForFruitStorage: async (_, { id, name, description, limit }) => {
      description = description.trim();
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        if (description.length > 30) {
          let fruit = {
            id: "None",
            name: 'None',
            description: "None",
            amount: 0,
            createdAt: Date.now,
            __v: 0,
            limit: 0,
            fail: true,
            message: 'length of description cannot exceed 30 characters'
          };
          return fruit;
        }
        let fruit = await Fruit.findOneAndUpdate(
          { name },
          { description, limit },
          { new: true, session }
        )
        if (fruit) {
          fruit.fail = false;
          const outboxEvent = new OutboxEvent({
            eventName: 'fruit.updated',
            eventData: fruit,
          });
          // console.log(1);
          await outboxEvent.save({ session });
          // console.log(2);

        }
        if (!fruit) {
          fruit = {
            id: "None",
            name: 'None',
            description: "None",
            amount: 0,
            createdAt: Date.now,
            __v: 0,
            limit: 0,
            fail: true,
            message: 'No that kind of fruit'
          };
        }
        await session.commitTransaction();

        return fruit;
      } catch (error) {
        // console.log(error.message);
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }
    },
    removeFruitFromFruitStorage: async (_, { name, amount }) => {
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        const fruit = await Fruit.findOne({ name }).session(session);
        if (fruit) {
          let updatedFruit = await Fruit.findOneAndUpdate(
            { name },
            { amount: fruit.amount - amount },
            { new: true, session }
          );
          if (updatedFruit.amount < 0) {
            updatedFruit = {
              id: "None",
              name: 'None',
              description: "None",
              amount: 0,
              createdAt: Date.now,
              __v: 0,
              limit: 0,
              fail: true,
              message: 'The warehouse do not have such amount'
            };
            await session.abortTransaction();
            return updatedFruit;
          } else {
            const outboxEvent = new OutboxEvent({
              eventName: 'fruit.removed',
              eventData: updatedFruit,
            });
            updatedFruit.fail = false;
            updatedFruit.message = "Succes removed" + " " + amount + " " + fruit.name;
            await session.commitTransaction();
            await outboxEvent.save({ session });
            return updatedFruit;
          }
        } else {
          let updatedFruit = {
            id: "None",
            name: 'None',
            description: "None",
            amount: 0,
            createdAt: Date.now,
            __v: 0,
            limit: 0,
            fail: true,
            message: 'No that knid of fruit!'
          };
          await session.commitTransaction();
          return updatedFruit;
        }
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }
    },
    deleteFruitFromFruitStorage: async (_, { name, forceDelete }) => {
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        const fruit = await Fruit.findOne({ name }).session(session);
        if (fruit) {
          if (forceDelete || fruit.amount == 0) {
            let updatedFruit = JSON.parse(JSON.stringify(fruit));;
            await Fruit.findOneAndDelete({ name }).session(session);
            const outboxEvent = new OutboxEvent({
              eventName: 'fruit.deleted',
              eventData: fruit,
            });
            try {
              await outboxEvent.save({ session });
            }catch(e){
              // console.log(e.message);
            }
            updatedFruit.fail = false;
            updatedFruit.message = forceDelete ? "force deleted fruit" : "Successfully deleted fruit with amount = 0";
            return updatedFruit;
          }
          if (fruit.amount > 0) {
            let updatedFruit = {
              id: "None",
              name: 'None',
              description: "None",
              amount: 0,
              createdAt: Date.now,
              __v: 0,
              limit: 0,
              fail: true,
              message: 'The amount of that fruit > 0,Some of this are still in the warehouse!'
            };
            await session.commitTransaction();
            return updatedFruit;
          }
        } else {
          let updatedFruit = {
            id: "None",
            name: 'None',
            description: "None",
            amount: 0,
            createdAt: Date.now,
            __v: 0,
            limit: 0,
            fail: true,
            message: 'No that knid of fruit!'
          };
          await session.commitTransaction();
          return updatedFruit;
        }

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
