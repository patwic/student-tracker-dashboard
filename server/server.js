const express = require('express'),
      bodyParser = require('body-parser'),
      massive = require('massive'),
      app = module.exports = express(),
      http = require('http'),
      server = http.createServer(app),
      io = require('socket.io').listen(server),
      path = require('path'),
      q = require('./q'),
      config = require('./config'),
      alert = require('./alert'),
      port = 3000,
      conn = massive.connectSync({
            connectionString : config.eleSql
      });

app.set('db', conn);
const db = app.get('db');
      dbComms = require('./dbComms')

let helpQ = [],
    totalQ = [],
    waitQ = [],
    date = new Date().toISOString().substring(0, 10),
    redAlerts = [];

io.on('connection', (socket) => {
      console.log('A user connected')
      socket.emit('updateReds', redAlerts);
      socket.emit('updatedQs', [helpQ, totalQ, waitQ])

      socket.on('disconnect', () => {
            console.log('A user disconnected')
      })
})


setTimeout(function dailyTasks() {
      let currentDate = new Date().toISOString().substring(0, 10)
      if (date != currentDate) {
            console.log('New day')
            date = currentDate
            helpQ = []
            totalQ = []
            waitQ = []
      }
      else console.log('Same day')
      setTimeout(dailyTasks, 3600000)
}, 3600000)

function updateQ() {
      setTimeout(q.getCurrentQ, 5000)
      setTimeout(updateQ, 3000)
}

function getRedAlerts() {
      setTimeout(alert.getCurrentRedAlert, 5000)
      setTimeout(getRedAlerts, 300000)
}

updateQ()
getRedAlerts()

app.setAttendance = (obj) => {
      let absences = obj.absences;
      let lates = obj.lates;
      let leftEarly = obj.leftEarly;
}

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '..', '/public')))

app.getHelpQ = () => {return helpQ}
app.getTotalQ = () => {return totalQ}
app.getWaitQ = () => {return waitQ}
app.setQs = (nHelpQ, nTotalQ, nWaitQ) => {
      helpQ = nHelpQ
      totalQ = nTotalQ
      waitQ = nWaitQ
      io.emit('updatedQs', [helpQ, totalQ, waitQ])
}
app.setRedAlerts = (rA) => {
      redAlerts = rA;
      io.emit('updateReds', redAlerts);
}

app.get('/api/studentprogress', alert.progressAlert)
app.get('/api/studentexcessq', alert.studentQAlert)
app.get('/api/attendancerecorded', alert.noAttendanceAlert)
app.get('/api/attendance', alert.attendanceAlert)
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