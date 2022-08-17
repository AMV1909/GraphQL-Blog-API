const express = require('express')
const { graphqlHTTP } = require('express-graphql')

const schema = require('./graphql/schema')
const { authenticate } = require('./middlewares/auth')
require('./db/database')


const app = express()

// Settings
app.set("port", process.env.PORT || 3000)

// Middlewares
app.use(authenticate)

// Routes
app.get("/", (req, res) => res.send("Welcome to my GraphQL api"))

app.use("/graphql", graphqlHTTP({
    graphiql: true,
    schema
}))

// Start the server
app.listen(app.get("port"), () => console.log("Server on port", app.get("port")))