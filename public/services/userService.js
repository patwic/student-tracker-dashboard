angular.module('app').service('userService', function ($http, config) {

    var postUserPrefs = (prefs) => {
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
            return response.data
        })
    }

    // var user;
    this.user;
    this.getUser = () => {
        return $http.get('/api/getUser').then(res => {
            this.user = res.data;
            return res.data;
        })
    }


    const url = `${config.dev_mtn_api}aliases?admin_token=${config.admin_token}`
    this.getCohorts = () => {
        return $http.get(
                url, {
                    headers: {
                        'Access-Control-Allow-Origin': '*'
                    }
                })
            .then(res => {
                var cohorts = res.data
                var activeCohorts = cohorts.filter((c) => {
                    return c.active == true
                })
                if (this.user.cohort_ids[0]) {
                    cohortId = this.user.cohort_ids[0]
                } else cohortId = activeCohorts[0].cohortId
                getCohortAliases(cohorts)
               
                return [cohorts, activeCohorts]
            })
    }



    var getCohortAliases = (cohortsObj) => {
        let cId = this.user.cohort_ids;
        for (var i = 0; i < cId.length; i++) {
            for (var j = 0; j < cohortsObj.length; j++) {
                if (parseInt(cohortsObj[j].cohortId) == cId[i]) {
                    this.user.cohort_ids.splice(i, 1, {
                        id: cId[i],
                        alias: cohortsObj[j].alias
                    })
                }
            }
        }
    }



    this.addCohort = (cohortId, cohortAlias) => {
        var idFound = false
        for (var i = 0; i < this.user.cohort_ids.length; i++) {
            if (this.user.cohort_ids[i].id == cohortId) {
                idFound = true
                break
            }
        }
        if (!idFound) {
            var cohortPair = {
                "id": cohortId,
                "alias": cohortAlias
            }
            this.user.cohort_ids.push(cohortPair)
            postUserPrefs(this.user.cohort_ids)
        } else console.log('Already added')
        return this.user;
    }

    this.removeCohort = (cohortId) => {
        for (var i = 0; i < this.user.cohort_ids.length; i++) {
            if (this.user.cohort_ids[i].id === cohortId) {
                this.user.cohort_ids.splice(i, 1)
                postUserPrefs(this.user.cohort_ids)
                break
            }
        }
        return this.user;
    }



})