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
                else {
                    qbody = JSON.parse(qbody)
                    //filter for data between 8:45 AM and 5:15 PM
                    qbody = qbody.filter((q) => {
                        let qTime = (new Date(q.timeWhenEntered).getTime() - new Date(`${day}T14:45:00.000Z`).getTime())/1000
                        return 0 < qTime && qTime < 30600
                    })
                    self.divideQ(qbody)
                }
            })
    },

    //divides q data into 30-minute increments, such as 8:45-9:15AM and 4:45-5:15PM
    divideQ: (qbody) => {
        let tempQ = []
        for (let i = 0; i < 17; i++) {tempQ.push([])}
        let day = new Date().toISOString().substring(0, 10)
        qbody.forEach((q) => {
            let i = Math.floor((new Date(q.timeWhenEntered).getTime() - new Date(`${day}T14:45:00.000Z`).getTime())/1800000)
            tempQ[i].push(q)
        })
        self.setHelpQ(tempQ)
        self.setTotalQ(tempQ)
        self.setWaitQ(tempQ)
    },

    //values in below data arrays are in minutes, fixed to two decimal places

    //creates help data
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
    },

    //creates total q data, combining help and wait times
    setTotalQ: (tempQ) => {
        let newQ = []        
        tempQ.forEach((tQ) => {
            if (tQ.length > 0) {
                let sum = 0
                //checks if their question has been answered.
                //if not, they are still in queue, so upper is current time.
                for (let i = 0; i < tQ.length; i++) {
                    let upper = new Date().getTime()
                    if (tQ[i].timeQuestionAnswered) upper = new Date(tQ[i].timeQuestionAnswered).getTime()
                    sum += (upper - new Date(tQ[i].timeWhenEntered).getTime())
                }
                newQ.push((sum/(tQ.length * 60000)).toFixed(2))
            }
            else newQ.push(-1)
        })
        app.setTotalQ(newQ)
    },

    //creates wait q data
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
        app.setTotalQ(newQ)
    }
}