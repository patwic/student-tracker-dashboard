angular.module('app').service('attendanceService', function ($http, config) {
    this.url = `${config.dev_mtn_api}attendancedays/`

    //gets attendance days associated with active cohorts
    //will use days to get attendance data per day in other functions
    this.getDays = (cohortId) => {
        return $http.get(
                `${this.url}?admin_token=${config.admin_token}&cohortId=${cohortId}`, {
                    headers: {
                        'Access-Control-Allow-Origin': '*'
                    }
                })
            .catch(function (err) {
                console.log('Error');
            })
    }

    //gets attendance data from DevMtn DB for each day passed in
    //returns array of promises
    //each promise being a day of data from DevMtn DB
    this.getDataFromDays = (data) => {
        let promises = []
        for (let datum of data) {
            if (datum.day) {
                promises.push($http.get(
                        `${this.url}/${datum.cohortId}/${datum.day}?admin_token=${config.admin_token}`, {
                            headers: {
                                'Access-Control-Allow-Origin': '*'
                            }
                        }))
            }
        }
        return Promise.all(promises)
    }

    //divides attendance data into days
    //also includes list of students late, left early, and absent
    //returns array of this information
    this.getAttendanceFromData = (daysData) => {
        let attendance = []
        for (let attend of daysData) {
            let absentStudents = {}
            let attendDay = {
                day: '',
                late: [],
                leftEarly: [],
                absent: []
            }
            attendDay.day = attend.data.day.date.substring(0, 10)
            for (let student of attend.data.attendances) {
                if (student.attendanceData) {
                    if (student.attendanceData.late) {
                        attendDay.late.push(`${student.user.firstName} ${student.user.lastName}`)
                    }
                    if (student.attendanceData.leftEarly) {
                        attendDay.leftEarly.push(`${student.user.firstName} ${student.user.lastName}`)
                    }
                    if (student.attendanceData.abscent) {
                        attendDay.absent.push(`${student.user.firstName} ${student.user.lastName}`)
                    }
                }
            }
            attendance.push(attendDay)
        }
        return attendance
    }
})