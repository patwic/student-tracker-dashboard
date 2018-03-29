angular.module('app').service('alertService', function($http, config) {
  // gets attendance alerts from server
  this.getAttendanceAlerts = function() {
    return $http
      .get(config.attendanceUrl, {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      })
      .then(res => res)
      .catch(err => {
        console.log('Error', err);
      });
  };

  // gets progress alerts from server
  this.getProgressAlerts = () =>
    $http
      .get(config.progressUrl, {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      })
      .then(res => res)
      .catch(err => {
        console.log('Error');
      });

  // gets no attendance alerts from server
  this.getNoAttendanceAlert = () =>
    $http
      .get(config.noAttendUrl, {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      })
      .then(res => res)
      .catch(err => {
        console.log('Error');
      });

  // gets alerts involving students in Q too long from server
  this.getstudentQAlert = () =>
    $http
      .get(config.studentQUrl, {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      })
      .then(res => res)
      .catch(err => {
        console.log('Error');
      });
});
