angular.module('app').service('attendanceService', function ($http, config) {
    this.url = `${config.dev_mtn_api}attendancedays/`

    this.getDays = (month, cohortId) => {
        let beginDate = `${month}-01`
        let splitDate = month.split('-')
        splitDate[1] = +splitDate[1] + 1
        if (splitDate[1] > 12) splitDate[1] = '01'
        else if (splitDate[1] < 10) splitDate[1] = '0' + splitDate[1]
        let endDate = splitDate.join('-')
        $http.get(
            `${this.url}?admin_token=${config.admin_token}&after=${beginDate}&before=${endDate}&cohortId=${cohortId}`,
            {headers: {'Access-Control-Allow-Origin': '*'}})
            .then((res) => this.getDataFromDays(res.data))
    }

    this.getDataFromDays = (data) => {
        let daysData = []
        let count = 0
        let promises = []
        for (let datum of data) {
            promises.push($http.get(
                `${this.url}/${datum.cohortId}/${datum.day}?admin_token=${config.admin_token}`,
                {headers: {'Access-Control-Allow-Origin': '*'}}))
        }
        Promise.all(promises).then((res) => {
            for (let day of res) daysData.push(day.data)
            this.getAttendanceFromData(daysData)
        })
    }

    this.getAttendanceFromData = (daysData) => {
        let attendance = []
        for (let attend of daysData) {
            let attendDay = {day : '',
                            late: [],
                            leftEarly: [],
                            abscent: []}
            attendDay.day = attend.day.date.substring(0, 10)
            for (let student of attend.attendances) {
                if (student.attendanceData) {
                    if (student.attendanceData.late) {
                        attendDay.late.push(`${student.user.firstName} ${student.user.lastName}`)
                    } if (student.attendanceData.leftEarly) {
                        attendDay.leftEarly.push(`${student.user.firstName} ${student.user.lastName}`)                    
                    } if (student.attendanceData.abscent) {
                        attendDay.abscent.push(`${student.user.firstName} ${student.user.lastName}`)
                    }
                }
            }
            attendance.push(attendDay)
        }
        console.log(attendance)
    }
})