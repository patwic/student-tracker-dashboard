angular.module('app').service('cohortService', function ($http, config) {
    const url = `${config.dev_mtn_api}aliases?admin_token=${config.admin_token}`

    this.getCohorts = () => {
        return $http.get(
            url,
            {headers: {'Access-Control-Allow-Origin': '*'}})
    }
})