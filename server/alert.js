const config = require('./config.js'),
  request = require('request-promise')
app = require('./server')

let self = module.exports = {

  getCurrentRedAlert: () => {
    let day = new Date().toISOString().substring(0, 10)
    request.get(
      `${config.dev_mtn_api}historical/questions/?admin_token=${config.admin_token}&after=${day}`,
      (err, qres, qbody) => {
        if (err) console.log(err)
        else self.redAlert(JSON.parse(qbody))
      })
  },
  redAlert: (qbody) => {
    let alerts = []
    for (let i = 0; i < qbody.length; i++) {
      if (!qbody[i].timeMentorBegins && !qbody[i].timeQuestionAnswered) {
        let currentTime = new Date().getTime();
        let startTime = new Date(qbody[i].timeWhenEntered).getTime();
        if (currentTime - startTime > 600000) {
          alerts.push({
            name: qbody[i].name,
            waitTime: currentTime - startTime
          })
        }
      }
    }
    app.setRedAlerts(alerts)
  },

  getYellowAlerts: () => {},

  attendanceAlert: () => {
    let today = new Date().toISOString().substring(0, 10)
    let yesterday = new Date()
    yesterday.setDate(new Date().getDate() - 1)
    yesterday = yesterday.toISOString().substring(0, 10)
    request.get(
      `${config.dev_mtn_api}attendancedays/?admin_token=${config.admin_token}&after=${yesterday}&before=${today}`,
      (err, qres, daysBody) => {
        if (err) console.log(err)
        else {
          daysBody = JSON.parse(daysBody)
          let promises = []
          for (let day of daysBody) {
            promises.push(request.get(
              `${config.dev_mtn_api}attendancedays/${day.cohortId}/${day.day}?admin_token=${config.admin_token}`, {
                headers: {
                  'Access-Control-Allow-Origin': '*'
                }
              }))
          }
          Promise.all(promises).then((res) => {
            let attendObj = []
            for (let i = 0; i < res.length; i++) {
              attendObj.push(JSON.parse(res[i]))
            }
            self.attendanceObjectParsing(attendObj)
          }).catch((err) => {
            console.log(err)
          })
        }
      })
  },

  attendanceObjectParsing: (attendObj) => {
    let absences = []
    let lates = []
    let leftEarly = []
    for (let i = 0; i < attendObj.length; i++) {
      let aobj = attendObj[i].attendances
      let k = 0
      for (let j = 0; j < aobj.length; j++) {
        if (aobj[j].attendanceData) {
          if (aobj[j].attendanceData.abscent === true) {
            absences.push([aobj[j].user.firstName, aobj[j].user.lastName])
          }
          if (aobj[j].attendanceData.late === true) {
            lates.push([aobj[j].user.firstName, aobj[j].user.lastName])
          }
          if (aobj[j].attendanceData.leftEarly === true) {
            leftEarly.push([aobj[j].user.firstName, aobj[j].user.lastName])
          }
        }
      }
    }
    app.setAttendance({
      absences: absences,
      lates: lates,
      leftEarly: leftEarly
    })
  },

  progressAlert: () => {},

  noAttendanceAlert: () => {},

  studentQAlert: () => {}
}