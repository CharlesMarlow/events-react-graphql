const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const schema = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const isAuth = require('./graphql/middleware/is-auth');
require('dotenv').config();

const app = express();
const port = 8000;

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

// Use auth middleware
app.use(isAuth);

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue: resolvers,
    graphiql: true,
  })
);

mongoose
  .connect(
    process.env.MONGO_URI
  )
  .then(() => {
    app.listen(port, () => {
      console.log(`App is listening on port ${port}. This is great news!`);
    });
  })
  .catch((err) => {
    console.log('Connection error', err);
  });
