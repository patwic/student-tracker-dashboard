angular.module('app').controller('surveysCtrl', function($scope, surveyService) {

$scope.surveyName;
$scope.cohortName;
$scope.cohortStatus;


$scope.sd = surveyService.getWeeklySurveyData().then(res => {
    let name = "WPR27" 

    let stuff = res.data.filter(e => {
       return  e.cohort === name   
    })

    $scope.sd = stuff
    console.log($scope.sd)
})

    getAllSurveyData = (status, column) => {
        $scope.surveyName = column || "OSAT"
        $scope.cohortStatus = status || 'all'
        $scope.cohortName = "WPR23" //While testing will need to use cohortStatus once endpoint is up and running.
        console.log($scope.surveyName)
    //     $scope.sd = surveyGraphData.filter(e => e.cohort === $scope.cohortName);
      }

    getAllSurveyData()

 

    $scope.changeSurveyName = () => {
        getAllSurveyData($scope.cohortStatus, event.target.value)
    }

    $scope.changeCohortStatus = () => {
        getAllSurveyData(event.target.value, $scope.surveyName)
    }
  


})