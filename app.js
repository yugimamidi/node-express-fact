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

// app.use() middleware to define a static assets folder 'public'
app.use(express.static('public'))

// Use hosting values if available, otherwise default 
const environment = process.env.NODE_ENV || 'development'
const hostname = process.env.HOSTNAME || config.get("hostname")
const port = process.env.PORT || config.get("port");

// Express app.get() to configure endpoints.........................

// default
app.get('/', (req, res) => {
  console.log('Request to /')
  res.sendFile('index.html')
})

// fact/1
app.get('/fact/:id', (req, res) => {
  console.log(`Request params = ${req.params}`)
  const stringId = req.params.id
  console.log(`Requested fact for id = ${stringId}`)
  const intId = parseInt(stringId)
  const entry = data.find(({ id }) => id === intId)
  if (entry === undefined) {
    res.send(`ERROR: No entry with id=${req.params.id}.`)
  }
  else {
    res.send(JSON.stringify(entry))
  }
})

// /fact or /fact/?
app.get('/fact', (req, res) => {
  console.log(`Request query = ${req.query}`)
  if (req.query.id === undefined) {
    // get with a random index 
    const numFacts = data.length
    const rand = Math.floor(Math.random() * numFacts)
    res.send(JSON.stringify(data[rand]))
  }
  else {
    const stringId = req.query.id
    console.log(`Queried fact for id = ${stringId}`)

    const intId = parseInt(stringId)
    if (isNaN(intId)) {
      res.send(`ERROR: No entry with id=${req.query.id}.`)
    }

    const entry = data.find(({ id }) => id === intId)
    if (entry === undefined) {
      res.send(`ERROR: No entry with id=${req.query.id}.`)
    }
    else {
      res.send(JSON.stringify(entry))
    }
  }
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

