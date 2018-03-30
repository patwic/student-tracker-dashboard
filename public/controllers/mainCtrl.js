angular
  .module('app')
  .controller('mainCtrl', function(
    $scope,
    attendanceService,
    alertService,
    qService,
    sheetsService,
    $location,
    userService,
    surveyService,
    $window
  ) {
    $scope.user;
    $scope.isDropdown = false;
    $scope.helpQ;
    $scope.totalQ;
    $scope.waitQ;
    $scope.redAlerts;
    $scope.cohorts;
    $scope.allComments;
    $scope.activeCohorts;
    let getStudentPieData;
    let getLineChartCohortData;

    let cohortPreferences = [];

    // ---------------get user---------------//
    let getUser = () => userService.getUser()
      .then(res => {
        if(res !== 'NOPE') {
        getCohorts(res).then(response => {
          if(!response) return console.log('no user')
          $scope.user = response;
          $scope.user.cohort_ids = userService.parseCohorts(response.cohort_ids)
          $scope.cohortUserList = response.cohort_ids;
        })
        }
      })

    getUser();

    // ---------------get cohorts---------------//

    var getCohorts = user => userService.getCohorts().then((res) => {
      $scope.cohorts = res.data
      $scope.activeCohorts = $scope.cohorts.filter((c) => {
        return c.active == true
      })
      if (!user) {
        $scope.cohortId = $scope.activeCohorts[3].cohortId
      } else if (user.cohort_ids[0]){
        $scope.cohortId = user.cohort_ids[0]
      } else $scope.cohortId = $scope.activeCohorts[3].cohortId
      let newUser = getCohortAliases($scope.cohorts, user)
      getLineChartCohortData(apiStartDate, apiEndDate, $scope.cohortId)
      getStudentPieData()
      return newUser;
    })

    var getCohortAliases = (cohortsObj, user) => {
      if (!user) return user;
      const cId = user.cohort_ids;
      for (let i = 0; i < cId.length; i++) {
        for (let j = 0; j < cohortsObj.length; j++) {
          if (parseInt(cohortsObj[j].cohortId) == cId[i]) {
            user.cohort_ids.splice(i, 1, {
              id: cId[i],
              alias: cohortsObj[j].alias,
            });
          }
        }
      }
      return user;
    };

    $scope.showList = function() {
      document.getElementById('dropdownList').classList.toggle('show');
    };

    window.onclick = function(event) {
      if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName('dropdownList');
        let i;
        for (i = 0; i < dropdowns.length; i++) {
          let openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
          }
        }
      }
    };

    // ---------------show all cohorts/reset filters---------------//

    $scope.removeAllCohorts = function(user) {
      getUser();
      $scope.sideNavFilter.location = '';
      $scope.sideNavFilter.program = '';
    };

    $scope.getAllCohorts = function() {
      const allCohortIds = [];
      for (let i = 0; i < $scope.cohorts.length; i++) {
        let pairs = {
          id: $scope.cohorts[i].cohortId / 1,
          alias: $scope.cohorts[i].alias,
        };
        allCohortIds.push(pairs);
      }
      $scope.user.cohort_ids = userService.parseCohorts(allCohortIds);
    };

    // --------remove preference----------//

    $scope.addCohort = (cohortId, cohortAlias) => {
    let idFound = false
      for (let i = 0; i < $scope.user.cohort_ids.length; i++) {
        if ($scope.user.cohort_ids[i].id == cohortId) {
          idFound = true;
          break;
        }
      }
      if (!idFound) {
        let cohortPair = {
          id: cohortId,
          alias: cohortAlias,
        };
        $scope.user.cohort_ids.push(cohortPair);
        userService.postUserPrefs($scope.user.cohort_ids);
      } else console.log('Already added');
    };

    $scope.removeCohort = cohortId => {
      for (let i = 0; i < $scope.user.cohort_ids.length; i++) {
        if ($scope.user.cohort_ids[i].id === cohortId) {
          $scope.user.cohort_ids.splice(i, 1);
          userService.postUserPrefs($scope.user.cohort_ids);
          break;
        }
      }
    };

    // --------functions with dependencies----------//
    let mostAveraged;
    let mostHelp;
    let mostRequest;
    let getMentorPieData;

    // ---------------date variables----------------//

    $scope.autoStartDate = new Date();
    $scope.autoEndDate = $scope.autoStartDate.setDate($scope.autoStartDate.getDate() - 7);
    // converting the above date variables to correct format for api calls
    let apiEndDate = new Date().toISOString().substring(0, 10),
      apiStartDate = new Date($scope.autoEndDate).toISOString().substring(0, 10);

    // -----------------get progress and project scores for students------------//

    // *************************** USE WHEN SHEETS API IS WORKING!!!!!!!!!

    // sheetsService.getSheet().then((res) => {
    //   $scope.progressData = sheetsService.getProgress(res)
    // })

    // sheetsService.getSheet().then((res) => {
    //   $scope.projectData = sheetsService.getProjectScores(res);
    //   $scope.projectName = 'personalScore'
    //   document.getElementById('pp').style.background = 'linear-gradient(-45deg, #333, #444)'
    //   document.getElementById('pp').style.color = '#CCC'
    // })

    // -----------update sheets-------------//

    $scope.updateBar = id => {
      let p = document.getElementById('pp');
      let g = document.getElementById('gp');
      let n = document.getElementById('np');
      if (id === 'np') {
        $scope.projectName = 'noServerScore';
        n.style.background = 'linear-gradient(-45deg, #333, #444)';
        n.style.color = '#CCC';
        g.style.background = '#1a1a1a';
        g.style.color = '#282828';
        p.style.background = '#1a1a1a';
        p.style.color = '#282828';
      } else if (id === 'pp') {
        $scope.projectName = 'personalScore';
        p.style.background = 'linear-gradient(-45deg, #333, #444)';
        p.style.color = '#CCC';
        g.style.background = '#1a1a1a';
        g.style.color = '#282828';
        n.style.background = '#1a1a1a';
        n.style.color = '#282828';
      } else if (id === 'gp') {
        $scope.projectName = 'groupScore';
        g.style.background = 'linear-gradient(-45deg, #333, #444)';
        g.style.color = '#CCC';
        p.style.backpround = '#1a1a1a';
        p.style.color = '#282828';
        n.style.background = '#1a1a1a';
        n.style.color = '#282828';
      }
    };

    // -----------------dropdowns----------------//

    $scope.showDropdown = function() {
      if (!$scope.isDropdown) {
        document.getElementById('dropdown').classList.add('dropdown-transition');
      } else {
        document.getElementById('dropdown').classList.remove('dropdown-transition');
      }
      $scope.isDropdown = !$scope.isDropdown;
    };

    // -------------------socket data--------------------//

    let socket = io();
    socket.on('updatedQs', qArr => {
      $scope.helpQ = qArr[0];
      $scope.totalQ = qArr[1];
      $scope.waitQ = qArr[2];
      $scope.$apply();
    });

    socket.on('updateReds', rA => {
      $scope.redAlerts = rA;
      for (let i = 0; i < $scope.redAlerts.length; i++) {
        $scope.redAlerts[i].waitTime = Math.floor($scope.redAlerts[i].waitTime / 60000);
      }
      $scope.$apply();
    });

    // --------------Yellow Alerts----------------//

    const getAttendanceAlerts = () => {
      alertService.getAttendanceAlerts().then(response => {
        $scope.attendanceAlerts = response.data.absences;
      });
    };
    getAttendanceAlerts();

    const getProgressAlerts = () => {
      alertService.getProgressAlerts().then(response => {
        $scope.progressAlerts = response.data;
      });
    };
    // getProgressAlerts() //USE THIS TO GET PROGRESS ALERTS ONCE SHEETS API IS WORKING!!!!! ****************

    const getNoAttendanceAlert = () => {
      alertService.getNoAttendanceAlert().then(response => {
        $scope.noAttendanceAlerts = response.data;
      });
    };
    getNoAttendanceAlert();

    const getstudentQAlert = () => {
      alertService.getstudentQAlert().then(response => {
        $scope.studentQAlerts = response.data;
      });
    };
    getstudentQAlert();

    // --------------Preference SideNav Functions----------------//

    $scope.openNav = function() {
      document.getElementById('login-sidenav').style.width = '1000px';
      document.getElementById('login-sidenav').style.marginRight = '-500px';
      document.getElementById('login-sidenavOverlay').style.display = 'block';
      document.body.style.overflow = 'hidden';
      getUser();
    };

    $scope.closeNav = function() {
      document.getElementById('login-sidenav').style.width = '0';
      document.getElementById('login-sidenav').style.transition = '0.5s';
      document.getElementById('login-sidenavOverlay').style.display = 'none';
      document.body.style.overflow = 'visible';
    };

    //--------------Attendance Display Calendar----------------//

    function updateAttendanceData(attendanceData) {
      $scope.absences = [];
      $scope.absentStudents = {};
      for (const day of attendanceData) {
        if (day.absent.length > 0) {
          for (let i = 0; i < day.absent.length; i++) {
            if ($scope.absentStudents[day.absent[i]]) $scope.absentStudents[day.absent[i]].count++;
            else
              $scope.absentStudents[day.absent[i]] = {
                name: day.absent[i],
                count: 1,
              };
          }
          day.day = day.day.split('-').join('/');
          $scope.absences.push(day.day);
        }
      }
    }

    function updateAbsences() {
      attendanceService.getDays($scope.cohortId).then(res =>
        attendanceService.getDataFromDays(res.data).then(res2 => {
          updateAttendanceData(attendanceService.getAttendanceFromData(res2));
        })
      );
    }

    updateAbsences();

    // --------------q Time DatePicker----------------//

    const loadQTimeDatePicker = () => {
      $('#qTimeDateRange')
        .daterangepicker({
          startDate: $scope.autoStartDate,
          endDate: $scope.autoEndDate,
        })
        .on('apply.daterangepicker', function(ev, picker) {
          let endDate = new Date();
          let startDate = picker.startDate.format('YYYY-MM-DD');
          new Date(endDate.setDate(picker.endDate._d.getDate() + 1)).toISOString().substring(0, 10);
          getLineChartCohortData(startDate, endDate, $scope.cohortId);
        });
    };

    // --------------Mentor Help DatePicker----------------//

    const loadMentorDatePicker = () => {
      $('#mentorHelpDateRange')
        .daterangepicker({
          startDate: $scope.autoStartDate,
          endDate: $scope.autoEndDate,
        })
        .on('apply.daterangepicker', function(ev, picker) {
          let endDate = new Date();
          let startDate = picker.startDate.format('YYYY-MM-DD');
          new Date(endDate.setDate(picker.endDate._d.getDate() + 1)).toISOString().substring(0, 10);
          getMentorPieData(startDate, endDate, $scope.cohortId);
        });
    };

    // --------------Most Requested Average DatePicker----------------//

    const loadAverageDatePicker = () => {
      $('#daterange1')
        .daterangepicker({
          startDate: $scope.autoStartDate,
          endDate: $scope.autoEndDate,
        })
        .on('apply.daterangepicker', function(ev, picker) {
          let endDate = new Date();
          let startDate = picker.startDate.format('YYYY-MM-DD');
          endDate = new Date(endDate.setDate(picker.endDate._d.getDate() + 1)).toISOString().substring(0, 10);
          mostAveraged(startDate, endDate, $scope.cohortId);
        });
    };

    // --------------Most Requested Help DatePicker----------------//

    const loadHelpDatePicker = () => {
      $('#daterange2')
        .daterangepicker({
          startDate: $scope.autoStartDate,
          endDate: $scope.autoEndDate,
        })
        .on('apply.daterangepicker', function(ev, picker) {
          let endDate = new Date();
          let startDate = picker.startDate.format('YYYY-MM-DD');
          endDate = new Date(endDate.setDate(picker.endDate._d.getDate() + 1)).toISOString().substring(0, 10);
          mostHelp(startDate, endDate, $scope.cohortId);
        });
    };

    // --------------Most Reqested Requests DatePicker----------------//

    const loadRequestsDatePicker = () => {
      $('#daterange3')
        .daterangepicker({
          startDate: $scope.autoStartDate,
          endDate: $scope.autoEndDate,
        })
        .on('apply.daterangepicker', function(ev, picker) {
          let endDate = new Date();
          let startDate = picker.startDate.format('YYYY-MM-DD');
          endDate = new Date(endDate.setDate(picker.endDate._d.getDate() + 1)).toISOString().substring(0, 10);
          mostRequest(startDate, endDate, $scope.cohortId);
        });
    };

    // -----------load all date pickers------------------//

    const loadAllDatePickers = () => {
      loadQTimeDatePicker();
      loadMentorDatePicker();
      loadAverageDatePicker();
      loadHelpDatePicker();
      loadRequestsDatePicker();
    };

    loadAllDatePickers();

    // -------------------get student list for cohort id--------------//

    var allStudents = [];

    let getStudentsForCohort = cohortId => {
      // make an array of all student names from specific cohort
      return qService.getStudentsForCohort(cohortId).then(res => {
        allStudents = [];
        $scope.students = [];
        for (let i = 0; i < res.length; i++) {
          allStudents.push(`${res[i].firstName  } ${  res[i].lastName}`);
        }
        $scope.filteredStudents = allStudents;
        $scope.students = allStudents;
        return allStudents;
      });
    };

    // ---------------filtered students for cohort view from side menu-----------//

    let filteredStudents;

    // ---------------- get data for cohort surveys bar chart -------------//

    $scope.surveyName = '';

    if ($scope.cohortId) {
      getCohortSurveyData = () => {
        surveyService.getWeeklySurveyDataByCohortId($scope.cohortId).then(res => {
          $scope.sd = res.data;
          averages(res.data);
        });
      };
      getCohortSurveyData();
    }

    $scope.getBarChartSurveyData = () => {
      if (event) {
        $scope.surveyColumn = event.target.value || 'OSAT';
      }
    };
    $scope.getBarChartSurveyData();

    // ---------------- All Weekly Survey Chart.js ----------------//

    let averages = dataArr => {
      const arr = [];
      const obj = {};
      let max = 0;
      let min = 13;
      for (let i = 0; i < dataArr.length; i++) {
        const u = dataArr[i].unit;
        if (u > max) max = u;
        if (u < min) min = u;
        const d = dataArr[i];
        if (!obj[u]) obj[u] = {};
        obj[u].CSAT = obj[u].CSAT ? obj[u].CSAT + d.CSAT : d.CSAT;
        obj[u].FSAT = obj[u].FSAT ? obj[u].FSAT + d.FSAT : d.FSAT;
        obj[u].MSAT = obj[u].MSAT ? obj[u].MSAT + d.MSAT : d.MSAT;
        obj[u].OSAT = obj[u].OSAT ? obj[u].OSAT + d.OSAT : d.OSAT;
        obj[u].CSATcount = obj[u].CSATcount ? (obj[u].CSATcount += 1) : 1;
        obj[u].FSATcount = obj[u].FSATcount ? (obj[u].FSATcount += 1) : 1;
        obj[u].MSATcount = obj[u].MSATcount ? (obj[u].MSATcount += 1) : 1;
        obj[u].OSATcount = obj[u].OSATcount ? (obj[u].OSATcount += 1) : 1;
      }
      for (let i = min; i <= max; i++) {
        obj[i].CSAT = (obj[i].CSAT / obj[i].CSATcount).toFixed(2);
        obj[i].FSAT = (obj[i].FSAT / obj[i].FSATcount).toFixed(2);
        obj[i].MSAT = (obj[i].MSAT / obj[i].MSATcount).toFixed(2);
        obj[i].OSAT = (obj[i].OSAT / obj[i].OSATcount).toFixed(2);
        obj[i].unit = i;
        arr.push(obj[i]);
      }

      let csatData = [];
      let osatData = [];
      const fsatData = [];
      const msatData = [];

      arr.map(e => {
        csatData.push(e.CSAT);
        osatData.push(e.OSAT);
        fsatData.push(e.FSAT);
        msatData.push(e.MSAT);
      });

      $scope.surveyLineChart;
      let ctx = document.getElementById('surveyLineChart');
      if ($scope.surveyLineChart) {
        $scope.surveyLineChart.destroy();
      }
      $scope.surveyLineChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'],
          datasets: [
            {
              label: 'Overall',
              data: osatData,
              borderColor: '#21AAE1',
              fill: false,
            },
            {
              label: 'Instructor',
              data: fsatData,
              borderColor: '#1b6689',
              fill: false,
            },
            {
              label: 'Mentor',
              data: msatData,
              borderColor: '#6fbc80',
              fill: false,
            },
            {
              label: 'Curriculum',
              data: csatData,
              borderColor: '#b67ec9',
              fill: false,
            },
          ],
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  min: 0,
                  max: 10,
                },
              },
            ],
          },
        },
      });
    };
    // ---------------- get data for weekly survey comments ----------------//

    if ($scope.cohortId) {
      getWeeklyCommentsByCohortId = () => {
        $scope.allComments = surveyService.getWeeklyCommentsByCohortId($scope.cohortId).then(res => {
          $scope.allComments = res.data;
          $scope.getCommentsByWeek();
        });
      };
      getWeeklyCommentsByCohortId();
    }

    $scope.getCommentsByWeek = () => {
      const week = event.target.value || 1;
      $scope.comments = $scope.allComments.filter(e => e.unit == week);
    };

    // ----------------get data for cohort line chart-------------//

    $scope.cohortQData;
    let allQData;
    $scope.lineChartSelection = 'helpQ';
    getLineChartCohortData = (startDate, endDate, cohortId) => {
      qService.getQ(startDate, endDate, cohortId).then(res => {
        allQData = qService.setQs(res.data);
        $scope.cohortQData = allQData[$scope.lineChartSelection];
      });
    };

    $scope.lineChartDataChange = () => {
      $scope.cohortQData = allQData[event.target.value];
    };

    // ------------getting mentor pie data-----------------//

    // gets pie data for cohort mentors and their average help time per request
    getMentorPieData = (startDate, endDate, cohortId) => {
      qService.getQ(startDate, endDate, cohortId).then(res => {
        const mentors = qService.getAvgMentorTimes(res.data);
        mentors.sort((a, b) => b.count - a.count);
        while (mentors.length < 3) {
          mentors.push({
            name: '',
            sum: 0,
            count: 0,
            total: 0,
          });
        }
        for (let i = 0; i < 3; i++) {
          mentors[i].average = Math.floor(mentors[i].average);
        }
        $scope.mentors = mentors.slice(0, 3).sort((a, b) => b.average - a.average);
        $scope.mentorPieData = [mentors[0].average, mentors[1].average, mentors[2].average];
      });
    };
    getMentorPieData(apiStartDate, apiEndDate, $scope.cohortId);

    // -------------getting most requesting student pie data-------------//

    const getMostRequestingStudentData = (startDate, endDate, cohortId) =>  //gets student data ready to filter
       qService.getQ(startDate, endDate, cohortId).then(res => {
        return qService.getAvgStudentTimes(res.data);
      })
    ;

    const sortPieData = arr => {
      let other;
      let studs;
      for (let i = 0; i < arr.length; i++) {
        arr[i].percent = Math.floor(arr[i].percent * 100);
        if (arr[i].name === 'Other') {
          other = arr.splice(i, 1);
        }
      }
      studs = arr.sort((a, b) => b.percent - a.percent);
      return [studs[0], studs[1], studs[2], other[0]];
    };
    mostAveraged = (startDate, endDate, cohortId) => {
      // gets pie data for the most requested average q time
      getMostRequestingStudentData(startDate, endDate, cohortId).then(res => {
        $scope.mostAverageTotals = qService.sortAverageTotals(res);
        $scope.mostAverage = sortPieData(qService.getHighest(res, filteredStudents, 'average'));
      });
    };

    mostHelp = (startDate, endDate, cohortId) => {
      // gets pie data for the most requested help q time
      getMostRequestingStudentData(startDate, endDate, cohortId).then(res => {
        $scope.mostHelpedTotals = qService.sortHelpedTotals(res);
        $scope.mostHelped = sortPieData(qService.getHighest(res, filteredStudents, 'sum'));
      });
    };

    mostRequest = (startDate, endDate, cohortId) => {
      // gets pie data for the most q requests
      getMostRequestingStudentData(startDate, endDate, cohortId).then(res => {
        $scope.mostRequestTotals = qService.sortRequestTotals(res);
        $scope.mostRequests = sortPieData(qService.getHighest(res, filteredStudents, 'count'));
      });
    };

    getStudentPieData = () => {
      getStudentsForCohort($scope.cohortId).then(res => {
        filteredStudents = res;
        mostHelp(apiStartDate, apiEndDate, $scope.cohortId);
        mostAveraged(apiStartDate, apiEndDate, $scope.cohortId);
        mostRequest(apiStartDate, apiEndDate, $scope.cohortId);
      });
    };

    // --------------Cohort SideNav Functions----------------//

    let menuOpen = false;
    $scope.openCohortNav = function() {
      document.getElementById('cohort-sidenav').style.width = '400px';
      document.getElementById('cohort-sidenav').style.marginLeft = '-200px';
      document.getElementById('login-sidenavOverlay').style.display = 'block';
      document.body.style.overflow = 'hidden';
      document.getElementById('cohort-sidenav').style.boxShadow = '6px 6px 17px 2px rgba(0, 0, 0, .4)';
      // getUser()
      menuOpen = true;
    };

    $scope.openCohortStudentNav = function() {
      document.getElementById('cohort-sidenavStudent').style.width = '420px';
      document.getElementById('cohort-sidenav').style.boxShadow = 'none';
      document.getElementById('cohort-sidenavStudent').style.boxShadow = '6px 6px 17px 2px rgba(0, 0, 0, .4)';
    };

    $scope.closeCohortStudentNav = function() {
      document.getElementById('cohort-sidenavStudent').style.width = '0';
      document.getElementById('cohort-sidenav').style.width = '0';
      document.getElementById('login-sidenavOverlay').style.display = 'none';
      document.body.style.overflow = 'visible';
      document.getElementById('cohort-sidenavStudent').style.boxShadow = 'none';
      document.getElementById('cohort-sidenav').style.boxShadow = 'none';
      getStudentPieData();
      getMentorPieData(apiStartDate, apiEndDate, $scope.cohortId);
      loadAllDatePickers();
      updateAbsences();
      getLineChartCohortData(apiStartDate, apiEndDate, $scope.cohortId);
      getCohortSurveyData($scope.cohortId);
      getWeeklyCommentsByCohortId($scope.cohortId);
      menuOpen = false;
    };

    $window.onclick = event => {
      if (
        menuOpen &&
        !event.target.matches(
          '.cohort-sidenavContent, .cohort-fixedSideMenu, .cohort-fixedSideMenu>img, .cohort-sidenavClassList, .cohort-sidenavFilterBox, .cohort-sidenavClassList>div>h4, .cohort-sidenavFilterBox>h3, .cohort-sidenavFilterBox>select, .cohort-sidenavFilterBox>select>option, .cohort-sidenavFilterBox>h2'
        )
      ) {
        $scope.closeCohortStudentNav();
        menuOpen = false;
        $scope.$apply();
      }
    };

    $scope.setSelected = function(selectedCohortId) {
      $scope.selectedCohortId = selectedCohortId;
      $scope.cohortId = selectedCohortId;
      getStudentsForCohort($scope.cohortId);
    };

    $scope.selectedStudents = null;
    $scope.getSelected = function(selectedStudents) {
      $scope.selectedStudents = selectedStudents;
    };

    // --------------Pie Chart show all Students----------------//

    $scope.openStudentList = function() {
      document.getElementById('myNav').style.height = '100%';
    };

    $scope.closeStudentList = function() {
      document.getElementById('myNav').style.height = '0%';
    };

    $scope.openMidStudentList = function() {
      document.getElementById('myNav2').style.height = '100%';
    };

    $scope.closeMidStudentList = function() {
      document.getElementById('myNav2').style.height = '0%';
    };

    $scope.openLastStudentList = function() {
      document.getElementById('myNav3').style.height = '100%';
    };

    $scope.closeLastStudentList = function() {
      document.getElementById('myNav3').style.height = '0%';
    };
  });
