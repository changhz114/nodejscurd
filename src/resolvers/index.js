const userResolvers = require('./userResolvers');
const postResolvers = require('./postResolvers');

const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...postResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postResolvers.Mutation,
  },
};

module.exports = resolvers;