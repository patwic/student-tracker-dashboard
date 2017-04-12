const config = require('./config.js'),
  request = require('request'),
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
  }


}