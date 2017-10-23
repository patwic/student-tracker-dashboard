angular.module('app').controller('surveysCtrl', function($scope, surveyService) {

$scope.surveyName;
$scope.selectedProgram;

    getAllSurveyData = (program, column) => {
        $scope.surveyName = column || "OSAT"
        $scope.selectedProgram = program || 'ux'

        $scope.sd = surveyService.getWeeklySurveyData().then(res => {

            let stuff = res.data.filter(e => {
                return  e.program === $scope.selectedProgram   
            })
            
            $scope.sd = stuff
            console.log($scope.sd)
        })
      }

    getAllSurveyData()

 

    $scope.changeSurveyName = () => {
        getAllSurveyData($scope.selectedProgram, event.target.value)
    }

    $scope.changeselectedProgram = () => {
        getAllSurveyData(event.target.value, $scope.surveyName)
    }
  



})