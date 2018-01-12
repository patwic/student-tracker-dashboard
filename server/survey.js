const config = require('./config.js'),
request = require('request-promise'),
app = require('./server')

module.exports = {
    getWeekly: (req, res) => {
            let info = {
                uri: `${config.surveyAPIT}/data`,
                json: true // Automatically parses the JSON string in the response
            }; 
        request(info).then(function (resp) {
            res.send(resp)
        })
    },

    getWeeklyByCohortId: (req, res) => {
        let info = {
            uri: `${config.surveyAPIT}/data?cohort=` + req.query.id,
            json: true 
        };
        request(info).then(function (resp) {
            res.send(resp)
        })
    },

    getWeeklyCommentsById: (req, res) => {
        let info = {
            uri: `${config.surveyAPIT}/data?cohort=${req.query.id}&comment=all`,
            json: true
        }
        request(info).then(function(resp) {
            res.send(resp)
        })
    },

    getSurveyByTopic: (req, res) => {
        let info = {
            uri: `${config.surveyAPIT}/data/moduleTopic?topic=${req.query.topic}`,
            json: true
        }
        request(info).then(function(resp) {
            res.send(resp)
        })
    },

    getInstructorsForSurveys: (req, res) => {
        let info = {
            uri: `${config.surveyAPIA}/instructor`,
            json: true
        }
        request(info).then(function(resp) {
            res.send(resp)
        })
    },

    getInstructorData: (req, res) => {
        let info = {
            uri: `${config.surveyAPIT}/data/moduleTopic?topic=${req.query.topic}`,
            json: true
        }
        request(info).then(function(resp) {
            res.send(resp)
        })
    },

    getModules: (req, res) => {
        let info = {
            uri: `${config.surveyAPIA}/modules`,
            json: true
        }
        request(info).then(function(resp) {
            res.send(resp)
        })
    },

    getTopics: (req, res) => {
        let info = {
            uri: `${config.surveyAPI}topics`,
            json: true
        }
        request(info).then(resp => {
            res.send(resp)
        })
    }

}

