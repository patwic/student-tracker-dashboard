const config = require('./config.js')
      request = require('request')
      app = require('./server')

const self = module.exports = {
    getCurrentQ: () => {
        let day = new Date().toISOString().substring(0, 10)
        request.get(
            `${config.dev_mtn_api}historical/questions/?admin_token=${config.admin_token}&after=${day}`,
            (err, qres, qbody) => {
                if (err) console.log(err)
                else self.setQs(JSON.parse(qbody))
            })
    },

    setQs: (qbody) => {
        let helpQ = []
            totalQ = []
            waitQ = []
            day = new Date().toISOString().substring(0, 10)
            beginTime = new Date(`${day}T14:50:00.000Z`).getTime()
            increments = Math.ceil((new Date().getTime() - beginTime)/300000)
        for (let i = 0; i < increments; i++) {
            let min = beginTime + (i * 300000)
            if (i != increments - 1) max = beginTime + ((i + 1) * 300000)
            else max = new Date().getTime()
            helpQ.push(self.pushSingleQ(min, max, qbody, 'timeMentorBegins', 'timeQuestionAnswered'))
            totalQ.push(self.pushSingleQ(min, max, qbody, 'timeWhenEntered', 'timeQuestionAnswered'))
            waitQ.push(self.pushSingleQ(min, max, qbody, 'timeWhenEntered', 'timeMentorBegins', 'timeQuestionAnswered'))
        }
        app.setQs(helpQ, totalQ, waitQ)
    },

    pushSingleQ: (min, max, qbody, q1, q2, q3) => {
        let count = 0
            sum = 0
        for (let q of qbody) {
            let qMin = new Date(q[q1]).getTime()
            if (qMin < max) {
                qMax = new Date(q[q2]).getTime()
                if (!qMax && q3) qMax = new Date(q[q3]).getTime()
                if (!qMax || qMax >= min) {
                    if (!qMax || qMax >= max) qMax = max
                    sum += qMax - qMin
                    count++
                }
            }
        }
        if (count > 0) return (sum/(count * 60000)).toFixed(2)
        else return '0'
    }
}