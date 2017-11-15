angular.module('app').controller('surveysCtrl', function ($scope, surveyService) {

    $scope.surveyName;
    $scope.selectedProgram;
    $scope.allData = [];
    $scope.allPrograms = {
        ux: [],
        ios: [],
        qa: [],
        webdev: []
    };

    // -------------- Weekly Survey Graph -------------- //

    surveyService.getWeeklySurveyData().then(res => {
        $scope.allData = res.data
        let ios = $scope.allData.filter(e => {
            return e.program === "ios"
        })
        let webdev = $scope.allData.filter(e => {
            return e.program === "webdev"
        })
        let qa = $scope.allData.filter(e => {
            return e.program === "qa"
        })
        let ux = $scope.allData.filter(e => {
            return e.program === "ux"
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
        if ($scope.selectedProgram === "all") {
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


    // -------------- Survey Topic Data -------------- //

    getTopicSurveyData = (selectedTopic, selectedLocation) => {
        $scope.topic = selectedTopic || 'Javascript'
        $scope.location = selectedLocation || 'all'

        $scope.topicData = surveyService.getSurveyByTopic($scope.topic).then(res => {
            if ($scope.location === 'all') {
                $scope.topicData = res.data
                makeDataObject(res.data)
            } else {
                $scope.topicData = res.data.filter(e => e.campus.split(',')[0] === $scope.location)
                makeDataObject(res.data)
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

    // -------------- Survey Topic Graph -------------- //

    makeDataObject = (arr) => {
        arr.map(e => {
            e.date = new Date(e.date).toDateString()
        })

        let allDataArr = [];
        for (let i = 0; i < arr.length; i++) {

            allDataArr.push({
                'date': arr[i].date,
                'overall': Number(arr[i].overall),
                'explained': Number(arr[i].explain),
                'prepared': Number(arr[i].prepared),
                'instructor': arr[i].instructor
            })
        }

        averages = (dataArr) => {

            var today = new Date().toDateString()

            var priorDate = new Date();
            priorDate.setDate(priorDate.getDate() - 200);
            var pastDate = priorDate.toDateString()

            let arr = []
            let obj = {}
            let max = today;
            let min = pastDate;
            for (let i = 0; i < dataArr.length; i++) {
                let u = dataArr[i].date
                if (u > max) max = u
                if (u < min) min = u
                let d = dataArr[i]
                if (!obj[u]) obj[u] = {}
                obj[u].overall = obj[u].overall ? obj[u].overall + d.overall : d.overall
                obj[u].explained = obj[u].explained ? obj[u].explained + d.explained : d.explained
                obj[u].prepared = obj[u].prepared ? obj[u].prepared + d.prepared : d.prepared
                obj[u].overallcount = obj[u].overallcount ? obj[u].overallcount += 1 : 1
                obj[u].explainedcount = obj[u].explainedcount ? obj[u].explainedcount += 1 : 1
                obj[u].preparedcount = obj[u].preparedcount ? obj[u].preparedcount += 1 : 1
                obj[u].instructor = d.instructor
            }
 
            for (let i = min; i <= max; i++) {
                console.log(min)
                console.log(max)
                console.log(obj)
                console.log(obj[i])
                obj[i].overall = (obj[i].overall / obj[i].overallcount).toFixed(2)
                obj[i].explained = (obj[i].explained / obj[i].explainedcount).toFixed(2)
                obj[i].prepared = (obj[i].prepared / obj[i].preparedcount).toFixed(2)
                obj[i].date = i

                arr.push(obj[i])
            }




            console.log(arr)


            var csatData = [];
            var osatData = [];
            let fsatData = [];
            let msatData = [];

            arr.map(e => {
                csatData.push(e.CSAT)
                osatData.push(e.OSAT)
                fsatData.push(e.FSAT)
                msatData.push(e.MSAT)
            })


            /////

            var ctx = document.getElementById('surveyTopicLineChart');
            var surveyLineChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'],
                    datasets: [{
                        label: 'Overall',
                        data: [1, 2, 3],
                        borderColor: "#21AAE1",
                        fill: false
                    }, {
                        label: 'Prepared',
                        data: [4, 2, 5],
                        borderColor: "#1b6689",
                        fill: false
                    }, {
                        label: 'Explained',
                        data: [5, 2, 4],
                        borderColor: "#6fbc80",
                        fill: false
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                min: 0,
                                max: 5
                            }
                        }]
                    }
                }
            });
        }

        averages(allDataArr)
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
        $scope.selectedInstructor = instructor || '59f24cb377f2691d80dab8c9'

        surveyService.getInstructorGraphData().then(res => {
            $scope.instructorData = res.data.filter(e => e.instructorId === $scope.selectedInstructor && e.topic === $scope.instructorTopic)
        })
    }
    getInstructorTopicData()

    $scope.changeSelectedInstructor = () => {
        getInstructorTopicData(event.target.value, $scope.instructorTopic)
    }

    $scope.changeSelectedInstructorTopic = () => {
        getInstructorTopicData($scope.selectedInstructor, event.target.value)
    }
})