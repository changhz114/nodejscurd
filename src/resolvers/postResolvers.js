const mongoose = require('mongoose');
const Post = require('../models/postModel');
const OutboxEvent = require('../models/outboxEventModel');
const myEmitter = require('../events');

const postResolvers = {
  Query: {
    posts: () => Post.find(),
    post: (_, { id }) => Post.findById(id),
  },
  Mutation: {
    createPost: async (_, { title, content, author }) => {
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        const post = new Post({ title, content, author });
        await post.save({ session });

        const outboxEvent = new OutboxEvent({
          eventName: 'post.created',
          eventData: post,
        });
        await outboxEvent.save({ session });

        await session.commitTransaction();
        return post;
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }
    },
    updatePost: async (_, { id, title, content, author }) => {
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        const post = await Post.findByIdAndUpdate(
          id,
          { title, content, author },
          { new: true, session }
        );

        const outboxEvent = new OutboxEvent({
          eventName: 'post.updated',
          eventData: post,
        });
        await outboxEvent.save({ session });

        await session.commitTransaction();
        return post;
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }
    },
    deletePost: async (_, { id }) => {
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        const post = await Post.findByIdAndDelete(id, { session });

        const outboxEvent = new OutboxEvent({
          eventName: 'post.deleted',
          eventData: post,
        });
        await outboxEvent.save({ session });

        await session.commitTransaction();
        return post;
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }
    },
  },
};

module.exports = postResolvers;
