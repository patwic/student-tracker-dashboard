angular.module('app').controller('mainCtrl', function($scope, qService){
  $scope.user= 'Jeremy Robertson'
  $scope.isDropdown = false;

  $scope.showDropdown = function() {
      if (!$scope.isDropdown) {
        document.getElementById('dropdown').classList.add('dropdown-transition')
      }
      else {
        document.getElementById('dropdown').classList.remove('dropdown-transition')        
      }
      $scope.isDropdown = !$scope.isDropdown
  }

  qService.getQ('2016-09-01', '2017-02-02').then((res) => {
    qService.divideQDays(res.data, '2016-09-01', '2017-02-02')
  })

  // $scope.openNav = function() {
  //     document.getElementById("login-sidenav").style.width = "500px";
  // }

  // $scope.closeNav = function() {
  //     document.getElementById("login-sidenav").style.width = "0";
  // }


})