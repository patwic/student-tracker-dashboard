angular.module('app').controller('mainCtrl', function ($scope, attendanceService, alertService, qService, sheetsService, $location) {

  $scope.user = 'Jeremy Robertson'
  $scope.isDropdown = false;
  $scope.helpQ;
  $scope.totalQ;
  $scope.waitQ;
  $scope.redAlerts;

  $scope.cohortId = 106;
  $scope.autoStartDate = new Date();
  $scope.autoEndDate = $scope.autoStartDate.setDate($scope.autoStartDate.getDate() - 7);


  mostRequestingStudents = (startDate, endDate) => {
    return qService.getQ(startDate, endDate, $scope.cohortId).then(function (res) {
      return qService.getAvgStudentTimes(res.data)
    })
  }

    sheetsService.getSheet().then((res) => {
      sheetsService.getProgress(res)
    })


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

  $scope.openNav = function () {
    document.getElementById("login-sidenav").style.width = "500px";
    document.getElementById("login-sidenavOverlay").style.display = "block";
  }

  $scope.closeNav = function () {
    document.getElementById("login-sidenav").style.width = "0";
    document.getElementById("login-sidenavOverlay").style.display = "none";
  }

  $scope.openCohortNav = function () {
    document.getElementById("cohort-sidenav").style.width = "200px";
    document.getElementById("cohort-selectedCohort").style.backgroundColor = "#444";
    document.getElementById("cohort-selectedCohort").style.color = '#999999';
  }

  $scope.openCohortStudentNav = function () {
    document.getElementById("cohort-sidenavStudent").style.width = "420px";
    document.getElementById("cohort-selectedCohort").style.backgroundColor = "#1a1a1a";
    document.getElementById("cohort-selectedCohort").style.color = '#25aae1';
    document.getElementById("cohort-sidenav").style.boxShadow = "none";
  }

  $scope.closeCohortStudentNav = function () {
    document.getElementById("cohort-sidenavStudent").style.width = "0";
    document.getElementById("cohort-sidenav").style.width = "0";
  }


  //-------------attendance calendar-----------------//

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


  // *************************** Calendars ***************************



  $(function () {
    $('#qTimeDateRange').daterangepicker({
      startDate: $scope.autoStartDate,
      endDate: $scope.autoEndDate
    })
  })

  $('#qTimeDateRange').on('apply.daterangepicker', function (ev, picker) {
    let endDate = new Date()
    picker.startDate.format('YYYY-MM-DD')
    new Date(endDate.setDate(picker.endDate._d.getDate() + 1)).toISOString().substring(0, 10)
  })

  // *************************** Calendars ***************************

  $(function () {
    $('#mentorHelpDateRange').daterangepicker({
      startDate: $scope.autoStartDate,
      endDate: $scope.autoEndDate
    })
  })

  $('#mentorHelpDateRange').on('apply.daterangepicker', function (ev, picker) {
    let endDate = new Date()
    picker.startDate.format('YYYY-MM-DD')
    new Date(endDate.setDate(picker.endDate._d.getDate() + 1)).toISOString().substring(0, 10)
  })

  // *************************** Calendars ***************************

  $(function () {
    $('#daterange1').daterangepicker({
      startDate: $scope.autoStartDate,
      endDate: $scope.autoEndDate
    });
  })

  $('#daterange1').on('apply.daterangepicker', function (ev, picker) {
    let endDate = new Date()
    let startDate = picker.startDate.format('YYYY-MM-DD')
    endDate = new Date(endDate.setDate(picker.endDate._d.getDate() + 1)).toISOString().substring(0, 10)
    mostRequestingStudents(startDate, endDate).then(function (res) {

    })
  })

  // *************************** Calendars ***************************

  $(function () {
    $('#daterange2').daterangepicker({
      startDate: $scope.autoStartDate,
      endDate: $scope.autoEndDate
    });
  })

  $('#daterange2').on('apply.daterangepicker', function (ev, picker) {
    let endDate = new Date()
    let startDate = picker.startDate.format('YYYY-MM-DD')
    endDate = new Date(endDate.setDate(picker.endDate._d.getDate() + 1)).toISOString().substring(0, 10)
    mostRequestingStudents(startDate, endDate).then(function (res) {

    })
  })

  // *************************** Calendars ***************************

  $(function () {
    $('#daterange3').daterangepicker({
      startDate: $scope.autoStartDate,
      endDate: $scope.autoEndDate
    });
  })

  $('#daterange3').on('apply.daterangepicker', function (ev, picker) {
    let endDate = new Date()
    let startDate = picker.startDate.format('YYYY-MM-DD')
    endDate = new Date(endDate.setDate(picker.endDate._d.getDate() + 1)).toISOString().substring(0, 10)
    mostRequestingStudents(startDate, endDate).then(function (res) {
      console.log(res)
    })
  })


  // *************************** Preferences Select Menus ***************************


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

  });


})