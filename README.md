# nodejscurd
`CURD` with `GraphQL` API and `mongoDB`
# Project Structure
```
├── package.json
├── package-lock.json
├── README.md
├── src
│   ├── context.ts
│   ├── db.js
│   ├── events.js
│   ├── index.js
│   ├── models
│   │   ├── fruitModel.js
│   │   └── outboxEventModel.js
│   ├── README.md
│   ├── resolvers
│   │   ├── fruitResolvers.js
│   │   └── index.js
│   └── schema
│       ├── generated
│       │   ├── schema.graphql
│       │   └── typings.ts
│       └── typeDefs.js
└── tests
    └── graphql.test.js

```
# MongoDB Config
in src/db.js there is db configs

Note that the mongo db should be in Replica Mode to ensure that the traction feature is supported

# Start The Server
```bash
npm start
```

