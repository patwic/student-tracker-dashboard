const config = require('./config.js')
      request = require('request')
      app = require('./server')

module.exports = {
    getCurrentQ: (req, res) => {
        let day = new Date().toISOString().substring(0, 10)
        request.get(
            `${config.dev_mtn_api}historical/questions/?admin_token=${config.admin_token}&after=${day}`,
            (err, qres, qbody) => {
                if (err) console.log(err)
                else {
                    qbody = JSON.parse(qbody)
                    let oldQ = app.getTotalQ()
                    let newQ = []
                    if (qbody.length > oldQ.length) {
                        newQ = oldQ.concat(qbody.slice(oldQ.length))
                        app.setTotalQ(newQ)
                    }
                }
            })
    }
}