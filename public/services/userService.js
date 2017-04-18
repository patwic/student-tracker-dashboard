angular.module('app').service('userService', function ($http, config) {

    this.getUserPrefs = () => {
        return $http.get('http://localhost:3000/api/prefs/', {headers: {'Access-Control-Allow-Origin': '*'}}).then(response => {
            return response.data
        })
    }

    this.postUserPrefs = (prefs) => {
        return $http.post('http://localhost:3000/api/prefs/', {headers: {'Access-Control-Allow-Origin': '*'}, body: {prefs: prefs}}).then(response => {
            return response.data
        })
    }


    this.getUser = () => {
        return $http.get('/api/getUser').then(res => {
            return res.data;
        })
    }
    

})