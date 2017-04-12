angular.module('app').controller('mainCtrl', function ($scope, attendanceService) {
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

  attendanceService.getDays('2017-03', 106)

  // document.getElementById('home-nav').addClass('active-link')
  // $scope.activeLinks = function (link) {
  //   if(link === 'cohort') {
  //     document.getElementById('cohort-nav').addClass('active-link');
  //     document.getElementById('home-nav').removeClass('active-link');      
  //   } else {
  //     document.getElementById('cohort-nav').removeClass('active-link');
  //     document.getElementById('home-nav').addClass('active-link'); 
  //   }
  // }

  let socket = io()
  socket.on('updatedQs', (qArr) => {
    $scope.helpQ = qArr[0]
    $scope.totalQ = qArr[1]
    $scope.waitQ = qArr[2]
    $scope.$apply();
  })

  socket.on('updateReds', (rA) => {
    $scope.redAlerts = rA;
    for(let i = 0; i < $scope.redAlerts.length; i++) {
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
})