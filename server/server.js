const express = require('express')
      bodyParser = require('body-parser')
      massive = require('massive')
      app = module.exports = express()
      q = require('./q')
      config = require('./config')
      port = 3000
      conn = massive.connectSync({
            connectionString : config.eleSql
      });

app.set('db', conn);
const db = app.get('db');
      dbComms = require('./dbComms')

let helpQ = []
    totalQ = []
    waitQ = []
    date = new Date().toISOString().substring(0, 10)

setTimeout(function dailyTasks() {
      let currentDate = new Date().toISOString().substring(0, 10)
      if (date != currentDate) {
            date = currentDate
            helpQ = []
            totalQ = []
            waitQ = []
      }
      else console.log('Same day')
      setTimeout(dailyTasks, 28800000)
}, 28800000)

function updateQ() {
      q.getCurrentQ()
      setTimeout(updateQ, 300000)
}

updateQ()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.getHelpQ = () => {return helpQ}
app.getTotalQ = () => {return totalQ}
app.getWaitQ = () => {return waitQ}
app.setHelpQ = (newQ) => helpQ = newQ
app.setTotalQ = (newQ) => totalQ = newQ
app.setWaitQ = (newQ) => waitQ = newQ

app.get('/api/prefs/:user_id', dbComms.getPrefs)
app.post('/api/prefs/:user_id', dbComms.upsertPrefs)

//for testing purposes; remove once live
app.put('/api/reset', (req, res) => {
      db.resetSchema((err) => {
            if (err) res.status(500).send(err)
            else if (req.body.command != 'RESET') res.status(403).send('The wrong command was entered. Reset aborted.')
            else res.status(200).json('Server reset successfully.')
      })
})

app.listen(port, () => console.log(`Today is ${date}. Listening on port ${port} . . .`))