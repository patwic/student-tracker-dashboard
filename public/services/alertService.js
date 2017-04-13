angular.module('app').service('alertService', function ($http, config) {

    getAttendanceAlerts = function() {
        return $http.get(config.attendanceUrl, {
            headers: {'Access-Control-Allow-Origin': '*'}
        }).then(function(res){
            console.log(res)
        })
    }
    getAttendanceAlerts();

})