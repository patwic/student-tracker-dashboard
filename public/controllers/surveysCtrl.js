angular.module('app').controller('surveysCtrl', function($scope, surveyService) {

$scope.surveyName;
$scope.cohortName;
$scope.selectedProgram;


// $scope.sd = surveyService.getWeeklySurveyData().then(res => {

//     // console.log(res.data)
//     let name = "ux" 

//     let stuff = res.data.filter(e => {
//        return  e.program === name   
//     })

//     $scope.sd = stuff
//     console.log($scope.sd)
// })

    getAllSurveyData = (program, column) => {
        $scope.surveyName = column || "OSAT"
        $scope.selectedProgram = program || 'ux'

        $scope.sd = surveyService.getWeeklySurveyData().then(res => {
            
                // console.log(res.data)
                // let name =  program || "ux" 
            
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