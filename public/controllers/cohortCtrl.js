angular.module('app').controller('cohortCtrl', function ($scope, attendanceService, qService) {

    //---------------date variables----------------//

    $scope.cohortId = 106; //!!!!!!!DUMMY DATA!!!!!

    //date variables that set calendar ranges to one week prior on page load
    let autoStartDate = new Date();
    let autoEndDate = $scope.autoStartDate.setDate($scope.autoStartDate.getDate() - 7);

    //converting the above date variables to correct format for api calls
    let apiEndDate = new Date().toISOString().substring(0, 10),
        apiStartDate = new Date(autoEndDate).toISOString().substring(0, 10)

    
    //---------------filtered students for cohort view from side menu-----------//

    $scope.filteredStudents = [] //!!!!!!!DUMMY DATA!!!!!
    let filteredStudents = $scope.filteredStudents;


    //------------getting mentor pie data-----------------//

    // gets pie data for cohort mentors and their average help time per request
    qService.getQ(apiStartDate, apiEndDate, $scope.cohortId).then(res => {
        let mentors = qService.getAvgMentorTimes(res.data).sort((a, b) => {
            return b.count - a.count
        })
        for (let i = 0; i < 3; i++) {
            mentors[i].average = Math.floor(mentors[i].average)
        }
        $scope.mentors = mentors.slice(0, 3).sort((a, b) => {
            return b.average - a.average;
        });
        $scope.mentorPieData = [mentors[0].average, mentors[1].average, mentors[2].average]
    })

    //-------------getting most requesting student pie data-------------//

    let getAllRequestingPieData = () => { //gets student data ready to filter
        return qService.getQ(apiStartDate, apiEndDate, $scope.cohortId).then(res => {
            return qService.getAvgStudentTimes(res.data);
        })
    }

    $scope.mostAverage = () => { //gets pie data for the most requested average q time
        getAllRequestingPieData().then(res => {
            $scope.mostAverage = qService.getHighest(res, filteredStudents, 'average')
        })
    }

    $scope.mostHelp = () => { //gets pie data for the most requested help q time
        getAllRequestingPieData().then(res => {
            $scope.mostHelped = qService.getHighest(res, filteredStudents, 'sum')
        })
    }

    $scope.mostRequest = () => { //gets pie data for the most q requests
        getAllRequestingPieData().then(res => {
            $scope.mostRequests = qService.getHighest(res, filteredStudents, 'count')
        })
    }

})