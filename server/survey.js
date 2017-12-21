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
            uri: `${config.surveyAPIT}/data/topic?topic=${req.query.topic}`,
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

        // let info = {
        //     uri: `${config.surveyAPIT}/data/moduleTopic?topic=${req.query.topic}`,
        //     json: true
        // }
        // request(info).then(function(resp) {
        //     res.send(resp)
        // })


        var data = [{
            "cohortId":121,
            "campus":"Provo, UT",
            "program":"webdev",
            "format":"Immersive",
            "instructor":{"_id":"59f24cb377f2691d80dab8c9","name":"Brack Carmony","__v":0},
            "module":{"_id":"59f8d2f06ce02767109b8428",
            "name":"1.1 Git","topicId":"573a2ddeabc0b44a276042e8","__v":0},"topic":{"_id":"573a2ddeabc0b44a276042e8","name":"Git","__v":0},"cohort":"WPR28","prepared":5,"explain":5,"overall":5,"date":"2017-11-16T01:04:10.582Z"
        }]

        res.send(data)
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

