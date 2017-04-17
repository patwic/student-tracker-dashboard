angular.module('app').service('userService', function ($http, config) {

    this.getUserPrefs = (userId) => {
        return $http.get('http://localhost:3000/api/prefs/', {headers: {'Access-Control-Allow-Origin': '*'}}).then(response => {
            return response.data
        })
    }

    this.postUserPrefs = (userId, prefs) => {
        return $http.post('http://localhost:3000/api/prefs/', {headers: {'Access-Control-Allow-Origin': '*'}, body: {prefs: prefs}}).then(response => {
            return response.data
        })
    }
    

})