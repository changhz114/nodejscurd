const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema/typeDefs');
const resolvers = require('./resolvers');
const connectDb = require('./db');

const server = new ApolloServer({ typeDefs, resolvers });

async function start() {
  await connectDb();
  const { url } = await server.listen();
  console.log(`🚀 Server ready at ${url}`);
}

start();
