const express = require('express'),
      session = require('express-session'),
      devAuth = require('devmtn-auth'),
      passport = require('passport'),
      bodyParser = require('body-parser'),
      massive = require('massive'),
      app = module.exports = express(),
      http = require('http'),
      server = http.createServer(app),
      io = require('socket.io').listen(server),
      path = require('path'),
      config = require('./config'),
      port = config.port,
      conn = massive.connectSync({
            connectionString: config.eleSql
      });


app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '..', '/public')))
app.use(session({
      resave: true,
      saveUninitialized: true,
      secret: config.secret
}))
app.use(passport.initialize())
app.use(passport.session())

//------------Database stuff-------------

app.set('db', conn);
const db = app.get('db');
dbComms = require('./dbComms')

//------------Dependencies-------------

const q = require('./q'),
      alert = require('./alert')
      survey = require('./survey')

// ---------------------------------
passport.use('devmtn', new devAuth({
            app: 'surveys',
            client_token: config.client_token,
            callbackURL: config.callbackURL,
            jwtSecret: config.jwtSecret
      },
      function (jwtoken, user, done) {
            //authenticate
            db.selectPrefsByUser([user.id], function (err, returnedUser) {
                  if (!returnedUser[0]) {
                        console.log('CREATING USER');
                        db.upsertPrefsByUser([user.id, []], function (err, createdUser) {
                              console.log('USER CREATED', createdUser);
                              createdUser[0].name = user.first_name + " " + user.last_name
                              createdUser[0].id = user.id
                              return done(err, createdUser[0]);
                        })
                  } else {
                        returnedUser[0].id = user.id
                        returnedUser[0].name = user.first_name + " " + user.last_name
                        console.log('FOUND USER', returnedUser[0]);
                        return done(err, returnedUser[0]);
                  }
            })
      }
));

passport.serializeUser(function (userA, done) {
      console.log('serializing', userA);
      var userB = userA;
      done(null, userB);
});

passport.deserializeUser(function (userB, done) {
      var userC = userB;
      // db.selectPrefsByUser(userC.id, (err, prefs) => {
      //       if (!err) userC.prefs = prefs
           
      // })

      done(null, userC);
});

app.get('/auth/devmtn', passport.authenticate('devmtn'), function (req, res) {

});

app.get('/auth/devmtn/callback',
      passport.authenticate('devmtn', {
            successRedirect: '/',
            // failureRedirect: "/#/"
      }),
      function (req, res) {
            res.status(200).send(req.user);
      })

app.get('/auth/me', function (req, res) {
      s
      if (!req.user) return res.sendStatus(404);
      res.status(200).send(req.user);
})

app.get('/auth/logout', function (req, res) {
      req.logout();
      res.redirect('/#!/login');
})

app.get('/api/getUser', function(req, res) {
      if(req.user) res.send(req.user)
      else res.send('NOPE');
})



// ---------------------------------

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
      } else console.log('Same day')
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
      setTimeout(getRedAlerts, 15000)
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


app.getHelpQ = () => {
      return helpQ
}
app.getTotalQ = () => {
      return totalQ
}
app.getWaitQ = () => {
      return waitQ
}

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
app.post('/api/prefs/', (req, res) => {
      req.user.cohort_ids = req.body.prefs;
      db.upsertPrefsByUser ([req.user.id, req.body.prefs], (err) => {
            if (err) res.status(500).send(err)
            else res.status(200).send('User updated.')
      })
}) //for user preference database

app.get('/api/surveys/getWeekly', survey.getWeekly) //gets all weekly surveys results
app.get('/api/surveys/getWeeklyById', survey.getWeeklyByCohortId) //gets all weekly surveys results by cohort id.
app.get('/api/surveys/getCommentsById', survey.getWeeklyCommentsById) //gets all weekly comments by cohort id. 
app.get('/api/surveys/getSurveyByTopic', survey.getSurveyByTopic) //gets all surveys by specific topic. 
app.get('/api/surveys/instructors', survey.getInstructorsForSurveys) //get instructors.
app.get('/api/surveys/instructorData', survey.getInstructorData)
app.get('/api/surveys/modules', survey.getModules)
app.get('/api/surveys/topics', survey.getTopics)

//for testing purposes; remove once live
app.put('/api/reset', (req, res) => {
      db.resetSchema((err) => {
            if (err) res.status(500).send(err)
            else if (req.body.command != 'RESET') res.status(403).send('The wrong command was entered. Reset aborted.')
            else res.status(200).json('Server reset successfully.')
      })
})

server.listen(port, () => console.log(`Today is ${date}. Listening on port ${port} . . .`))
