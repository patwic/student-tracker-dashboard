const request = require('request-promise');

module.exports = {
  getWeekly: (req, res) => {
    let info = {
      uri: `${process.env.SURVEY_API_TABLEAU}/data`,
      json: true // Automatically parses the JSON string in the response
    };
    request(info).then(function (resp) {
      res.send(resp)
    }).catch(err => {
      console.log(err);
      res.sendStatus(500)
    })
  },

  getWeeklyByCohortId: (req, res) => {
    let info = {
      uri: `${process.env.SURVEY_API_TABLEAU}/data?cohort=` + req.query.id,
      json: true
    };
    request(info).then(function (resp) {
      res.send(resp)
    }).catch(err => {
      console.log(err);
      res.sendStatus(500)
    })
  },

  getWeeklyCommentsById: (req, res) => {
    let info = {
      uri: `${process.env.SURVEY_API_TABLEAU}/data?cohort=${req.query.id}&comment=all`,
      json: true
    }
    request(info).then(function (resp) {
      res.send(resp)
    }).catch(err => {
      console.log(err);
      res.sendStatus(500)
    })
  },

  getSurveyByTopic: (req, res) => {
    let info = {
      uri: `${process.env.SURVEY_API_TABLEAU}/data/moduleTopic?topic=${req.query.topic}`,
      json: true
    }
    request(info).then(function (resp) {
      res.send(resp)
    }).catch(err => {
      console.log(err);
      res.sendStatus(500)
    })
  },

  getInstructorsForSurveys: (req, res) => {
    let info = {
      uri: `${process.env.SURVEY_API_ADMIN}/instructor`,
      json: true
    }
    request(info).then(function (resp) {
      res.send(resp)
    }).catch(err => {
      console.log(err);
      res.sendStatus(500)
    })
  },

  getInstructorData: (req, res) => {
    let info = {
      uri: `${process.env.SURVEY_API_TABLEAU}/data/moduleTopic?topic=${req.query.topic}`,
      json: true
    }
    request(info).then(function (resp) {
      res.send(resp)
    }).catch(err => {
      console.log(err);
      res.sendStatus(500)
    })
  },

  getModules: (req, res) => {
    let info = {
      uri: `${process.env.SURVEY_API_ADMIN}/modules`,
      json: true
    }
    request(info).then(function (resp) {
      res.send(resp)
    }).catch(err => {
      console.log(err);
      res.sendStatus(500)
    })
  },

  getTopics: (req, res) => {
    let info = {
      uri: `${process.env.SURVEY_API}/topics`,
      json: true
    }
    request(info).then(resp => {
      res.send(resp)
    }).catch(err => {
      console.log(err);
      res.sendStatus(500)
    })
  }

}