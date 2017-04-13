angular.module('app').service('alertService', function ($http, config) {
    console.log('ejae;lgfe')
    getAttendanceAlerts = function() {
        console.log('wl;ejf')
        return $http.get(config.attendanceUrl, {
            headers: {'Access-Control-Allow-Origin': '*'}
        }).then(function(res){
            console.log(res)
        })
    }
    getAttendanceAlerts();

})