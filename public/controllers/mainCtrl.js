angular.module('app').controller('mainCtrl', function ($scope, attendanceService, alertService, qService) {
  $scope.user = 'Jeremy Robertson'
  $scope.isDropdown = false;
  $scope.helpQ;
  $scope.totalQ;
  $scope.waitQ;
  $scope.redAlerts;

  console.log($scope.qTime)

  $scope.mostOverall = () => {
        qService.getQ()
    }

    $scope.mostAverage = () => {

    }

    $scope.mostRequest = () => {

    }
  

  $scope.showDropdown = function () {
    if (!$scope.isDropdown) {
      document.getElementById('dropdown').classList.add('dropdown-transition')
    } else {
      document.getElementById('dropdown').classList.remove('dropdown-transition')
    }
    $scope.isDropdown = !$scope.isDropdown
  }/*

  attendanceService.getDays('2017-03', 106)
    .then((res) => attendanceService.getDataFromDays(res.data))
    .then((res) => {
      let daysData = []
      for (let day of res) daysData.push(day.data)
      console.log(attendanceService.getAttendanceFromData(daysData))
  })*/

  // document.getElementById('home-nav').addClass('active-link')
  // $scope.activeLinks = function (link) {
  //   if(link === 'cohort') {
  //     document.getElementById('cohort-nav').addClass('active-link');
  //     document.getElementById('home-nav').removeClass('active-link');      
  //   } else {
  //     document.getElementById('cohort-nav').removeClass('active-link');
  //     document.getElementById('home-nav').addClass('active-link'); 
  //   }
  // }

  let socket = io()
  socket.on('updatedQs', (qArr) => {
    $scope.helpQ = qArr[0]
    $scope.totalQ = qArr[1]
    $scope.waitQ = qArr[2]
    $scope.$apply();
  })

  socket.on('updateReds', (rA) => {
    $scope.redAlerts = rA;
    for(let i = 0; i < $scope.redAlerts.length; i++) {
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


// *************************** Calendars ***************************

   $(function() {
    $('#qTimeDateRange').daterangepicker({}, function(){

    });
});

  $('#qTimeDateRange').on('apply.daterangepicker', function(ev, picker){
    console.log(picker.startDate)
    console.log(picker.endDate)
  })

// *************************** Calendars ***************************

   $(function() {
    $('#mentorHelpDateRange').daterangepicker({}, function(){

    });
});

  $('#mentorHelpDateRange').on('apply.daterangepicker', function(ev, picker){
    console.log(picker.startDate)
    console.log(picker.endDate)
  })

  // *************************** Calendars ***************************

  $(function() {
    $('#daterange1').daterangepicker({}, function(){

    });
});

  $('#daterange1').on('apply.daterangepicker', function(ev, picker){
    console.log(picker.startDate)
    console.log(picker.endDate)
  })

  // *************************** Calendars ***************************

  $(function() {
    $('#daterange2').daterangepicker({}, function(){

    });
});

  $('#daterange2').on('apply.daterangepicker', function(ev, picker){
    console.log(picker.startDate)
    console.log(picker.endDate)
  })

  // *************************** Calendars ***************************

  $(function() {
    $('#daterange3').daterangepicker({}, function(){

    });
});

  $('#daterange3').on('apply.daterangepicker', function(ev, picker){
    console.log(picker.startDate)
    console.log(picker.endDate)
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