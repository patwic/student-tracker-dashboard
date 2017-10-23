angular.module('app').controller('surveysCtrl', function($scope, surveyService) {

    $scope.surveyName;
    $scope.selectedProgram;
    $scope.allData = [];
    $scope.allPrograms = {ux: []};

    surveyService.getWeeklySurveyData().then(res => {
        $scope.allData = res.data
        let ios = $scope.allData.filter(e => {
            return  e.program === "ios"
        })
        let webdev = $scope.allData.filter(e => {
            return  e.program === "webdev"
        })
        let qa = $scope.allData.filter(e => {
            return  e.program === "qa"
        })
        let ux = $scope.allData.filter(e => {
            return  e.program === "ux"
        })

        $scope.allPrograms = {
            ios,
            webdev,
            qa,
            ux
        }
        
        $scope.sd = $scope.allPrograms
        console.log('$scope 1', $scope.sd)
    })


    getAllSurveyData = (program, column) => {
        $scope.surveyName = column || "OSAT"
        $scope.selectedProgram = program || 'all'
        console.log("SUPER DUPER IMPORTANT", $scope.allPrograms);
        let stuff = [];
        if($scope.selectedProgram === "all") {
            stuff = $scope.allPrograms;
        } else {
            stuff = $scope.allPrograms[$scope.selectedProgram].filter(e => {
                return e.program === $scope.selectedProgram
            })
        }
        
        $scope.sd = stuff
        console.log('$scope 2', $scope.sd)
        
        // console.log("all data filtered", $scope.sd)
        
    }

    getAllSurveyData()

 

    $scope.changeSurveyName = () => {
        getAllSurveyData($scope.selectedProgram, event.target.value)
    }

    $scope.changeselectedProgram = () => {
        getAllSurveyData(event.target.value, $scope.surveyName)
    }
  


})