const { gql } = require('apollo-server');

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    author: String
  }

  type Query {
    users: [User]
    user(id: ID!): User
    posts: [Post]
    post(id: ID!): Post
  }

  type Mutation {
    createUser(name: String!, email: String!, age: Int): User
    updateUser(id: ID!, name: String, email: String, age: Int): User
    deleteUser(id: ID!): User
    createPost(title: String!, content: String!, author: String): Post
    updatePost(id: ID!, title: String, content: String, author: String): Post
    deletePost(id: ID!): Post
  }
`;

module.exports = typeDefs;
