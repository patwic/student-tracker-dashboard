angular.module('app').service('qService', function ($http, config) {


    this.pushSingleQ = pushSingleQ

    //gets Q data from DevMtn DB based on cohort and date range
    this.getQ = (beginDate, endDate, cohortId) => {
        let url = `${config.dev_mtn_api}historical/questions/?admin_token=${config.admin_token}&after=${beginDate}&before=${endDate}`
        if (cohortId) url += `&cohortId=${cohortId}`
        return $http.get(
            url, {
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            }
        ).catch(function (err) {
            console.log('Error');
        })
    }

    //divides Q data into an array
    //each entry in array holds day of Q data
    //continues to setQs
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

    //changes date into needed format for day dividing
    this.dateFormatter = (date) => {
        let dateArr = date.split('-')
        let fDate = new Date(dateArr[0], dateArr[1] - 1, dateArr[2]);
        return fDate
    }


    //takes array of Q data divided into individual days
    //will go through each 5-minute increment from 8:50 AM to 5:10 PM
    //will create helpQ, totalQ, and waitQ
    //each of these Qs will hold these 5-minute increments of data
    this.setQs = (qArr) => {
        let helpQ = []
        let totalQ = []
        let waitQ = []
        let beginTime = new Date(`2000-01-01T14:50:00.000Z`).getTime()
        let endTime = new Date(`2000-01-01T23:10:00.000Z`).getTime()
            for (let i = 0; i < 100; i++) {
                let min = beginTime + (i * 300000)
                let max = beginTime + ((i + 1) * 300000) //this is finding the time for every 5 minutes for a little over 8 hours (i < 100)
                helpQ.push(pushSingleQ(min, max, qArr, 'timeMentorBegins', 'timeQuestionAnswered'))
                totalQ.push(pushSingleQ(min, max, qArr, 'timeWhenEntered', 'timeQuestionAnswered'))
                waitQ.push(pushSingleQ(min, max, qArr, 'timeWhenEntered', 'timeMentorBegins', 'timeQuestionAnswered'))
            }
        return {
            helpQ: helpQ,
            totalQ: totalQ,
            waitQ: waitQ
        }
    }


    //creates a batch of data for the needed 5-minute increment
    //q1 is the lower metric (timeWhenEntered or timeMentorBegins)
    //q2 is the upper metric (timeMentorBegins or timeQuestionAnswered)
    //q3 is an optional metric for wait Q times
    //wait Q times needs 3 metrics, so that it can check both when timeMentorBegins is present and absent
    var pushSingleQ = (min, max, qArr, q1, q2, q3) => {
        let count = 0
        let sum = 0
        for (let i = 1; i < qArr.length; i++) {
            let q = qArr[i]
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
        if (count > 0) {
            return (sum / (count * 60000)).toFixed(2) 
        } else return '0'
    }

    //takes a batch of Q data (qbody)
    //checks each question for a mentor
    //if mentor helped that question, adds question metrics to appropriate mentor
    //returns array of all mentors in data
    //mentor.sum: how much time the mentor helped across all requests
    //mentor.count: how many times the mentor helped students
    //mentor.average: average length of time mentor helped per request (mentor.sum/mentor.count)
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

    //used to measure stats related to amount students helped
    //very similar in function to getAvgMentorTimes
    //refer to that function for more details
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
            students[j].average = parseFloat((students[j].sum / (students[j].count * 60000)).toFixed(2))
        }
        return students
    }

    //students: all students present in data
    //targetStudents: desired students to measure
    //metric: by which metric we're measuring (average, sum, count)
    //this function will measure by the given which metric which students in the targetStudents are topping the charts
    //permits up to top 3, though it is prepared to display only 1 or 2 students
    this.getHighest = (students, targetStudents, metric) => {
        let targetStudentMetrics = students.filter((s) => {
            return targetStudents.indexOf(s.name) != -1
        })
        targetStudentMetrics.sort((a, b) => {
            return b[metric] - a[metric]
        })
        students = students.filter((s) => {
            let top = false
            for (let i = 0; i <= 2; i++) {
                if (targetStudentMetrics[i] &&
                    targetStudentMetrics[i].name == s.name) top = true
            }
            return !top
        })
        let first = targetStudentMetrics.shift()
        let base = {
            sum: 0,
            count: 0,
            average: 0,
            name: 'NA'
        }
        let second = base
        if (targetStudentMetrics.length >= 1) second = targetStudentMetrics.shift()
        let third = base
        if (targetStudentMetrics.length >= 1) third = targetStudentMetrics.shift()
        let total = 0
        let totalCount = 0
        if (metric == 'average') {
            total = students.reduce((total, student) => {
                return total + student.sum
            }, 0)
            totalCount = students.reduce((total, student) => {
                return total + student.count
            }, 0)
        } else {
            total = students.reduce((total, student) => {
                return total + student[metric]
            }, 0)
        }
        if (totalCount != 0) total = parseFloat((total / (totalCount * 60000)).toFixed(2))
        //fix error bug here
        let sum = first[metric] + second[metric] + third[metric] + total
        let firstPercent = parseFloat((first[metric] / sum).toFixed(2))
        let secondPercent = parseFloat((second[metric] / sum).toFixed(2))
        let thirdPercent = parseFloat((third[metric] / sum).toFixed(2))
        let totalPercent = parseFloat((1 - (firstPercent + secondPercent + thirdPercent)).toFixed(2))
        let topStudents = []
        topStudents.push({
            name: first.name,
            metric: first[metric],
            percent: firstPercent
        })
        if (targetStudents.length > 1) topStudents.push({
            name: second.name,
            metric: second[metric],
            percent: secondPercent
        })
        if (targetStudents.length > 2) topStudents.push({
            name: third.name,
            metric: third[metric],
            percent: thirdPercent
        })
        topStudents.push({
            name: 'Other',
            metric: total,
            percent: totalPercent
        })
        return topStudents
    }

    //gets a list of students for a given cohort
    this.getStudentsForCohort = (cID) => {
        return $http.get('https://q.devmountain.com/admin/user?cohort=' + cID + '&admin_token=' + config.admin_token).then(res => {
            return res.data;
        }).catch(function (err) {
            console.log('Error');
        })
    }

    this.sortAverageTotals = (students) => {
        return students.sort((a,b) => b.average - a.average)
    }

    this.sortHelpedTotals = (students) => {
        students.map((e) => {
           return e.sum = Math.round((e.sum / 60000).toFixed(2))
        })
        return students.sort((a,b) => b.sum - a.sum)
    }

    this.sortRequestTotals = (students) => {
        return students.sort((a,b) => b.count - a.count)
    }
})