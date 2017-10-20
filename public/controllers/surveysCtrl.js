angular.module('app').controller('surveysCtrl', function($scope, surveyService) {

$scope.surveyName;
$scope.cohortName;
$scope.cohortStatus;

    getAllSurveyData = (status, column) => {
        $scope.surveyName = column || "OSAT"
        $scope.cohortStatus = status || 'all'
        $scope.sd = surveyService.data
        $scope.cohortName = "WPR23" //While testing will need to use cohortStatus once endpoint is up and running.
        console.log($scope.surveyName)
    //     $scope.sd = surveyGraphData.filter(e => e.cohort === $scope.cohortName);
      }

    getAllSurveyData()

    getAll = () => {
        surveyService.getWeeklySurveyData().then(res => {
            $scope.sd = res.data
            console.log($scope.sd)
        })
    }
    getAll()

    $scope.changeSurveyName = () => {
        getAllSurveyData($scope.cohortStatus, event.target.value)
    }

    $scope.changeCohortStatus = () => {
        getAllSurveyData(event.target.value, $scope.surveyName)
    }
  


})