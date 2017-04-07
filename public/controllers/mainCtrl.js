angular.module('app').controller('mainCtrl', function($scope){
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

  // $scope.openNav = function() {
  //     document.getElementById("login-sidenav").style.width = "500px";
  // }

  // $scope.closeNav = function() {
  //     document.getElementById("login-sidenav").style.width = "0";
  // }


})