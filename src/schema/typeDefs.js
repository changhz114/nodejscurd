const { makeSchema, objectType, queryType, mutationType } = require('nexus');

const Fruit = objectType({
  name: 'Fruit',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.string('name');
    t.string('description');
    t.nonNull.int('amount');
  },
});

const Query = queryType({
  definition(t) {
    t.list.field('fruits', {
      type: 'Fruit',
    });
    t.field('getFruit', {
      type: 'Fruit',
      args: { id: 'ID' },
    });
    t.field('findFruit', {
      type: 'Fruit',
      args: { name: 'String' },
    });
  },
});

const Mutation = mutationType({
  definition(t) {
    t.field('createFruit', {
      type: 'Fruit',
      args: {
        name: 'String',
        description: 'String',
        amount: 'Int',
      },
    });
    t.field('updateFruit', {
      type: 'Fruit',
      args: {
        id: 'ID',
        name: 'String',
        description: 'String',
        amount: 'Int',
      },
    });
    t.field('deleteFruit', {
      type: 'Fruit',
      args: { id: 'ID' },
    });
  },
});

 const typeDefs = makeSchema({
  types: [Fruit, Query, Mutation],
  outputs: {
    schema: __dirname + '/generated/schema.graphql',
    typegen: __dirname + '/generated/typings.ts',
  },
});

module.exports = typeDefs;


// const { gql } = require('apollo-server');

// const typeDefs = gql`
//   type Fruit {
//     id: ID!
//     name: String!
//     description: String
//     amount: Int!
//   }

//   type Query {
//     fruits: [Fruit]
//     getFruit(id: ID!): Fruit
//     findFruit(name: String!): Fruit
//   }

//   type Mutation {
//     createFruit(name: String!, description: String!, amount: Int): Fruit
//     updateFruit(id: ID!, name: String, description: String, amount: Int): Fruit
//     deleteFruit(id: ID!): Fruit
//   }
// `;

// module.exports = typeDefs;
