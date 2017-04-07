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
                else self.setTotalQ(JSON.parse(qbody))
            })
    },

    //values in below data arrays are in minutes, fixed to two decimal places

    /*//creates help data
    setHelpQ: (tempQ) => {
        let newQ = []
        tempQ.forEach((tQ) => {
            if (tQ.length > 0) {
                let sum = 0
                let count = 0
                //checks for when mentor helps.
                //if no mentor entry is available, they are still waiting and not being helped
                //if no question answered data, they are still being helped, so upper is current time.
                for (let i = 0; i < tQ.length; i++) {
                    if (tQ[i].timeMentorBegins) {
                        count++
                        let upper = new Date().getTime()
                        if (tQ[i].timeQuestionAnswered) upper = new Date(tQ[i].timeQuestionAnswered).getTime()
                        sum += (upper - new Date(tQ[i].timeMentorBegins).getTime())
                    }
                }
                if (sum != 0) newQ.push((sum/(count * 60000)).toFixed(2))
                else newQ.push(-1)
            }
            else newQ.push(-1)
        })
        app.setHelpQ(newQ)
    },*/

    //creates total q data, combining help and wait times
    setTotalQ: (qbody) => {
        let newQ = []
        let day = new Date().toISOString().substring(0, 10)
        let beginTime = new Date(`${day}T14:50:00.000Z`).getTime()
        let increments = Math.ceil((new Date().getTime() - beginTime)/300000)
        for (let i = 0; i < increments; i++) {
            let min = beginTime + (i * 300000)
            let max = beginTime + ((i + 1) * 300000)
            let sum = 0
            let count = 0
            console.log('---')
            for (let q of qbody) {
                let qMin = new Date(q.timeWhenEntered).getTime()
                if (qMin < max) {
                    let qMax = new Date(q.timeQuestionAnswered).getTime()
                    if (!qMax || qMax >= min) {
                        if (!qMax || qMax >= max) qMax = max
                        console.log(q.name, q.timeWhenEntered, q.timeQuestionAnswered)
                        sum += qMax - qMin
                        count++
                    }
                }
                else break
            }
            if (count > 0) newQ.push((sum/(count * 60000)).toFixed(2))
            else newQ.push('0')
        }
        console.log(newQ)
        //app.setTotalQ(newQ)
    },

    /*//divides q data into 10-minute increments, such as 8:50-9:00AM and 5:00-5:10PM
    divideQ: (qbody) => {
        let tempQ = []
        let day = new Date().toISOString().substring(0, 10)
        let increments = Math.ceil((new Date().getTime() - new Date(`${day}T14:50:00.000Z`).getTime())/600000)
        for (let i = 0; i < increments; i++) {tempQ.push([])}
        qbody.forEach((q) => {
            let i = Math.floor((new Date(q.timeWhenEntered).getTime() - new Date(`${day}T14:50:00.000Z`).getTime())/600000)
            tempQ[i].push(q)
        })
        //self.setHelpQ(tempQ)
        self.setTotalQ(tempQ)
        //self.setWaitQ(tempQ)
    },*/

    /*//creates wait q data
    setWaitQ: (tempQ) => {
        let newQ = []
        tempQ.forEach((tQ) => {
            if (tQ.length > 0) {
                let sum = 0
                //checks if mentor has helped
                //if not, checks if they answered the question themselves
                //if neither, they are still waiting for help, so upper is current time
                for (let i = 0; i < tQ.length; i++) {
                    let upper = new Date().getTime()
                    if (tQ[i].timeMentorBegins) upper = new Date(tQ[i].timeMentorBegins).getTime()
                    else if (tQ[i].timeQuestionAnswered) upper = new Date(tQ[i].timeQuestionAnswered).getTime()
                    sum += (upper - new Date(tQ[i].timeWhenEntered).getTime())
                }
                newQ.push((sum/(tQ.length * 60000)).toFixed(2))
            }
            else newQ.push(-1)
        })
        app.setWaitQ(newQ)
    }*/
}