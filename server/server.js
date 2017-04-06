const express = require('express')
      bodyParser = require('body-parser')
      questions = require('./questions')
      config = require('./config.js')
      app = express()
      port = 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/api/questions', questions.attachQueries)

app.listen(port, () => console.log(`Listening on port ${port} . . .`))