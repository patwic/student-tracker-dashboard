angular.module('app').service('alertService', function ($http, config) {

    getAttendanceAlerts = function() {
        return $http.get(config.attendanceUrl, {
            headers: {'Access-Control-Allow-Origin': '*'}
        }).then(function(res){
            console.log(res)
        })
    }
    getAttendanceAlerts();


    getProgressAlert = () => {
        return $http.get(config.progressUrl, {
            headers: {'Access-Control-Allow-Origin': '*'}
        }).then(function(res){
            console.log(res)
        })
    }
    getProgressAlert();

    getNoAttendanceAlert = () => {
        return $http.get(config.noAttendUrl, {
            headers: {'Access-Control-Allow-Origin': '*'}
        }).then(function(res){
            console.log(res)
        })
    }
    getNoAttendanceAlert();

    getstudentQAlert = () => {
        return $http.get(config.studentQUrl, {
            headers: {'Access-Control-Allow-Origin': '*'}
        }).then(function(res){
            console.log(res)
        })
    }
    getstudentQAlert();

})