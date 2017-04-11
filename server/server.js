const express = require('express')
      bodyParser = require('body-parser')
      massive = require('massive')
      app = module.exports = express()
      http = require('http')
      server = http.createServer(app)
      io = require('socket.io').listen(server)
      path = require('path')
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

io.on('connection', (socket) => {
      console.log('A user connected')

      socket.on('disconnect', () => {
            console.log('A user disconnected')
      })
})


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
app.use(express.static(path.join(__dirname, '..', '/public')))

io.sockets.emit('totalQ', ['hi'])
io.emit('totalQ', ['hi'])

app.getHelpQ = () => {return helpQ}
app.getTotalQ = () => {return totalQ}
app.getWaitQ = () => {return waitQ}
app.setHelpQ = (newQ) => {helpQ = newQ; console.log(helpQ)}
app.setTotalQ = (newQ) => {totalQ = newQ; console.log(totalQ); io.emit('totalQ', totalQ)}
app.setWaitQ = (newQ) => {waitQ = newQ; console.log(waitQ)}

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

server.listen(port, () => console.log(`Today is ${date}. Listening on port ${port} . . .`))