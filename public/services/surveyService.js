angular.module('app').service('surveyService', function ($http) {

this.getWeeklySurveyData = () => {
  return $http.get('/api/surveys/getWeekly')
}

this.getWeeklySurveyDataByCohortId = (cohort_id) => {
  return $http.get(`/api/surveys/getWeeklyById?id=${cohort_id}`)
}

})