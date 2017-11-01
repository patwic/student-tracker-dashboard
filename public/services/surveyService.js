angular.module('app').service('surveyService', function ($http) {

  this.getWeeklySurveyData = () => {
    return $http.get('/api/surveys/getWeekly')
  }

  this.getWeeklySurveyDataByCohortId = (cohort_id) => {
    return $http.get(`/api/surveys/getWeeklyById?id=${cohort_id}`)
  }

  this.getWeeklyCommentsByCohortId = (cohort_id) => {
    return $http.get(`/api/surveys/getCommentsById?comment=all&id=${cohort_id}`)
  }

  this.getSurveyByTopic = (topic) => {
    return $http.get(`/api/surveys/getSurveyByTopic?topic=${topic}`)
  }

  this.getInstructors = () => {
    return $http.get('/api/surveys/instructors')
  }

  this.getInstructorGraphData = () => {
    return $http.get('/api/surveys/instructorData')
  }

})