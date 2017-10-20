angular.module('app').controller('surveysCtrl', function($scope, surveyService) {

$scope.surveyName;
$scope.cohortName;
$scope.cohortStatus;

    getAllSurveyData = (status, column) => {
        $scope.surveyName = column || "OSAT"
        $scope.cohortStatus = status || 'all'

        $scope.cohortName = "WPR23" //While testing will need to be all cohorts and you can choose active or inactive.
        console.log($scope.surveyName)
        var surveyGraphData = surveyService.data;
        $scope.sd = surveyGraphData.filter(e => e.cohort === $scope.cohortName);
      }
    getAllSurveyData()

    $scope.changeSurveyName = () => {
        getAllSurveyData($scope.cohortStatus, event.target.value)
    }

    $scope.changeCohortStatus = () => {
        getAllSurveyData(event.target.value, $scope.surveyName)
    }
  


})