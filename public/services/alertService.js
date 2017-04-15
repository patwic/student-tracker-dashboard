angular.module('app').service('alertService', function ($http, config) {

    this.getAttendanceAlerts = function() {
        return $http.get(config.attendanceUrl, {
            headers: {'Access-Control-Allow-Origin': '*'}
        }).then(function(res){
            return res
        })
    }


    this.getProgressAlerts = () => {
        return $http.get(config.progressUrl, {
            headers: {'Access-Control-Allow-Origin': '*'}
        }).then(function(res){
            return res
        })
    }
 

    this.getNoAttendanceAlert = () => {
        return $http.get(config.noAttendUrl, {
            headers: {'Access-Control-Allow-Origin': '*'}
        }).then(function(res){
            return res
        })
    }
 

    this.getstudentQAlert = () => {
        return $http.get(config.studentQUrl, {
            headers: {'Access-Control-Allow-Origin': '*'}
        }).then(function(res){
            return res
        })
    }


})