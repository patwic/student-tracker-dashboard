angular.module('app').service('userService', function ($http, config) {

    this.postUserPrefs = (prefs) => {
        let prefIds = []
        for(var i = 0; i < prefs.length; i++) {
            // console.log(prefs[i])
            prefIds.push(prefs[i].id)
        }
        // console.log('prefs', prefs)
        return $http.post('http://localhost:8002/api/prefs/', {headers: {'Access-Control-Allow-Origin': '*'}, prefs: prefIds}).then(response => {
            return response.data
        })
    }


    this.getUser = () => {
        return $http.get('/api/getUser').then(res => {
            return res.data;
        })
    }
    

})