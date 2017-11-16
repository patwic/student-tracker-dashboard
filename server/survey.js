const config = require('./config.js'),
request = require('request-promise'),
app = require('./server')

module.exports = {
    getWeekly: (req, res) => {
            let info = {
                uri: `${config.surveyAPI}tableau/data`,
                json: true // Automatically parses the JSON string in the response
            }; 
        request(info).then(function (resp) {
            res.send(resp)
        })
    },

    getWeeklyByCohortId: (req, res) => {
        let info = {
            uri: `${config.surveyAPI}tableau/data?cohort=` + req.query.id,
            json: true 
        };
        request(info).then(function (resp) {
            res.send(resp)
        })
    },

    getWeeklyCommentsById: (req, res) => {
        let info = {
            uri: `${config.surveyAPI}tableau/data?cohort=${req.query.id}&comment=all`,
            json: true
        }
        request(info).then(function(resp) {
            res.send(resp)
        })
    },

    getSurveyByTopic: (req, res) => {
        let info = {
            uri: `${config.surveyAPI}tableau/data/topic?topic=${req.query.topic}`,
            json: true
        }
        request(info).then(function(resp) {
            res.send(resp)
        })
    },

    getInstructorsForSurveys: (req, res) => {
        let info = {
            uri: `${config.surveyAPI}admin/instructor`,
            json: true
        }
        request(info).then(function(resp) {
            res.send(resp)
        })
    },

    getInstructorData: (req, res) => {
        res.send(instructorSurveys)
    },

    getModules: (req, res) => {
        let info = {
            uri: `${config.surveyAPI}admin/modules`,
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

var instructorSurveys = [{
    "instructorId": "59f8d79f6ce02767109b8446",
    "subtopic": "w-2.1", 
    "topic": {name: "Javascript", _id: '56fb1628c63976af2f88b31c'},
    "campus": "Provo, UT",
    "program": "webdev",
    "format": "Immersive",
    "instructor": "Missy Beutler",
    "cohort": "WPR15",
    "prepared": 5,
    "explain": 5,
    "overall": 5,
    "date": "2016-11-17T20:08:27.596Z",
    "module": {"_id":"59f8d31a6ce02767109b8429","name":"1.1 JavaScript 1","topicId":"56fb1628c63976af2f88b31c","__v":0}
  }, {
    "instructorId": "59f8d79f6ce02767109b8446",
    "subtopic": "w-2.1",
    "topic": {name: "React", _id: '5745c5fc2690f1a264651f91'},
    "campus": "Provo, UT",
    "program": "webdev",
    "format": "Immersive",
    "instructor": "Missy Beutler",
    "cohort": "WPR15",
    "prepared": 4,
    "explain": 4,
    "overall": 5,
    "date": "2016-11-17T20:08:27.596Z",
    "module": {"_id":"59f8d42d6ce02767109b8435","name":"4.1 React 5","topicId":"5745c5fc2690f1a264651f91","__v":0}
  }, {
    "instructorId": "59f8d79f6ce02767109b8446",
    "subtopic": "w-2.1",
    "topic": {name: "React", _id: '5745c5fc2690f1a264651f91'},
    "campus": "Provo, UT",
    "program": "webdev",
    "format": "Immersive",
    "instructor": "Missy Beutler",
    "cohort": "WPR15",
    "prepared": 5,
    "explain": 5,
    "overall": 5,
    "date": "2016-11-17T20:08:27.596Z",
    "module": {"_id":"59f8d42d6ce02767109b8435","name":"4.1 React 5","topicId":"5745c5fc2690f1a264651f91","__v":0}
  }, {
    "instructorId": "59f8d79f6ce02767109b8446",
    "subtopic": "w-2.1",
    "topic": {name: "React", _id: '5745c5fc2690f1a264651f91'},
    "campus": "Provo, UT",
    "program": "webdev",
    "format": "Immersive",
    "instructor": "Missy Beutler",
    "cohort": "WPR15",
    "prepared": 4,
    "explain": 5,
    "overall": 5,
    "date": "2016-11-17T20:08:27.596Z",
    "module": {"_id":"59f8d42d6ce02767109b8435","name":"4.1 React 5","topicId":"5745c5fc2690f1a264651f91","__v":0}
  }, {
    "instructorId": "59f8d79f6ce02767109b8446",
    "subtopic": "w-2.1",
    "topic": {name: "React", _id: '5745c5fc2690f1a264651f91'},
    "campus": "Provo, UT",
    "program": "webdev",
    "format": "Immersive",
    "instructor": "Missy Beutler",
    "cohort": "WPR15",
    "prepared": 5,
    "explain": 4,
    "overall": 5,
    "date": "2016-11-17T20:08:27.596Z",
    "module": {"_id":"59f8d42d6ce02767109b8435","name":"4.1 React 5","topicId":"5745c5fc2690f1a264651f91","__v":0}
  }, {
    "instructorId": "59f8d79f6ce02767109b8446",
    "subtopic": "w-2.1",
    "topic": {name: "React", _id: '5745c5fc2690f1a264651f91'},
    "campus": "Provo, UT",
    "program": "webdev",
    "format": "Immersive",
    "instructor": "Missy Beutler",
    "cohort": "WPR15",
    "prepared": 3,
    "explain": 3,
    "overall": 3,
    "date": "2016-11-17T20:08:27.596Z",
    "module": {"_id":"59f8d42d6ce02767109b8435","name":"4.1 React 5","topicId":"5745c5fc2690f1a264651f91","__v":0}
  }, {
    "instructorId": "59f8d79f6ce02767109b8446",
    "subtopic": "w-2.1",
    "topic": {name: "React", _id: '5745c5fc2690f1a264651f91'},
    "campus": "Provo, UT",
    "program": "webdev",
    "format": "Immersive",
    "instructor": "Missy Beutler",
    "cohort": "WPR15",
    "prepared": 5,
    "explain": 4,
    "overall": 3,
    "date": "2016-11-17T20:08:27.596Z",
    "module": {"_id":"59f8d42d6ce02767109b8435","name":"4.1 React 5","topicId":"5745c5fc2690f1a264651f91","__v":0}
  }, {
    "instructorId": "59f8d79f6ce02767109b8446",
    "subtopic": "w-2.1",
    "topic": {name: "Javascript", _id: '56fb1628c63976af2f88b31c'},
    "campus": "Provo, UT",
    "program": "webdev",
    "format": "Immersive",
    "instructor": "Missy Beutler",
    "cohort": "WPR15",
    "prepared": 3,
    "explain": 5,
    "overall": 5,
    "date": "2016-11-17T20:08:27.596Z",
    "module": {"_id":"59f8d31a6ce02767109b8429","name":"1.1 JavaScript 1","topicId":"56fb1628c63976af2f88b31c","__v":0}
  }, {
    "instructorId": "59f8d79f6ce02767109b8446",
    "subtopic": "w-2.1",
    "topic": {name: "Javascript", _id: '56fb1628c63976af2f88b31c'},
    "campus": "Provo, UT",
    "program": "webdev",
    "format": "Immersive",
    "instructor": "Missy Beutler",
    "cohort": "WPR15",
    "prepared": 3,
    "explain": 3,
    "overall": 3,
    "date": "2016-11-17T20:08:27.596Z",
    "module": {"_id":"59f8d31a6ce02767109b8429","name":"1.1 JavaScript 1","topicId":"56fb1628c63976af2f88b31c","__v":0}
  }, {
    "instructorId": "59f8d79f6ce02767109b8446",
    "subtopic": "w-2.1",
    "topic": {name: "React", _id: '5745c5fc2690f1a264651f91'},
    "campus": "Provo, UT",
    "program": "webdev",
    "format": "Immersive",
    "instructor": "Missy Beutler",
    "cohort": "WPR15",
    "prepared": 5,
    "explain": 5,
    "overall": 5,
    "date": "2016-11-17T20:08:27.596Z",
    "module": {"_id":"59f8d42d6ce02767109b8435","name":"4.1 React 5","topicId":"5745c5fc2690f1a264651f91","__v":0}
  }, {
    "instructorId": "59f24cb377f2691d80dab8c9",
    "subtopic": "w-2.1",
    "topic": {name: "React", _id: '5745c5fc2690f1a264651f91'},
    "campus": "Provo, UT",
    "program": "webdev",
    "format": "Immersive",
    "instructor": "Brack Carmony",
    "cohort": "WPR14",
    "prepared": 4,
    "explain": 5,
    "overall": 4,
    "date": "2016-10-31T18:00:32.553Z",
    "module": {"_id":"59f8d42d6ce02767109b8435","name":"4.1 React 5","topicId":"5745c5fc2690f1a264651f91","__v":0}
  }, {
    "instructorId": "59f24cb377f2691d80dab8c9",
    "subtopic": "w-2.1",
    "topic": {name: "React", _id: '5745c5fc2690f1a264651f91'},
    "campus": "Provo, UT",
    "program": "webdev",
    "format": "Immersive",
    "instructor": "Brack Carmony",
    "cohort": "WPRAsync",
    "prepared": 4,
    "explain": 4,
    "overall": 4,
    "date": "2016-12-14T20:50:04.823Z",
    "module": {"_id":"59f8d42d6ce02767109b8435","name":"4.1 React 5","topicId":"5745c5fc2690f1a264651f91","__v":0}
  }, {
    "instructorId": "59f24cb377f2691d80dab8c9",
    "subtopic": "w-2.1",
    "topic": {name: "Javascript", _id: '56fb1628c63976af2f88b31c'},
    "campus": "Provo, UT",
    "program": "webdev",
    "format": "Immersive",
    "instructor": "Brack Carmony",
    "cohort": "WPRAsync",
    "prepared": 5,
    "explain": 5,
    "overall": 5,
    "date": "2016-12-14T20:50:04.823Z",
    "module": {"_id":"59f8d31a6ce02767109b8429","name":"1.1 JavaScript 1","topicId":"56fb1628c63976af2f88b31c","__v":0}
  }, {
    "instructorId": "59f24cb377f2691d80dab8c9",
    "subtopic": "w-2.1",
    "topic": {name: "React", _id: '5745c5fc2690f1a264651f91'},
    "campus": "Provo, UT",
    "program": "webdev",
    "format": "Immersive",
    "instructor": "Brack Carmony",
    "cohort": "WPRAsync",
    "prepared": 4,
    "explain": 3,
    "overall": 4,
    "date": "2016-12-14T20:50:04.823Z",
    "module": {"_id":"59f8d3716ce02767109b842e","name":"2.1 React 2","topicId":"5745c5fc2690f1a264651f91","__v":0}
  }, {
    "instructorId": "59f24cb377f2691d80dab8c9",
    "subtopic": "w-2.1",
    "topic": {name: "React", _id: '5745c5fc2690f1a264651f91'},
    "campus": "Provo, UT",
    "program": "webdev",
    "format": "Immersive",
    "instructor": "Brack Carmony",
    "cohort": "WPRAsync",
    "prepared": 4,
    "explain": 4,
    "overall": 4,
    "date": "2016-10-14T20:50:04.823Z",
    "module": {"_id":"59f8d42d6ce02767109b8435","name":"4.1 React 5","topicId":"5745c5fc2690f1a264651f91","__v":0}
  }]