angular.module('app').service('qService', function($http, config) {
    const apiUrl = 'http://q.devmountain.com/admin/'

    this.getQ = (beginDate, endDate, cohortId) => {
        let url = `${config.dev_mtn_api}historical/questions/?admin_token=${config.admin_token}&after=${beginDate}&before=${endDate}`
        if (cohortId) url += `&cohortId=${cohortId}`
        return $http.get(
            url,
            {headers: { 'Access-Control-Allow-Origin': '*' }}
        )
    }

    this.divideQDays = (qbody, beginDate, endDate) => {
        let beginFD = this.dateFormatter(beginDate)
        let endFD = this.dateFormatter(endDate)
        let dateArray = []
        for (let d = beginFD; d < endFD; d.setDate(d.getDate() + 1)) {
            if (d.getDay() != 0 || d.getDay() != 6) dateArray.push(d)
        }
        return dateArray
    }

    this.dateFormatter = (date) => {
        let dateArr = date.split('-')
        if (dateArr[1] == '01') dateArr[1] = '13'
        let fDate = new Date(dateArr[0], dateArr[1] - 1, dateArr[2]);
        return fDate
    }
})