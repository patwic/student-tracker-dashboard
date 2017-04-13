angular.module('app').controller('mainCtrl', function ($scope, attendanceService, alertService, $location) {
  $scope.user = 'Jeremy Robertson'
  $scope.isDropdown = false;
  $scope.helpQ;
  $scope.totalQ;
  $scope.waitQ;
  $scope.redAlerts;



  $scope.showDropdown = function () {
    if (!$scope.isDropdown) {
      document.getElementById('dropdown').classList.add('dropdown-transition')
    } else {
      document.getElementById('dropdown').classList.remove('dropdown-transition')
    }
    $scope.isDropdown = !$scope.isDropdown
  }
  /*

    attendanceService.getDays('2017-03', 106)
      .then((res) => attendanceService.getDataFromDays(res.data))
      .then((res) => {
        let daysData = []
        for (let day of res) daysData.push(day.data)
        console.log(attendanceService.getAttendanceFromData(daysData))
    })*/

  if ($location.path() === '/') $scope.activateLink = true;
  else $scope.activateLink = false;
  $scope.changeLink = function (status) {
    $scope.activateLink = status;
  }

  let socket = io()
  socket.on('updatedQs', (qArr) => {
    $scope.helpQ = qArr[0]
    $scope.totalQ = qArr[1]
    $scope.waitQ = qArr[2]
    $scope.$apply();
  })

  socket.on('updateReds', (rA) => {
    $scope.redAlerts = rA;
    for (let i = 0; i < $scope.redAlerts.length; i++) {
      $scope.redAlerts[i].waitTime = Math.floor($scope.redAlerts[i].waitTime / 60000);
    }
    $scope.$apply();
  })

  $scope.openNav = function () {
    document.getElementById("login-sidenav").style.width = "500px";
    document.getElementById("login-sidenavOverlay").style.display = "block";
  }

  $scope.closeNav = function () {
    document.getElementById("login-sidenav").style.width = "0";
    document.getElementById("login-sidenavOverlay").style.display = "none";
  }

  $scope.openCohortNav = function () {
    document.getElementById("cohort-sidenav").style.width = "200px";
    document.getElementById("cohort-selectedCohort").style.backgroundColor = "#444";
    document.getElementById("cohort-selectedCohort").style.color = '#999999';
  }

  $scope.openCohortStudentNav = function () {
    document.getElementById("cohort-sidenavStudent").style.width = "420px";
    document.getElementById("cohort-selectedCohort").style.backgroundColor = "#1a1a1a";
    document.getElementById("cohort-selectedCohort").style.color = '#25aae1';
  }

  $scope.closeCohortStudentNav = function () {
    document.getElementById("cohort-sidenavStudent").style.width = "0";
    document.getElementById("cohort-sidenav").style.width = "0";
  }


  //-------------attendance calendar-----------------//

  var absences = ['2017/04/02', '2017/04/04']

  $('#attendanceCalendar').datepicker({
    inline: true,
    firstDay: 1,
    showOtherMonths: true,
    dateFormat: 'yy-mm-dd',
    dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    beforeShowDay: highlightDays

  });

  function highlightDays(date) {
    for (var i = 0; i < absences.length; i++) {
      if (new Date(absences[i]).toString() == date.toString()) {
        return [true, 'highlight'];
      }
    }
    return [true, ''];
  }

  


})