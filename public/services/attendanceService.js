angular.module('app').service('attendanceService', function ($http, config) {
    this.url = `${config.dev_mtn_api}attendancedays/?admin_token=${config.admin_token}`

    this.getDays = (month, cohortId) => {
        let beginDate = `${month}-01`
        let splitDate = month.split('-')
        splitDate[1] = +splitDate[1] + 1
        if (splitDate[1] > 12) splitDate[1] = '01'
        else if (splitDate[1] < 10) splitDate[1] = '0' + splitDate[1]
        let endDate = splitDate.join('-')
        return $http.get(
            `${this.url}&after=${beginDate}&before=${endDate}&cohortId=${cohortId}`,
            {
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            }
        )
    }
})