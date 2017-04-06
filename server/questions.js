const config = require('./config.js')
      request = require('request')

module.exports = {
    getCurrentQ: (req, res) => {
        let day = new Date().toISOString().substring(0, 10)
        request.get(
            `${config.dev_mtn_api}historical/questions/?admin_token=${config.admin_token}&after=${day}`,
            (err, qres, qbody) => res.status(200).send(qbody))
    }
}