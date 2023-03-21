const { createTestClient } = require('apollo-server-testing');
const { ApolloServer, gql } = require('apollo-server-express');
const typeDefs = require('../src/schema/typeDefs');
const resolvers = require('../src/resolvers');
const connectDb = require('../src/db');
const mongoose = require('mongoose');

const server = new ApolloServer({
    typeDefs,
    resolvers,
});
const { query, mutate } = createTestClient(server);
beforeAll(async () => {
    await connectDb();
});

afterAll(async () => {
    await mongoose.connection.close();
});

jest.setTimeout(30000);

describe('createFruitForFruitStorage', () => {
    it('should create a new fruit', async () => {
        const CREATE_FRUIT_FOR_FRUIT_STORAGE = gql`
      mutation createFruitForFruitStorage($name: String!, $description: String, $limit: Int!) {
        createFruitForFruitStorage(name: $name, description: $description, limit: $limit) {
          id
          name
          description
          amount
          limit
          fail
        }
      }
    `;

        const variables = {
            name: 'AppleAOBoRQ',
            description: 'A tasty apple',
            limit: 50,
        };

        const response = await mutate({
            mutation: CREATE_FRUIT_FOR_FRUIT_STORAGE,
            variables,
        });


        // expect(response.data.createFruitForFruitStorage);
        expect(response.data.createFruitForFruitStorage.name).toEqual(variables.name);
        expect(response.data.createFruitForFruitStorage.description).toEqual(variables.description);
        expect(response.data.createFruitForFruitStorage.fail).toBe(false);
        expect(response.data.createFruitForFruitStorage.amount).toEqual(0);
        expect(response.data.createFruitForFruitStorage.limit).toEqual(variables.limit);
    });
});

module.exports = {
    testEnvironment: 'node',
};
// Add more tests for other queries and mutations
