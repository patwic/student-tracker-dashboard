angular.module('app').controller('mainCtrl', function ($scope, attendanceService, alertService, qService, sheetsService, $location, userService) {

  $scope.user;
  $scope.isDropdown = false;
  $scope.helpQ;
  $scope.totalQ;
  $scope.waitQ;
  $scope.redAlerts;
  $scope.cohorts
  $scope.activeCohorts
  var getStudentPieData;
  var getLineChartCohortData;

  var cohortPreferences = [];



  //---------------get user---------------//
  var getUser = () => {
    return userService.getUser()
      .then(res => {
        getCohorts(res).then(response => {
          if(!response) return console.log('no user')
          $scope.user = response;
          $scope.cohortUserList = response.cohort_ids;
        })
      })
  }

  getUser()

  
  //---------------get cohorts---------------//


  var getCohorts = (user) => {
    return userService.getCohorts().then((res) => {
      $scope.cohorts = res.data
      $scope.activeCohorts = $scope.cohorts.filter((c) => {
        return c.active == true
      })
      if (!user) {
        $scope.cohortId = $scope.activeCohorts[3].cohortId
      } else $scope.cohortId = user.cohort_ids[0]
      let newUser = getCohortAliases($scope.cohorts, user)
      getLineChartCohortData(apiStartDate, apiEndDate, $scope.cohortId)
      getStudentPieData()


    //   document.getElementById('pp').style.background = 'linear-gradient(-45deg, #333, #444)'
    // document.getElementById('pp').style.color = '#CCC'


      return newUser;
    })
  }

  var getCohortAliases = (cohortsObj, user) => {
    if(!user) return user;
    let cId = user.cohort_ids;
    for (var i = 0; i < cId.length; i++) {
      for (var j = 0; j < cohortsObj.length; j++) {
        if (parseInt(cohortsObj[j].cohortId) == cId[i]) {
          user.cohort_ids.splice(i, 1, {
            id: cId[i],
            alias: cohortsObj[j].alias
          })
        }
      }
    }
    return user; 
  }


  $scope.showList = function () {
    document.getElementById("dropdownList").classList.toggle("show")
  }

  window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {

      var dropdowns = document.getElementsByClassName("dropdownList");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }


//---------------show all cohorts/reset filters---------------//


    $scope.getAllCohorts = function() {
      // let allCohorts = [];
      let allCohortIds = []
      for(var i = 0; i < $scope.cohorts.length; i++) {
        allCohortIds.push($scope.cohorts[i].cohortId / 1)
        // allCohorts.push($scope.cohorts[i].cohortId)
      }
      console.log(allCohortIds)
      return allCohortIds 

      // console.log($scope.allCohorts)

      $scope.user.cohort_ids = allCohortIds
      console.log($scope.user.cohort_ids)

      // console.log($scope.user.cohort_ids)
      // $scope.user.cohort_ids = $scope.cohorts
      // console.log($scope.user.cohort_ids)
      // getCohorts() 
    }

    $scope.removeAllCohorts = function(user) {
      getUser()
    }


  //--------remove preference----------//


  $scope.addCohort = (cohortId, cohortAlias) => {
    var idFound = false
    for (var i = 0; i < $scope.user.cohort_ids.length; i++) {
      if ($scope.user.cohort_ids[i].id == cohortId) {
        idFound = true
        break
      }
    }
    if (!idFound) {
      var cohortPair = {
        "id": cohortId,
        "alias": cohortAlias
      }
      $scope.user.cohort_ids.push(cohortPair)
      userService.postUserPrefs($scope.user.cohort_ids)
    } else console.log('Already added')
  }

  $scope.removeCohort = (cohortId) => {
    for (var i = 0; i < $scope.user.cohort_ids.length; i++) {
      if ($scope.user.cohort_ids[i].id === cohortId) {
        $scope.user.cohort_ids.splice(i, 1)
        userService.postUserPrefs($scope.user.cohort_ids)
        break
      }
    }
  }

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
    $scope.projectName = 'personalScore'
    document.getElementById('pp').style.background = 'linear-gradient(-45deg, #333, #444)'
    document.getElementById('pp').style.color = '#CCC'
  })

  //-----------update sheets-------------//

  $scope.updateBar = (id) => {
    let p = document.getElementById('pp')
    let g = document.getElementById('gp')
    let n = document.getElementById('np')
    if(id === 'np') {
      $scope.projectName = 'noServerScore'
    n.style.background = 'linear-gradient(-45deg, #333, #444)'
    n.style.color = '#CCC'
    g.style.background = '#1a1a1a'
    g.style.color = '#282828'
    p.style.background = '#1a1a1a'
    p.style.color = '#282828'
  } else if(id === 'pp') {
    $scope.projectName = 'personalScore'
    p.style.background = 'linear-gradient(-45deg, #333, #444)'
    p.style.color = '#CCC'
    g.style.background = '#1a1a1a'
    g.style.color = '#282828'
    n.style.background = '#1a1a1a'
    n.style.color = '#282828'
  } else  if(id === 'gp') {
    $scope.projectName = 'groupScore'
    g.style.background = 'linear-gradient(-45deg, #333, #444)'
    g.style.color = '#CCC'
    p.style.backpround = '#1a1a1a'
    p.style.color = '#282828'
    n.style.background = '#1a1a1a'
    n.style.color = '#282828'
    }
  }


  //-----------------dropdowns----------------//

  $scope.showDropdown = function () {
    if (!$scope.isDropdown) {
      document.getElementById('dropdown').classList.add('dropdown-transition')
    } else {
      document.getElementById('dropdown').classList.remove('dropdown-transition')
    }
    $scope.isDropdown = !$scope.isDropdown
  }

  if ($location.path() === '/cohort') {
    $scope.activateLink = false;
  } else $scope.activateLink = true;

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
    getUser()
  }

  $scope.closeNav = function () {
    document.getElementById("login-sidenav").style.width = "0";
    document.getElementById("login-sidenav").style.transition = "0.5s";
    document.getElementById("login-sidenavOverlay").style.display = "none";
    document.body.style.overflow = 'visible';
  }



  //--------------Attendance Display Calendar----------------//

  updateAbsences()

  var absences = []
  $scope.absentStudents = []

  $('#attendanceCalendar').datepicker({
    inline: true,
    firstDay: 1,
    showOtherMonths: true,
    dateFormat: 'yy-mm-dd',
    dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    beforeShowDay: highlightDays
  });

  function updateAttendanceData(attendanceData) {
    absences = []
    $scope.absentStudents = {}
    for (let day of attendanceData) {
      if (day.absent.length > 0) {
        for (let i = 0; i < day.absent.length; i++) {
          if ($scope.absentStudents[day.absent[i]]) $scope.absentStudents[day.absent[i]].count++
            else $scope.absentStudents[day.absent[i]] = {
              name: day.absent[i],
              count: 1
            }
        }
        day.day = day.day.split('-').join('/')
        absences.push(day.day)
      }
    }
    $scope.$apply()
  }

  function highlightDays(date) {
    let day = date.toISOString().substring(8, 10)
    for (var i = 0; i < absences.length; i++) {
      if (new Date(absences[i]).toString() == date.toString()) {
        return [true, 'highlight'];
      }
    }
    return [true, ''];
  }

  function updateAbsences() {
    attendanceService.getDays($scope.cohortId).then((res) =>
      attendanceService.getDataFromDays(res.data).then((res2) => {
        updateAttendanceData(attendanceService.getAttendanceFromData(res2))
        $("#attendanceCalendar").datepicker("refresh");
      })
    )
  }

  //--------------q Time DatePicker----------------//

  let loadQTimeDatePicker = () => {
    $('#qTimeDateRange').daterangepicker({
        startDate: $scope.autoStartDate,
        endDate: $scope.autoEndDate
      })
      .on('apply.daterangepicker', function (ev, picker) {
        let endDate = new Date()
        let startDate = picker.startDate.format('YYYY-MM-DD')
        new Date(endDate.setDate(picker.endDate._d.getDate() + 1)).toISOString().substring(0, 10)
        getLineChartCohortData(startDate, endDate, $scope.cohortId)
      })
  }

  //--------------Mentor Help DatePicker----------------//


  let loadMentorDatePicker = () => {
    $('#mentorHelpDateRange').daterangepicker({
        startDate: $scope.autoStartDate,
        endDate: $scope.autoEndDate
      })
      .on('apply.daterangepicker', function (ev, picker) {
        let endDate = new Date()
        let startDate = picker.startDate.format('YYYY-MM-DD')
        new Date(endDate.setDate(picker.endDate._d.getDate() + 1)).toISOString().substring(0, 10)
        getMentorPieData(startDate, endDate, $scope.cohortId)
      })
  }

  //--------------Most Requested Average DatePicker----------------//

  let loadAverageDatePicker = () => {
    $('#daterange1').daterangepicker({
        startDate: $scope.autoStartDate,
        endDate: $scope.autoEndDate
      })
      .on('apply.daterangepicker', function (ev, picker) {
        let endDate = new Date()
        let startDate = picker.startDate.format('YYYY-MM-DD')
        endDate = new Date(endDate.setDate(picker.endDate._d.getDate() + 1)).toISOString().substring(0, 10)
        mostAveraged(startDate, endDate, $scope.cohortId)
      })
  }

  //--------------Most Requested Help DatePicker----------------//

  let loadHelpDatePicker = () => {
    $('#daterange2').daterangepicker({
        startDate: $scope.autoStartDate,
        endDate: $scope.autoEndDate
      })
      .on('apply.daterangepicker', function (ev, picker) {
        let endDate = new Date()
        let startDate = picker.startDate.format('YYYY-MM-DD')
        endDate = new Date(endDate.setDate(picker.endDate._d.getDate() + 1)).toISOString().substring(0, 10)
        mostHelp(startDate, endDate, $scope.cohortId)
      })
  }

  //--------------Most Reqested Requests DatePicker----------------//

  let loadRequestsDatePicker = () => {
    $('#daterange3').daterangepicker({
        startDate: $scope.autoStartDate,
        endDate: $scope.autoEndDate
      })
      .on('apply.daterangepicker', function (ev, picker) {
        let endDate = new Date()
        let startDate = picker.startDate.format('YYYY-MM-DD')
        endDate = new Date(endDate.setDate(picker.endDate._d.getDate() + 1)).toISOString().substring(0, 10)
        mostRequest(startDate, endDate, $scope.cohortId)
      })
  }

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


    var allStudents = [];


    var getStudentsForCohort = (cohortId) => { //make an array of all student names from specific cohort
      return qService.getStudentsForCohort(cohortId).then(res => {
        allStudents = [];
        $scope.students = [];
        for (let i = 0; i < res.length; i++) {
          allStudents.push(res[i].firstName + ' ' + res[i].lastName)
        }
        $scope.filteredStudents = allStudents;
        $scope.students = allStudents;
        return allStudents;
      })
    }



    //---------------filtered students for cohort view from side menu-----------//


    let filteredStudents;


    //----------------get data for cohort line chart-------------//

    var cohortObjData;
    getLineChartCohortData = (startDate, endDate, cohortId) => {
      qService.getQ(startDate, endDate, cohortId).then(res => {
        let data = qService.setQs(res.data)
        $scope.cohortQData = data.helpQ
        // $scope.$apply()
      })
    }


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

    getStudentPieData = () => {
      getStudentsForCohort($scope.cohortId).then(res => {
        filteredStudents = res;
        mostHelp(apiStartDate, apiEndDate, $scope.cohortId)
        mostAveraged(apiStartDate, apiEndDate, $scope.cohortId)
        mostRequest(apiStartDate, apiEndDate, $scope.cohortId)
      })
    }

    //--------------Cohort SideNav Functions----------------//

    $scope.openCohortNav = function () {
      document.getElementById("cohort-sidenav").style.width = "400px";
      document.getElementById("cohort-sidenav").style.marginLeft = "-200px";
      document.getElementById("login-sidenavOverlay").style.display = "block";
      document.body.style.overflow = 'hidden';
      document.getElementById('cohort-sidenav').style.boxShadow = '6px 6px 17px 2px rgba(0, 0, 0, .4)'
      getUser()
    }

    $scope.openCohortStudentNav = function () {
      document.getElementById("cohort-sidenavStudent").style.width = "420px";
      document.getElementById("cohort-sidenav").style.boxShadow = "none";
      document.getElementById('cohort-sidenavStudent').style.boxShadow = '6px 6px 17px 2px rgba(0, 0, 0, .4)'
    }

    $scope.closeCohortStudentNav = function () {
      document.getElementById("cohort-sidenavStudent").style.width = "0";
      document.getElementById("cohort-sidenav").style.width = "0";
      document.getElementById("login-sidenavOverlay").style.display = "none";
      document.body.style.overflow = 'visible';
      document.getElementById('cohort-sidenavStudent').style.boxShadow = 'none'
      document.getElementById('cohort-sidenav').style.boxShadow = 'none'      
      getStudentPieData()
      getMentorPieData(apiStartDate, apiEndDate, $scope.cohortId)
      loadAllDatePickers()
      updateAbsences()
      getLineChartCohortData(apiStartDate, apiEndDate, $scope.cohortId)
    }

    $scope.setSelected = function (selectedCohortId) {
      $scope.selectedCohortId = selectedCohortId;
      $scope.cohortId = selectedCohortId;
      getStudentsForCohort($scope.cohortId)
    }


    $scope.selectedStudents = null;
    $scope.getSelected = function (selectedStudents) {
      $scope.selectedStudents = selectedStudents
    }





  });



})