const config = require('./config.js'),
request = require('request-promise'),
app = require('./server')

module.exports = {
    getWeekly: (req, res) => {
        request.get('https://surveys.devmountain.com/api/tableau/data', (err, resp, body) => {
            console.log(resp)
              res.send(resp)
        })
    }
}


