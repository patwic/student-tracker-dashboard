angular.module('app').service('alertService', function ($http, config) {

    //gets attendance alerts from server
    this.getAttendanceAlerts = function () {
        return $http.get(config.attendanceUrl, {
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        }).then(function (res) {
            return res
        }).catch(function (err) {
            console.log('Error');
        })
    }

    //gets progress alerts from server
    this.getProgressAlerts = () => {
        return $http.get(config.progressUrl, {
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        }).then(function (res) {
            return res
        }).catch(function (err) {
            console.log('Error');
        })
    }

    //gets no attendance alerts from server
    this.getNoAttendanceAlert = () => {
        return $http.get(config.noAttendUrl, {
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        }).then(function (res) {
            return res
        }).catch(function (err) {
            console.log('Error');
        })
    }

    //gets alerts involving students in Q too long from server
    this.getstudentQAlert = () => {
        return $http.get(config.studentQUrl, {
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        }).then(function (res) {
            return res
        }).catch(function (err) {
            console.log('Error');
        })
    }


})