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
      port = 3030,
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

//when a client connects, begins emitting redAlerts and daily Q data
io.on('connection', (socket) => {
      console.log('A user connected')
      socket.emit('updateReds', redAlerts);
      socket.emit('updatedQs', [helpQ, totalQ, waitQ])

      socket.on('disconnect', () => {
            console.log('A user disconnected')
      })
})

//checks each hour if new day; if yes, does a daily reset
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

//updates the daily Q every so often
function updateQ() {
      setTimeout(q.getCurrentQ, 5000)
      setTimeout(updateQ, 3000)
}

//checks for new red alerts every so often
function getRedAlerts() {
      setTimeout(alert.getCurrentRedAlert, 5000)
      setTimeout(getRedAlerts, 300000)
}

//starts updating Q and getting red alerts on server reset
updateQ()
getRedAlerts()

//not sure what this does, honestly
//probably useless code, but I won't delete it just in case
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

//sets Qs, then emits updated Qs to clients
app.setQs = (nHelpQ, nTotalQ, nWaitQ) => {
      helpQ = nHelpQ
      totalQ = nTotalQ
      waitQ = nWaitQ
      io.emit('updatedQs', [helpQ, totalQ, waitQ])
}

//sets red alerts, then emits them to clients
app.setRedAlerts = (rA) => {
      redAlerts = rA;
      io.emit('updateReds', redAlerts);
}

app.get('/api/studentprogress', alert.progressAlert) //gets student progress alerts
app.get('/api/studentexcessq', alert.studentQAlert) //gets student excess q time alerts
app.get('/api/attendancerecorded', alert.noAttendanceAlert) //gets alerts related to absent attendance data
app.get('/api/attendance', alert.attendanceAlert) //gets alerts related to absent students
app.get('/api/prefs/:user_id', dbComms.getPrefs) //for user preference database
app.post('/api/prefs/:user_id', dbComms.upsertPrefs) //for user preference database

//for testing purposes; remove once live
app.put('/api/reset', (req, res) => {
      db.resetSchema((err) => {
            if (err) res.status(500).send(err)
            else if (req.body.command != 'RESET') res.status(403).send('The wrong command was entered. Reset aborted.')
            else res.status(200).json('Server reset successfully.')
      })
})

server.listen(port, () => console.log(`Today is ${date}. Listening on port ${port} . . .`))