const fruitResolvers = require('./fruitResolvers');

const resolvers = {
  Query: {
    ...fruitResolvers.Query,
  },
  Mutation: {
    ...fruitResolvers.Mutation,
  },
};

module.exports = resolvers;