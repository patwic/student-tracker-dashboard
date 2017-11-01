const config = require('./config.js'),
request = require('request-promise'),
app = require('./server')

module.exports = {
    getWeekly: (req, res) => {
            var options = {
                uri: `${config.surveyAPI}tableau/data`,
                json: true // Automatically parses the JSON string in the response
            }; 
        request(options).then(function (resp) {
            res.send(resp)
        })
    },

    getWeeklyByCohortId: (req, res) => {
        var options = {
            uri: `${config.surveyAPI}tableau/data?cohort=` + req.query.id,
            json: true 
        };
        request(options).then(function (resp) {
            res.send(resp)
        })
    },

    getWeeklyCommentsById: (req, res) => {
        var options = {
            uri: `${config.surveyAPI}tableau/data?cohort=${req.query.id}&comment=all`,
            json: true
        }
        request(options).then(function(resp) {
            res.send(resp)
        })
    },

    getSurveyByTopic: (req, res) => {
        var options = {
            uri: `${config.surveyAPI}tableau/data/topic?topic=${req.query.topic}`,
            json: true
        }
        request(options).then(function(resp) {
            res.send(resp)
        })
    },

    getInstructorsForSurveys: (req, res) => {
        var options = {
            uri: `${config.surveyAPI}admin/instructor`,
            json: true
        }
        request(options).then(function(resp) {
            res.send(resp)
        })
    },

    getInstructorData: (req, res) => {
        res.send(instructorSurveys)
    }
}

var instructorSurveys = [{
    "instructorId": "59f8d79f6ce02767109b8446",
    "subtopic": "w-2.1",
    "topic": "Javascript",
    "campus": "Provo, UT",
    "program": "webdev",
    "format": "Immersive",
    "instructor": "Missy Beutler",
    "cohort": "WPR15",
    "prepared": 5,
    "explain": 5,
    "overall": 5,
    "date": "2016-11-17T20:08:27.596Z"
  }, {
    "instructorId": "59f8d79f6ce02767109b8446",
    "subtopic": "w-2.1",
    "topic": "React",
    "campus": "Provo, UT",
    "program": "webdev",
    "format": "Immersive",
    "instructor": "Missy Beutler",
    "cohort": "WPR15",
    "prepared": 4,
    "explain": 4,
    "overall": 5,
    "date": "2016-11-17T20:08:27.596Z"
  }, {
    "instructorId": "59f8d79f6ce02767109b8446",
    "subtopic": "w-2.1",
    "topic": "React",
    "campus": "Provo, UT",
    "program": "webdev",
    "format": "Immersive",
    "instructor": "Missy Beutler",
    "cohort": "WPR15",
    "prepared": 5,
    "explain": 5,
    "overall": 5,
    "date": "2016-11-17T20:08:27.596Z"
  }, {
    "instructorId": "59f8d79f6ce02767109b8446",
    "subtopic": "w-2.1",
    "topic": "React",
    "campus": "Provo, UT",
    "program": "webdev",
    "format": "Immersive",
    "instructor": "Missy Beutler",
    "cohort": "WPR15",
    "prepared": 4,
    "explain": 5,
    "overall": 5,
    "date": "2016-11-17T20:08:27.596Z"
  }, {
    "instructorId": "59f8d79f6ce02767109b8446",
    "subtopic": "w-2.1",
    "topic": "React",
    "campus": "Provo, UT",
    "program": "webdev",
    "format": "Immersive",
    "instructor": "Missy Beutler",
    "cohort": "WPR15",
    "prepared": 5,
    "explain": 4,
    "overall": 5,
    "date": "2016-11-17T20:08:27.596Z"
  }, {
    "instructorId": "59f8d79f6ce02767109b8446",
    "subtopic": "w-2.1",
    "topic": "React",
    "campus": "Provo, UT",
    "program": "webdev",
    "format": "Immersive",
    "instructor": "Missy Beutler",
    "cohort": "WPR15",
    "prepared": 3,
    "explain": 3,
    "overall": 3,
    "date": "2016-11-17T20:08:27.596Z"
  }, {
    "instructorId": "59f8d79f6ce02767109b8446",
    "subtopic": "w-2.1",
    "topic": "React",
    "campus": "Provo, UT",
    "program": "webdev",
    "format": "Immersive",
    "instructor": "Missy Beutler",
    "cohort": "WPR15",
    "prepared": 5,
    "explain": 4,
    "overall": 3,
    "date": "2016-11-17T20:08:27.596Z"
  }, {
    "instructorId": "59f8d79f6ce02767109b8446",
    "subtopic": "w-2.1",
    "topic": "Javascript",
    "campus": "Provo, UT",
    "program": "webdev",
    "format": "Immersive",
    "instructor": "Missy Beutler",
    "cohort": "WPR15",
    "prepared": 3,
    "explain": 5,
    "overall": 5,
    "date": "2016-11-17T20:08:27.596Z"
  }, {
    "instructorId": "59f8d79f6ce02767109b8446",
    "subtopic": "w-2.1",
    "topic": "React",
    "campus": "Provo, UT",
    "program": "webdev",
    "format": "Immersive",
    "instructor": "Missy Beutler",
    "cohort": "WPR15",
    "prepared": 3,
    "explain": 3,
    "overall": 3,
    "date": "2016-11-17T20:08:27.596Z"
  }, {
    "instructorId": "59f8d79f6ce02767109b8446",
    "subtopic": "w-2.1",
    "topic": "React",
    "campus": "Provo, UT",
    "program": "webdev",
    "format": "Immersive",
    "instructor": "Missy Beutler",
    "cohort": "WPR15",
    "prepared": 5,
    "explain": 5,
    "overall": 5,
    "date": "2016-11-17T20:08:27.596Z"
  }, {
    "instructorId": "59f24cb377f2691d80dab8c9",
    "subtopic": "w-2.1",
    "topic": "React",
    "campus": "Provo, UT",
    "program": "webdev",
    "format": "Immersive",
    "instructor": "Brack Carmony",
    "cohort": "WPR14",
    "prepared": 4,
    "explain": 5,
    "overall": 4,
    "date": "2016-10-31T18:00:32.553Z"
  }, {
    "instructorId": "59f24cb377f2691d80dab8c9",
    "subtopic": "w-2.1",
    "topic": "React",
    "campus": "Provo, UT",
    "program": "webdev",
    "format": "Immersive",
    "instructor": "Brack Carmony",
    "cohort": "WPRAsync",
    "prepared": 4,
    "explain": 4,
    "overall": 4,
    "date": "2016-12-14T20:50:04.823Z"
  }, {
    "instructorId": "59f24cb377f2691d80dab8c9",
    "subtopic": "w-2.1",
    "topic": "Javascript",
    "campus": "Provo, UT",
    "program": "webdev",
    "format": "Immersive",
    "instructor": "Brack Carmony",
    "cohort": "WPRAsync",
    "prepared": 5,
    "explain": 5,
    "overall": 5,
    "date": "2016-12-14T20:50:04.823Z"
  }, {
    "instructorId": "59f24cb377f2691d80dab8c9",
    "subtopic": "w-2.1",
    "topic": "React",
    "campus": "Provo, UT",
    "program": "webdev",
    "format": "Immersive",
    "instructor": "Brack Carmony",
    "cohort": "WPRAsync",
    "prepared": 4,
    "explain": 4,
    "overall": 4,
    "date": "2016-12-14T20:50:04.823Z"
  }, {
    "instructorId": "59f24cb377f2691d80dab8c9",
    "subtopic": "w-2.1",
    "topic": "React",
    "campus": "Provo, UT",
    "program": "webdev",
    "format": "Immersive",
    "instructor": "Brack Carmony",
    "cohort": "WPRAsync",
    "prepared": 4,
    "explain": 4,
    "overall": 4,
    "date": "2016-12-14T20:50:04.823Z"
  }]