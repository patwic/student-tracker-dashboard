angular.module('app')
.directive('surveyInstructorBarChart', function () {
  return {
    template: '<div id="surveyInstructorBarChart"></div>',
    scope: {
        instructordata: '=',
    },
    controller: function ($scope, surveyService) {

        console.log($scope.instructordata)

     
    changeBar = (surveyData) => {

        console.log(surveyData)

      }

      $scope.$watch('instructordata', function (newValue, oldValue) {
        changeBar($scope.instructordata)
      })
    }
  }
})