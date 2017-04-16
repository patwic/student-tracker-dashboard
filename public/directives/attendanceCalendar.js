angular.module('app')
  .directive('attendanceCalendar', function () {
    return {
      restrict: 'E',
      template: "<div id='attendanceCalendar'></div>",
      scope: {
        cohortTimeData: '='
      },
      controller: function ($scope, attendanceService) {
        $scope.cohortId = 106

        var absences = []

        $('#attendanceCalendar').datepicker({
            inline: true,
            firstDay: 1,
            showOtherMonths: true,
            dateFormat: 'yy-mm-dd',
            dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
            beforeShowDay: highlightDays/*,
            onChangeMonthYear: function(year, month, widget) {
            attendanceService.getDays(year, month, 106).then((res) =>
                attendanceService.getDataFromDays(res.data).then((res2) => {
                updateAttendanceData(attendanceService.getAttendanceFromData(res2))
                })
            )
            }*/
        });

        function updateAttendanceData(attendanceData) {
            absences = []
            for (let day of attendanceData) {
            if (day.absent.length > 0) {
                day.day = day.day.split('-').join('/')
                absences.push(day.day)
            }
            }
            $scope.$apply()
        }

        function highlightDays(date) {
            let day = date.toISOString().substring(8, 10)
            if (day == '01') updateAbsences()
            for (var i = 0; i < absences.length; i++) {
            if (new Date(absences[i]).toString() == date.toString()) {
                return [true, 'highlight'];
            }
            }
            return [true, ''];
        }

        function changeCohort() {
            if ($scope.cohortId == 106) $scope.cohortId = 91
            else $scope.cohortId = 106
            console.log('hi')
        }

        setTimeout(changeCohort, 30000)
        setTimeout(changeCohort, 30000)

        function updateAbsences() {       
            attendanceService.getDays($scope.cohortId).then((res) =>
                attendanceService.getDataFromDays(res.data).then((res2) => {
                    updateAttendanceData(attendanceService.getAttendanceFromData(res2))
                    $( "#attendanceCalendar" ).datepicker("refresh");
                })
            )
        }
      }
    }
})