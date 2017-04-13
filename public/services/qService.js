angular.module('app').service('qService', function ($http, config) {
    this.getQ = (beginDate, endDate, cohortId) => {
        let url = `${config.dev_mtn_api}historical/questions/?admin_token=${config.admin_token}&after=${beginDate}&before=${endDate}`
        if (cohortId) url += `&cohortId=${cohortId}`
        return $http.get(
            url, {
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            }
        )
    }

    this.divideQDays = (qbody, beginDate, endDate) => {
        let beginFD = this.dateFormatter(beginDate)
        let endFD = this.dateFormatter(endDate)
        let qArr = []
        for (let d = beginFD; d < endFD; d.setDate(d.getDate() + 1)) {
            if (d.getDay() != 0 && d.getDay() != 6) qArr.push([new Date(d).toISOString().substring(0, 10)])
        }
        for (let q of qbody) {
            for (let i = 0; i < qArr.length; i++) {
                let day = qArr[i][0]
                let qTWE = new Date(q.timeWhenEntered).getTime()
                if (q.timeWhenEntered.substring(0, 10) == day &&
                    qTWE < new Date(`${day}T23:10:00.000Z`).getTime() &&
                    qTWE >= new Date(`${day}T14:50:00.000Z`).getTime()) {
                    qArr[i].push(q)
                    break
                }
            }
        }
        this.setQs(qArr)
    }

    this.dateFormatter = (date) => {
        let dateArr = date.split('-')
        let fDate = new Date(dateArr[0], dateArr[1] - 1, dateArr[2]);
        return fDate
    }

    this.setQs = (qArr) => {
        let helpQ = []
        totalQ = []
        waitQ = []
        beginTime = new Date(`2000-01-01T14:50:00.000Z`).getTime()
        endTime = new Date(`2000-01-01T23:10:00.000Z`).getTime()
        for (let i = 0; i < 100; i++) {
            let min = beginTime + (i * 300000)
            max = beginTime + ((i + 1) * 300000)
            helpQ.push(this.pushSingleQ(min, max, qArr, 'timeMentorBegins', 'timeQuestionAnswered'))
            totalQ.push(this.pushSingleQ(min, max, qArr, 'timeWhenEntered', 'timeQuestionAnswered'))
            waitQ.push(this.pushSingleQ(min, max, qArr, 'timeWhenEntered', 'timeMentorBegins', 'timeQuestionAnswered'))
        }
        console.log('Help: ', helpQ)
        console.log('Total: ', totalQ)
        console.log('Wait: ', waitQ)
    }

    this.pushSingleQ = (min, max, qArr, q1, q2, q3) => {
        let count = 0
        sum = 0
        for (let dayQs of qArr) {
            for (let i = 1; i < dayQs.length; i++) {
                let q = dayQs[i]
                if (q[q1]) {
                    let qMin = new Date(`2000-01-01T${new Date(q[q1]).toISOString().substring(11, 24)}`).getTime()
                    if (qMin < max) {
                        let qMax = max
                        if (q[q2]) qMax = new Date(`2000-01-01T${new Date(q[q2]).toISOString().substring(11, 24)}`).getTime()
                        else if (q[q3]) qMax = new Date(`2000-01-01T${new Date(q[q3]).toISOString().substring(11, 24)}`).getTime()
                        if (q[q1].substring(0, 10) == new Date().toISOString().substring(0, 10) &&
                            qMax > new Date(`2000-01-01T${new Date().toISOString().substring(11, 24)}`).getTime()) {
                            qMax = new Date(`2000-01-01T${new Date().toISOString().substring(11, 24)}`).getTime()
                        }
                        if (qMax >= min) {
                            if (qMax >= max) qMax = max
                            sum += qMax - qMin
                            count++
                        }
                    }
                }
            }
        }
        if (count > 0) {
            return (sum / (count * 60000)).toFixed(2)
        } else return '0'
    }

    this.getAvgMentorTimes = (qbody) => {
        let mentors = []
        for (let i = 0; i < qbody.length; i++) {
            if (qbody[i].timeMentorBegins) {
                let isNewMentor = true;
                for (let j = 0; j < mentors.length; j++) {
                    if (mentors[j].name === qbody[i].mentorName) {
                        let max = new Date(qbody[i].timeQuestionAnswered).getTime()
                        let min = new Date(qbody[i].timeMentorBegins).getTime()
                        if (!max) {
                            max = new Date().getTime()
                        }
                        mentors[j].count++
                        mentors[j].sum += max - min
                        isNewMentor = false;
                    }
                }
                if (isNewMentor) {
                    let max = new Date(qbody[i].timeQuestionAnswered).getTime()
                    let min = new Date(qbody[i].timeMentorBegins).getTime()
                    if (!max) {
                        max = new Date().getTime()
                    }
                    let mentor = {
                        name: qbody[i].mentorName,
                        count: 1,
                        sum: max - min
                    }
                    mentors.push(mentor)
                }
            }
        }
        for (let j = 0; j < mentors.length; j++) {
            mentors[j].average = (mentors[j].sum / (mentors[j].count * 60000)).toFixed(2)
        }
        return mentors
    }

    this.getAvgStudentTimes = (qbody) => {
        let students = []
        for (let i = 0; i < qbody.length; i++) {
            if (qbody[i].timeMentorBegins) {
                let isNewStudent = true;
                for (let j = 0; j < students.length; j++) {
                    if (students[j].name === qbody[i].name) {
                        let max = new Date(qbody[i].timeQuestionAnswered).getTime()
                        let min = new Date(qbody[i].timeMentorBegins).getTime()
                        if (!max) {
                            max = new Date().getTime()
                        }
                        students[j].count++
                        students[j].sum += max - min
                        isNewStudent = false;
                    }
                }
                if (isNewStudent) {
                    let max = new Date(qbody[i].timeQuestionAnswered).getTime()
                    let min = new Date(qbody[i].timeMentorBegins).getTime()
                    if (!max) {
                        max = new Date().getTime()
                    }
                    let student = {
                        name: qbody[i].name,
                        count: 1,
                        sum: max - min,
                    }
                    students.push(student)
                }
            }
        }
        for (let j = 0; j < students.length; j++) {
            if (students[j].name == 'David Barrett') console.log(students[j])
            students[j].average = parseFloat((students[j].sum / (students[j].count * 60000)).toFixed(2))
        }
        this.getHighest(students.slice(), ["David Barrett"], 'sum')
        return students
        // console.log(students)
    }

    this.getHighest = (students, targetStudents, metric) => {
        console.log(metric)
        let targetStudentMetrics = students.filter((s) => {
            return targetStudents.indexOf(s.name) != -1
        })
        students = students.filter((s) => {
            return targetStudents.indexOf(s.name) == -1
        })
        targetStudentMetrics.sort((a, b) => {
            return b[metric] - a[metric]
        })
        let first = targetStudentMetrics.shift()
        let base = {sum: 0, count: 0, average: 0}
        let second = base
        if (targetStudents.length > 1) second = targetStudentMetrics.shift()
        let third = base
        if (targetStudents.length > 2) third = targetStudentMetrics.shift()
        let total = 0
        let totalCount = 0
        if (metric == 'average') {
            total = students.reduce((total, student) => {
                return total + student.sum
            }, 0)
            totalCount = students.reduce((total, student) => {
                return total + student.count
            }, 0)
        }
        else {
            total = students.reduce((total, student) => {
                return total + student[metric]
            }, 0)
        }
        if (totalCount != 0) total = parseFloat((total/(totalCount * 60000)).toFixed(2))
        let sum = first[metric]+ second[metric]+ third[metric]+ total
        let firstPercent = parseFloat((first[metric]/sum).toFixed(2))
        let secondPercent = parseFloat((second[metric]/sum).toFixed(2))
        let thirdPercent = parseFloat((third[metric]/sum).toFixed(2))
        let totalPercent = parseFloat((1 - (firstPercent + secondPercent + thirdPercent)).toFixed(2))
        let topStudents = []
        topStudents.push({name: first.name, metric: first[metric], percent: firstPercent})
        if (targetStudents.length > 1) topStudents.push({name: second.name, metric: first[metric], percent: secondPercent})
        if (targetStudents.length > 2) topStudents.push({name: third.name, metric: first[metric], percent: thirdPercent})
        topStudents.push({name: 'Other', metric: total, percent: totalPercent})        
        console.log('topStudents:', topStudents)
    }
})