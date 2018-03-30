angular.module('app').controller('surveysCtrl', ($scope, surveyService) => {

    $scope.surveyName;
    $scope.selectedProgram;
    $scope.allData = [];
    $scope.allPrograms = {
        ux: [],
        ios: [],
        qa: [],
        webdev: []
    };
    $scope.modules;
    $scope.topics;

    const approvedInstructorTopics = ['Javascript', 'Git', 'HTML/CSS', 'CSS', 'React', 'Angular', 'Passport', 'Node', 'SQL', 'Data structures and Algorithms', 'Unit Testing']

    const approvedTopics = ['Javascript', 'Git', 'HTML/CSS', 'CSS', 'React', 'Angular', 'Passport', 'Node', 'SQL', 'Data structures and Algorithms', 'Unit Testing', 'SQL - Mini', 'Big O Notation', 'Amazon Web Services', 'jQuery', 'Mini-Lectures']

    // -------------- Get Modules -------------- //

    surveyService.getModules().then(res => {
        $scope.modules = res.data
        getInitialModuleList()
    })


    // -------------- Get Instructors -------------- //

        surveyService.getInstructors().then(res => {
            $scope.instructors = res.data
        })


    // -------------- Get Topics -------------- //

    surveyService.getTopics().then(res => {
        let topics = res.data
        $scope.topics = [];
        $scope.instructorTopics = [];
        for(var i = 0; i < topics.length; i++) {
            for(var j = 0; j < approvedInstructorTopics.length; j++) {
                if(topics[i].name === approvedTopics[j]){
                    $scope.instructorTopics.push(topics[i])
                }
            }
            for(var x = 0; x < approvedTopics.length; x++) {
                if(topics[i].name === approvedTopics[x]) {
                    $scope.topics.push(topics[i])
                }
            }
        }
    })


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
        makeSurveyLineChart($scope.allData)
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

    // -------------- Survey Line Chart -------------- //

    $scope.selectedLineProgram;

    $scope.changeSelectedLineProgram = () => {
        $scope.selectedLineProgram = event.target.value;
        makeSurveyLineChart($scope.allData)
    }

    makeSurveyLineChart = (arr) => {
        let data = arr
        !$scope.selectedLineProgram ? $scope.selectedLineProgram = 'webdev' : null
        let surveyData = [];
            surveyData = $scope.allPrograms[$scope.selectedLineProgram].filter(e => {
                return e.program === $scope.selectedLineProgram
            })
        filteredData = surveyData


        let averages = (dataArr) => {
            let arr = []
            let obj = {}
            let max = 0;
            let min = 7;
            for (let i = 0; i < dataArr.length; i++) {
                let u = dataArr[i].unit
                if (u > max && u < 14)
                    max = u
                if (u > max && u > 13)
                    max = 13
                if (u < min)
                    min = u
                let d = dataArr[i]
                if (!obj[u])
                    obj[u] = {}
                obj[u].CSAT = obj[u].CSAT ? obj[u].CSAT + d.CSAT : d.CSAT
                obj[u].FSAT = obj[u].FSAT ? obj[u].FSAT + d.FSAT : d.FSAT
                obj[u].MSAT = obj[u].MSAT ? obj[u].MSAT + d.MSAT : d.MSAT
                obj[u].OSAT = obj[u].OSAT ? obj[u].OSAT + d.OSAT : d.OSAT
                obj[u].CSATcount = obj[u].CSATcount ? obj[u].CSATcount += 1 : 1
                obj[u].FSATcount = obj[u].FSATcount ? obj[u].FSATcount += 1 : 1
                obj[u].MSATcount = obj[u].MSATcount ? obj[u].MSATcount += 1 : 1
                obj[u].OSATcount = obj[u].OSATcount ? obj[u].OSATcount += 1 : 1
            }

            for (let i = min; i <= max; i++) {
                if (dataArr[i].program === 'ios'){
                    if (!obj[i]) {
                        obj[i] = {
                           CSAT: 0,
                            FSAT : 0,
                            MSAT : 0,
                            OSAT : 0,
                            CSATcount : 0,
                            FSATcount : 0,
                            MSATcount : 0,
                            OSATcount : 0,
                            program : "ios",
                            unit : i
                        }
                    }
                }
                obj[i].CSAT = (obj[i].CSAT / obj[i].CSATcount).toFixed(2)
                obj[i].FSAT = (obj[i].FSAT / obj[i].FSATcount).toFixed(2)
                obj[i].MSAT = (obj[i].MSAT / obj[i].MSATcount).toFixed(2)
                obj[i].OSAT = (obj[i].OSAT / obj[i].OSATcount).toFixed(2)
                obj[i].unit = i
                obj[i].program = dataArr[i].program;
                arr.push(obj[i])
            }

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

    $scope.lineWeeklyChart;
    var ctx = document.getElementById('lineWeeklyChart');
      if ($scope.lineWeeklyChart) { $scope.lineWeeklyChart.destroy(); }
      $scope.lineWeeklyChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'],
          datasets: [{
            label: 'Overall',
            data: osatData,
            borderColor: "#21AAE1",
            fill: false
          }, {
            label: 'Instructor',
            data: fsatData,
            borderColor: "#1b6689",
            fill: false
          }, {
              label: 'Mentor',
              data: msatData,
              borderColor: "#6fbc80",
              fill: false
          }, {
              label: 'Curriculum',
              data: csatData,
              borderColor: "#b67ec9",
              fill: false
          }]
        },
        options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true,
                      min: 0,
                      max: 10
                  }
                }]
             }
            }
      });
    }
      averages(filteredData)

    }


    // -------------- Survey Topic Data -------------- //

    getTopicSurveyData = (selectedTopic, selectedLocation) => {
        $scope.topic = selectedTopic || '56fb1628c63976af2f88b31c'
        $scope.location = selectedLocation || 'Provo'

        $scope.topicData = surveyService.getSurveyByTopic($scope.topic).then(res => {
                $scope.topicData = res.data.filter(e => e.campus.split(',')[0] === $scope.location)
                makeDataObject($scope.topicData)
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

        arr.sort((a,b) => {
            a = new Date(a.date);
            b = new Date(b.date);
            return a-b;
        });

        arr.map(e => {
            e.date = new Date(e.date).toDateString()
        })

        let allDataArr = [];
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].instructor.name) {
                allDataArr.push({
                    'date': arr[i].date,
                    'overall': Number(arr[i].overall),
                    'explained': Number(arr[i].explain),
                    'prepared': Number(arr[i].prepared),
                    'instructor': arr[i].instructor.name
                })
            }
        }

       let averages = (dataArr) => {

            var today = new Date().toDateString()

            var priorDate = new Date();
            priorDate.setDate(priorDate.getDate() - 180);
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
                obj[u].date = d.date

            }

            for (let prop in obj) {
                obj[prop].overall = (obj[prop].overall / obj[prop].overallcount).toFixed(2)
                obj[prop].explained = (obj[prop].explained / obj[prop].explainedcount).toFixed(2)
                obj[prop].prepared = (obj[prop].prepared / obj[prop].preparedcount).toFixed(2)

                if (Date.parse(obj[prop].date) > Date.parse(pastDate)) {
                    arr.push(obj[prop])
                }
            }

            var overallData = [];
            var preparedData = [];
            let explainedData = [];
            let dates = [];

            arr.map(e => {

                let date = e.date.toString().split(' ').splice(1).join(' ')

                overallData.push(e.overall)
                preparedData.push(e.prepared)
                explainedData.push(e.explained)
                dates.push(date.toString().split(' ').splice(0, 2).join(' ') + ': ' + e.instructor)
            })


            $scope.surveyLineChart;
            var ctx = document.getElementById('surveyTopicLineChart');
            if ($scope.surveyLineChart) { $scope.surveyLineChart.destroy(); }
            $scope.surveyLineChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: dates,
                    datasets: [{
                        label: 'Overall',
                        data: overallData,
                        borderColor: "#21AAE1",
                        fill: false
                    }, {
                        label: 'Prepared',
                        data: preparedData,
                        borderColor: "#1b6689",
                        fill: false
                    }, {
                        label: 'Explained',
                        data: explainedData,
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

    // -------------- Instructors Data -------------- //

    $scope.selectedModule = '';
    $scope.instructorData;

    getInitialModuleList = () => {
        $scope.filteredModules = $scope.modules.filter(e => {
            return e.topicId === '56fb1628c63976af2f88b31c'
        })
    }

    getInstructorTopicData = (instructor, topic) => {
        $scope.instructorTopic = topic || '56fb1628c63976af2f88b31c'
        $scope.selectedInstructor = instructor || '59f24cb377f2691d80dab8c9'

        surveyService.getInstructorGraphData($scope.instructorTopic).then(res => {
            $scope.instructorData = res.data.filter(e => e.instructor._id === $scope.selectedInstructor)
            makeInstructorObject($scope.instructorData)
        })
    }
    getInstructorTopicData()

    $scope.changeSelectedInstructor = () => {
        getInstructorTopicData(event.target.value, $scope.instructorTopic)
    }

    $scope.changeSelectedInstructorTopic = () => {
        getInstructorTopicData($scope.selectedInstructor, event.target.value)

        $scope.filteredModules = $scope.modules.filter(e => {
            return e.topicId === $scope.instructorTopic
        })
    }


     // -------------- Instructors Graph -------------- //

     $scope.changeSelectedModule = () => {
         if(!event.target.value) {
            makeInstructorObject($scope.instructorData)
         } else {
        let moduleData = $scope.instructorData.filter(e => {
            return e.module.name == event.target.value
        })
        makeInstructorObject(moduleData)
    }
    }

    makeInstructorObject = (arr) => {

        arr.sort((a,b) => {
            a = new Date(a.date);
            b = new Date(b.date);
            return a-b;
        });

        arr.map(e => {
            e.date = new Date(e.date).toDateString()
        })



        let allDataArr = [];
        for (let i = 0; i < arr.length; i++) {
            let date = arr[i].date.toString().split(' ').splice(1).join(' ')
            allDataArr.push({
                'date': date.toString().split(' ').splice(0, 2).join(' '),
                'overall': Number(arr[i].overall),
                'explained': Number(arr[i].explain),
                'prepared': Number(arr[i].prepared),
                'module': arr[i].module.name
            })
        }

        let averages = (dataArr) => {

            var today = new Date().toDateString()

            var priorDate = new Date();
            priorDate.setDate(priorDate.getDate() - 180);
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
                obj[u].date = d.date
                obj[u].module = d.module

            }

            for (let prop in obj) {
                obj[prop].overall = (obj[prop].overall / obj[prop].overallcount).toFixed(2)
                obj[prop].explained = (obj[prop].explained / obj[prop].explainedcount).toFixed(2)
                obj[prop].prepared = (obj[prop].prepared / obj[prop].preparedcount).toFixed(2)

                // if (Date.parse(obj[prop].date) > Date.parse(pastDate)) {
                arr.push(obj[prop])
                // }
            }

            var overallData = [];
            var preparedData = [];
            let explainedData = [];
            let dates = [];
            arr.map(e => {
                overallData.push(e.overall)
                preparedData.push(e.prepared)
                explainedData.push(e.explained)
                dates.push(e.date + ': ' + e.module)
            })

            $scope.instructorBar;
            var ctx = document.getElementById("instructorBar").getContext("2d");
            if ($scope.instructorBar) { $scope.instructorBar.destroy(); }
            $scope.instructorBar = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: dates,
                    datasets: [{
                        label: "Overall",
                        backgroundColor: "#21AAE1",
                        data: overallData
                    }, {
                        label: "Prepared",
                        backgroundColor: "#1b6689",
                        data: preparedData
                    }, {
                        label: "Explained",
                        backgroundColor: '#0f4a66',
                        data: explainedData
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
});
