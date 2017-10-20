const config = require('./config.js'),
request = require('request-promise'),
app = require('./server')

module.exports = {
    getWeekly: (req, res) => {
        var options = {
            uri: config.weeklySurveyAPI,
            json: true // Automatically parses the JSON string in the response
        };
        request(options).then(function (resp) {
            res.send(resp)
        })
    }
}


