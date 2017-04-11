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

  let socket = io()
  socket.on('updatedQs', (qArr) => {
    console.log('helpQ', qArr[0])
    console.log('totalQ', qArr[1])
    console.log('waitQ', qArr[2])
  })

  /*qService.getQ('2017-04-01', '2017-04-11').then((res) => {
    console.log(res.data)
   // qService.divideQDays(res.data, '2017-04-10', '2017-04-11')
      // qService.getAvgMentorTimes(res.data)
      qService.getAvgStudentTimes(res.data)
  })*/

  // $scope.openNav = function() {
  //     document.getElementById("login-sidenav").style.width = "500px";
  // }

  // $scope.closeNav = function() {
  //     document.getElementById("login-sidenav").style.width = "0";
  // }


})