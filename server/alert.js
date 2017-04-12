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
    for(let i = 0; i < qbody.length; i++) {
      if(!qbody[i].timeMentorBegins && !qbody[i].timeQuestionAnswered) {
        let currentTime = new Date().getTime();
        let startTime = new Date(qbody[i].timeWhenEntered).getTime();
        if(currentTime - startTime > 600000) {
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

  absenceAlert: () => {
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
              `${config.dev_mtn_api}attendancedays/${day.cohortId}/${day.day}?admin_token=${config.admin_token}`,
              {headers: {'Access-Control-Allow-Origin': '*'}}))
            }
            Promise.all(promises).then((res) => {
              
            }).catch((err) => {
              console.log(err)
            })
          }
      })
  },

  progressAlert: () => {},

  lateAlert: () => {},

  noAttendanceAlert: () => {},

  studentQAlert: () => {}
}