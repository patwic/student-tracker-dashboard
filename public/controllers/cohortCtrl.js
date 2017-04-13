angular.module('app').controller('cohortCtrl', function ($scope, attendanceService, qService) {

    console.log($scope.qTime, 'wefefe')

    $scope.mostOverall = () => {
        qService.getQ()
    }

    $scope.mostAverage = () => {

    }

    $scope.mostRequest = () => {

    }

})