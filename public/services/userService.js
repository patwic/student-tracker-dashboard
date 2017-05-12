angular.module('app').service('userService', function ($http, config) {

    this.postUserPrefs = (prefs) => {
        let prefIds = []
        for (var i = 0; i < prefs.length; i++) {
            prefIds.push(prefs[i].id)
        }
        return $http.post('http://localhost:8002/api/prefs/', {
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            prefs: prefIds
        }).then(response => {
            console.log('success!', response.data)
            return response.data
        }).catch(function (err) {
            console.log('Error');
        })
    }

    this.getUser = () => {
        return $http.get('/api/getUser').then(res => {
            return res.data;
        }).catch(function (err) {
            console.log('Error');
        })
    }


    const url = `${config.dev_mtn_api}aliases?admin_token=${config.admin_token}`
    this.getCohorts = () => {
        return $http.get(
            url, {
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            }).then(res => {
                console.log(res)
                return res
            })
            .catch(function (err) {
            console.log('Error');
        })
    }

})