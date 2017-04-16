angular.module('app').controller('mainCtrl', function ($scope, attendanceService, alertService, qService, sheetsService, $location) {

  $scope.user = 'Jeremy Robertson'
  $scope.isDropdown = false;
  $scope.helpQ;
  $scope.totalQ;
  $scope.waitQ;
  $scope.redAlerts;

  //--------functions with dependencies----------//
  let mostAveraged
  let mostHelp
  let mostRequest
  let getMentorPieData

  //---------------date variables----------------//

  $scope.autoStartDate = new Date();
  $scope.autoEndDate = $scope.autoStartDate.setDate($scope.autoStartDate.getDate() - 7);
  //converting the above date variables to correct format for api calls
  let apiEndDate = new Date().toISOString().substring(0, 10),
      apiStartDate = new Date($scope.autoEndDate).toISOString().substring(0, 10)

  //-----------------get progress and project scores for students------------//

  sheetsService.getSheet().then((res) => {
    $scope.progressData = sheetsService.getProgress(res)
  })

  sheetsService.getSheet().then((res) => {
    $scope.projectData = sheetsService.getProjectScores(res);
  })


  //-----------------dropdowns----------------//

  $scope.showDropdown = function () {
    if (!$scope.isDropdown) {
      document.getElementById('dropdown').classList.add('dropdown-transition')
    } else {
      document.getElementById('dropdown').classList.remove('dropdown-transition')
    }
    $scope.isDropdown = !$scope.isDropdown
  }

  if ($location.path() === '/') $scope.activateLink = true;
  else $scope.activateLink = false;
  $scope.changeLink = function (status) {
    $scope.activateLink = status;
  }

  //-------------------socket data--------------------//

  let socket = io()
  socket.on('updatedQs', (qArr) => {
    $scope.helpQ = qArr[0]
    $scope.totalQ = qArr[1]
    $scope.waitQ = qArr[2]
    $scope.$apply();
  })

  socket.on('updateReds', (rA) => {
    $scope.redAlerts = rA;
    for (let i = 0; i < $scope.redAlerts.length; i++) {
      $scope.redAlerts[i].waitTime = Math.floor($scope.redAlerts[i].waitTime / 60000);
    }
    $scope.$apply();
  })

  //--------------Yellow Alerts----------------//

  let getAttendanceAlerts = () => {
    alertService.getAttendanceAlerts().then((response) => {
      $scope.attendanceAlerts = response.data.absences;
    })
  }
  getAttendanceAlerts()

  let getProgressAlerts = () => {
    alertService.getProgressAlerts().then((response) => {
      $scope.progressAlerts = response.data;
    })
  }
  getProgressAlerts()

  let getNoAttendanceAlert = () => {
    alertService.getNoAttendanceAlert().then((response) => {
      $scope.noAttendanceAlerts = response.data;
    })
  }
  getNoAttendanceAlert()

  let getstudentQAlert = () => {
    alertService.getstudentQAlert().then((response) => {
      $scope.studentQAlerts = response.data;
    })
  }
  getstudentQAlert()



  //--------------Preference SideNav Functions----------------//

  $scope.openNav = function () {
    document.getElementById("login-sidenav").style.width = "1000px";
    document.getElementById("login-sidenav").style.marginRight = "-500px";
    document.getElementById("login-sidenavOverlay").style.display = "block";
    document.body.style.overflow = 'hidden';
  }

  $scope.closeNav = function () {
    document.getElementById("login-sidenav").style.width = "0";
    document.getElementById("login-sidenav").style.transition = "1.5s";
    document.getElementById("login-sidenavOverlay").style.display = "none";
    document.body.style.overflow = 'visible';
  }



  //--------------Attendance Display Calendar----------------//

  var absences = ['2017/04/02', '2017/04/04']

  $('#attendanceCalendar').datepicker({
    inline: true,
    firstDay: 1,
    showOtherMonths: true,
    dateFormat: 'yy-mm-dd',
    dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    beforeShowDay: highlightDays

  });

  function highlightDays(date) {
    for (var i = 0; i < absences.length; i++) {
      if (new Date(absences[i]).toString() == date.toString()) {
        return [true, 'highlight'];
      }
    }
    return [true, ''];
  }


  //--------------q Time DatePicker----------------//

  let loadQTimeDatePicker = () => {
    $('#qTimeDateRange').daterangepicker({
      startDate: $scope.autoStartDate,
      endDate: $scope.autoEndDate
    })
  }

  $('#qTimeDateRange').on('apply.daterangepicker', function (ev, picker) {
    let endDate = new Date()
    picker.startDate.format('YYYY-MM-DD')
    new Date(endDate.setDate(picker.endDate._d.getDate() + 1)).toISOString().substring(0, 10)
  })

  //--------------Mentor Help DatePicker----------------//


  let loadMentorDatePicker = () => {
    $('#mentorHelpDateRange').daterangepicker({
      startDate: $scope.autoStartDate,
      endDate: $scope.autoEndDate
    })
  }

  $('#mentorHelpDateRange').on('apply.daterangepicker', function (ev, picker) {
    let endDate = new Date()
    let startDate = picker.startDate.format('YYYY-MM-DD')
    new Date(endDate.setDate(picker.endDate._d.getDate() + 1)).toISOString().substring(0, 10)
    getMentorPieData(startDate, endDate, $scope.cohortId)
  })

  //--------------Most Requested Average DatePicker----------------//

  let loadAverageDatePicker = () => {
    $('#daterange1').daterangepicker({
      startDate: $scope.autoStartDate,
      endDate: $scope.autoEndDate
    });
  }

  $('#daterange1').on('apply.daterangepicker', function (ev, picker) {
    let endDate = new Date()
    let startDate = picker.startDate.format('YYYY-MM-DD')
    endDate = new Date(endDate.setDate(picker.endDate._d.getDate() + 1)).toISOString().substring(0, 10)
    mostAveraged(startDate, endDate, $scope.cohortId)
  })

  //--------------Most Requested Help DatePicker----------------//

  let loadHelpDatePicker = () => {
    $('#daterange2').daterangepicker({
      startDate: $scope.autoStartDate,
      endDate: $scope.autoEndDate
    });
  }

  $('#daterange2').on('apply.daterangepicker', function (ev, picker) {
    let endDate = new Date()
    let startDate = picker.startDate.format('YYYY-MM-DD')
    endDate = new Date(endDate.setDate(picker.endDate._d.getDate() + 1)).toISOString().substring(0, 10)
    mostHelp(startDate, endDate, $scope.cohortId)
  })

  //--------------Most Reqested Requests DatePicker----------------//

  let loadRequestsDatePicker = () => {
    $('#daterange3').daterangepicker({
      startDate: $scope.autoStartDate,
      endDate: $scope.autoEndDate
    });
  }

  $('#daterange3').on('apply.daterangepicker', function (ev, picker) {
    let endDate = new Date()
    let startDate = picker.startDate.format('YYYY-MM-DD')
    endDate = new Date(endDate.setDate(picker.endDate._d.getDate() + 1)).toISOString().substring(0, 10)
    mostRequest(startDate, endDate, $scope.cohortId)
  })

  //-----------load all date pickers------------------//

  let loadAllDatePickers = () => {
    loadQTimeDatePicker()
    loadMentorDatePicker()
    loadAverageDatePicker()
    loadHelpDatePicker()
    loadRequestsDatePicker()
  }

  loadAllDatePickers()

  //--------------All Select Menus----------------//


  $('select').each(function () {

    var $this = $(this),
      numberOfOptions = $(this).children('option').length;

    $this.addClass('s-hidden');

    $this.wrap('<div class="select"></div>');

    $this.after('<div class="styledSelect"></div>');

    var $styledSelect = $this.next('div.styledSelect');

    $styledSelect.text($this.children('option').eq(0).text());

    var $list = $('<ul />', {
      'class': 'options'
    }).insertAfter($styledSelect);

    for (var i = 0; i < numberOfOptions; i++) {
      $('<li />', {
        text: $this.children('option').eq(i).text(),
        rel: $this.children('option').eq(i).val()
      }).appendTo($list);
    }

    var $listItems = $list.children('li');

    $styledSelect.click(function (e) {
      e.stopPropagation();
      $('div.styledSelect.active').each(function () {
        $(this).removeClass('active').next('ul.options').hide();
      });
      $(this).toggleClass('active').next('ul.options').toggle();
    });

    $listItems.click(function (e) {
      e.stopPropagation();
      $styledSelect.text($(this).text()).removeClass('active');
      $this.val($(this).attr('rel'));
      $list.hide();
    });

    $(document).click(function () {
      $styledSelect.removeClass('active');
      $list.hide();
    });

    //-------------------get student list for cohort id--------------//


    $scope.cohortId = 106;

    var allStudents = [];


    var getStudentsForCohort = () => { //make an array of all student names from specific cohort
      return qService.getStudentsForCohort($scope.cohortId).then(res => {
        for (let i = 0; i < res.length; i++) {
          allStudents.push(res[i].firstName + ' ' + res[i].lastName)
        }

        return allStudents;
      })
    }

    $scope.getCohortStudents = function () {
      $scope.students = allStudents;
      // console.log($scope.students)
    }
    $scope.getCohortStudents()


    var cohortPreferences = [{ //!!!!!!!DUMMY DATA!!!!!
        cohortId: 91,
        nickname: "DM-19"
      },
      {
        cohortId: 92,
        nickname: "DM-20"
      },
      {
        cohortId: 106,
        nickname: "DM-21"
      },
      {
        cohortId: 110,
        nickname: "DM-22"
      }
    ]


    $scope.getCohortPreferences = function () {
      $scope.cohortPreferences = cohortPreferences
    }

    $scope.getCohortPreferences();


    //---------------filtered students for cohort view from side menu-----------//

    $scope.filteredStudents = [] //!!!!!!!DUMMY DATA!!!!!
    let filteredStudents = $scope.filteredStudents;


    //----------------get data for cohort line chart-------------//

    let getLineChartCohortData = (startDate, endDate, cohortId, qData) => {
      qService.getQ(startDate, endDate, cohortId).then(res => {
        console.log(res)
        let data = qService.setQs(res.data)
        console.log(data)
        $scope.cohortQData = data.qData
        //setQs function is broken, getting correct data from getQ but setQs is not working. Fix to get chart working
      })
    }

    getLineChartCohortData(apiStartDate, apiEndDate, $scope.cohortId, "helpQ")



    //------------getting mentor pie data-----------------//

    // gets pie data for cohort mentors and their average help time per request
    getMentorPieData = (startDate, endDate, cohortId) => {
      qService.getQ(startDate, endDate, cohortId).then(res => {
        let mentors = qService.getAvgMentorTimes(res.data)
        mentors.sort((a, b) => {
          return b.count - a.count
        })
        while (mentors.length < 3) {
          mentors.push({
            name: '',
            sum: 0,
            count: 0,
            total: 0
          })
        }
        for (let i = 0; i < 3; i++) {
          mentors[i].average = Math.floor(mentors[i].average)
        }
        $scope.mentors = mentors.slice(0, 3).sort((a, b) => {
          return b.average - a.average;
        });
        $scope.mentorPieData = [mentors[0].average, mentors[1].average, mentors[2].average]
      })
    }
    getMentorPieData(apiStartDate, apiEndDate, $scope.cohortId)

    //-------------getting most requesting student pie data-------------//

    let getMostRequestingStudentData = (startDate, endDate, cohortId) => { //gets student data ready to filter
      return qService.getQ(startDate, endDate, cohortId).then(res => {
        return qService.getAvgStudentTimes(res.data);
      })
    }

    let sortPieData = (arr) => {
      let other;
      let studs;
      for (let i = 0; i < arr.length; i++) {
        arr[i].percent = Math.floor(arr[i].percent * 100)
        if (arr[i].name === 'Other') {
          other = arr.splice(i, 1)
        }
      }
      studs = arr.sort((a, b) => {
        return b.percent - a.percent;
      })
      return [studs[0], studs[1], studs[2], other[0]]
    }

    mostAveraged = (startDate, endDate, cohortId) => { //gets pie data for the most requested average q time
      getMostRequestingStudentData(startDate, endDate, cohortId).then(res => {
        $scope.mostAverage = sortPieData(qService.getHighest(res, filteredStudents, 'average'))
      })
    }

    mostHelp = (startDate, endDate, cohortId) => { //gets pie data for the most requested help q time
      getMostRequestingStudentData(startDate, endDate, cohortId).then(res => {
        $scope.mostHelped = sortPieData(qService.getHighest(res, filteredStudents, 'sum'))
      })
    }

    mostRequest = (startDate, endDate, cohortId) => { //gets pie data for the most q requests
      getMostRequestingStudentData(startDate, endDate, cohortId).then(res => {
        $scope.mostRequests = sortPieData(qService.getHighest(res, filteredStudents, 'count'))
      })
    }

    let getStudentPieData = () => {
      getStudentsForCohort().then(res => {
        filteredStudents = res;
        mostHelp(apiStartDate, apiEndDate, $scope.cohortId)
        mostAveraged(apiStartDate, apiEndDate, $scope.cohortId)
        mostRequest(apiStartDate, apiEndDate, $scope.cohortId)
      })
    }

    getStudentPieData()


    //--------------Cohort SideNav Functions----------------//

    $scope.openCohortNav = function () {
      document.getElementById("cohort-sidenav").style.width = "400px";
      document.getElementById("cohort-sidenav").style.marginLeft = "-200px";
      document.getElementById("login-sidenavOverlay").style.display = "block";
      document.body.style.overflow = 'hidden';

    }

    $scope.openCohortStudentNav = function () {
      document.getElementById("cohort-sidenavStudent").style.width = "420px";
      document.getElementById("cohort-sidenav").style.boxShadow = "none";
    }

    $scope.closeCohortStudentNav = function () {
      document.getElementById("cohort-sidenavStudent").style.width = "0";
      document.getElementById("cohort-sidenav").style.width = "0";
      document.getElementById("login-sidenavOverlay").style.display = "none";
      document.body.style.overflow = 'visible';
      getStudentPieData()
      getMentorPieData(apiStartDate, apiEndDate, $scope.cohortId)
      loadAllDatePickers()
    }

    $scope.setSelected = function (selectedCohortId) {
      $scope.selectedCohortId = selectedCohortId;
      $scope.cohortId = selectedCohortId;
    }

    $scope.selectedStudents = null;
    $scope.getSelected = function (selectedStudents) {
      $scope.selectedStudents = selectedStudents
    }


  });



})