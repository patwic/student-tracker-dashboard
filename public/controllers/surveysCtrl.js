angular.module('app').controller('surveysCtrl', function($scope, surveyService) {

    $scope.surveyName;
    $scope.selectedProgram;
    $scope.allData = [];
    $scope.allPrograms = {ux: [], ios: [], qa: [], webdev: []};

    // -------------- Weekly Survey Graph -------------- //

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
    })


    getAllSurveyData = (program, column) => {
        $scope.surveyName = column || "OSAT"
        $scope.selectedProgram = program || 'all'
        let surveyData = [];
        if($scope.selectedProgram === "all") {
            surveyData = $scope.allPrograms;
        } else {
            surveyData = $scope.allPrograms[$scope.selectedProgram].filter(e => {
                return e.program === $scope.selectedProgram
            })
        }
        
        $scope.sd = surveyData
    }

    getAllSurveyData()

 

    $scope.changeSurveyName = () => {
        getAllSurveyData($scope.selectedProgram, event.target.value)
    }

    $scope.changeselectedProgram = () => {
        getAllSurveyData(event.target.value, $scope.surveyName)
    }
  

    // -------------- Survey Topic Graph -------------- //

    getTopicSurveyData = (selectedTopic, selectedLocation) => {
       $scope.topic = selectedTopic || 'Javascript'
       $scope.location = selectedLocation || 'all'
       
        $scope.topicData = surveyService.getSurveyByTopic($scope.topic).then(res => {
            if($scope.location === 'all') {
                $scope.topicData = res.data
            } else {
                $scope.topicData = res.data.filter(e => e.campus.split(',')[0] === $scope.location)
            }
        })
    }
    getTopicSurveyData()


    $scope.changeSelectedTopic = () => {
        getTopicSurveyData(event.target.value, $scope.location)
    }

    $scope.changeSelectedLocation = () => {
        getTopicSurveyData($scope.topic, event.target.value)
    }

    // -------------- Instructors Graph -------------- //

    getInstructors = () => {
        surveyService.getInstructors().then(res => {
            $scope.instructors = res.data
        })
    }
    getInstructors()

    getInstructorTopicData = (instructor, topic) => {
        $scope.instructorTopic = topic || 'React'
        $scope.selectedInstructor = instructor || '59f8d79f6ce02767109b8446'

        $scope.instructorData = 
        surveyService.instructorSurveys.filter(e => e.instructorId === $scope.selectedInstructor && e.topic === $scope.instructorTopic)
        console.log($scope.instructorData)

    }
    getInstructorTopicData()


    $scope.changeSelectedInstructor = () => {
        getInstructorTopicData(event.target.value, $scope.instructorTopic)
    }

    $scope.changeSelectedInstructorTopic = () => {
        getInstructorTopicData($scope.selectedInstructor, event.target.value)
    }
})