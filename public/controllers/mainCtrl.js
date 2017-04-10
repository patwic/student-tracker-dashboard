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

  qService.getQ('2017-04-10', '2017-04-11').then((res) => {
    qService.divideQDays(res.data, '2017-04-10', '2017-04-11')
  })

  // $scope.openNav = function() {
  //     document.getElementById("login-sidenav").style.width = "500px";
  // }

  // $scope.closeNav = function() {
  //     document.getElementById("login-sidenav").style.width = "0";
  // }


})