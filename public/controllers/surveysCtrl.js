angular.module('app').controller('surveysCtrl', function($scope, surveyService) {

    getAllSurveyData = (column) => {
        $scope.surveyName = column || "OSAT"
        $scope.cohortName =  "WPR23" //While testing will need to be all cohorts and you can choose active or inactive.
        console.log($scope.surveyName)
        var surveyGraphData = surveyService.data;
        $scope.sd = surveyGraphData.filter(e => e.cohort === $scope.cohortName);
      }
    getAllSurveyData()

    $scope.changeSurveyName = () => {
        getAllSurveyData(event.target.value)
    }

    // $scope.changeCohortStatus = () => {
    //     // console.log(event.target.value)
    //     getAllSurveyData(event.target.value)
    // }
  


})