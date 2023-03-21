const { gql } = require('apollo-server');

const typeDefs = gql`
  type Fruit {
    id: ID!
    name: String!
    description: String!
    amount: Int!
  }

  type Query {
    fruits: [Fruit]
    fruit(id: ID!): Fruit
  }

  type Mutation {
    createFruit(name: String!, email: String!, age: Int): Fruit
    updateFruit(id: ID!, name: String, email: String, age: Int): Fruit
    deleteFruit(id: ID!): Fruit
  }
`;

module.exports = typeDefs;
