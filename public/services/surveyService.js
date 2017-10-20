angular.module('app').service('surveyService', function ($http) {

this.getWeeklySurveyData = () => {
  return $http.get('https://surveys.devmountain.com/api/tableau/data')
}

})