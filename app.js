// require dependencies
const config = require('config')     // for config variables
const express = require('express')   // Express web framework
const helmet = require('helmet')     // HTTP security

// require data
const data = require("./data.js")
console.log(data)

// create an Express app
const app = express()

// app.use() Helmet middleware for secure HTTP headers (always!)
app.use(helmet())

// Use hosting values if available, otherwise default 
const environment = process.env.NODE_ENV || 'development'
const hostname = process.env.HOSTNAME || config.get("hostname")
const port = process.env.PORT || config.get("port");

// app.get() to configure endpoints

// default
app.get('/', (req, res) => {
  res.send('Welcome to the default page! Try the fact API at <a href="./fact">/fact</a>.')
})

// fact/1
app.get('/fact/:index', (req, res) => {
  const i = req.params.index
  res.send(JSON.stringify(data[i]))
})

// fact/?id=1
app.get('/fact', (req, res) => {
  const stringId = req.query.id
  console.log(`Requested fact for string id = ${stringId}`)
  try {
    const intId = parseInt(stringId)
    const entry = data.find(({ id }) => id === givenId)
    res.send(JSON.stringify(entry))
  }
  catch (error) {
    res.send(`ERROR: No entry with id=${req.query.id}.`)
  }
})

// /fact
app.get('/fact', (req, res) => {
  const n = data.length
  const rand = Math.floor(Math.random() * n)
  res.send(JSON.stringify(data[rand]))
})

// app.use() middleware for unrecognized routes
app.use((req, res, next) => {
  res.status(404).send(`status 404 - ${req.originalUrl} was not found`)
})

// start listening and inform developers at the server console
app.listen(port, hostname, () => {
  console.log(`\n App listening at http://${hostname}:${port}/`)
  console.log(`\n Try going to different URIs:\n`)
  console.log(`   Try /fact/0`)
  console.log(`   Try /fact/1`)
  console.log(`   Try /fact`)
  console.log('\n Hit CTRL-C CTRL-C to stop\n')
})

