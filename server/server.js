var express = require('express');
const {graphqlHTTP} = require('express-graphql')
var {buildSchema} = require('graphql');
var stateData = require('./data/states.json');
const cors = require('cors')

const port = 4000;

// GraphQL Schema
var schema = buildSchema(`
    type Query {
        states: [State]
    }
    type State {
        name: String
        abbreviation: String
    }
`);

// Root resolver
var root = {
    states: () => stateData
};

// Create an expres server and a GraphQL endpoint
var app = express();
app.use(cors())
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));

app.listen(port, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));
