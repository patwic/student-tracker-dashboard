angular.module('app').service('sheetsService', function ($http, config) {
    this.getSheet = () => {
        return $http.get('https://sheetsu.com/apis/v1.0/103e1fc72ac5').then(response => {
            console.log(response.data)
            return response.data
        })
    }
})