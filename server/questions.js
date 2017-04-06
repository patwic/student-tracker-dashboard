const config = require('./config.js')
      request = require('request')
      app = require('./server')

module.exports = {
    getCurrentQ: () => {
        let day = new Date().toISOString().substring(0, 10)
        request.get(
            `${config.dev_mtn_api}historical/questions/?admin_token=${config.admin_token}&after=${day}`,
            (err, qres, qbody) => {
                if (err) console.log(err)
                else {
                    qbody = JSON.parse(qbody)
                    //only care about data between 8:45 AM and 5:15 PM
                    qbody = qbody.filter((q) => {
                        let qTime = (new Date(q.timeWhenEntered).getTime() - new Date(`${day}T14:45:00.000Z`).getTime())/1000
                        return 0 < qTime && qTime < 30600
                    })

                }
            })
    },

    divideQ: () => {
        
    }
}