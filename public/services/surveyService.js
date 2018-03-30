angular.module('app').service('surveyService', function($http) {
  this.getWeeklySurveyData = () => $http.get('/api/surveys/getWeekly');

  this.getWeeklySurveyDataByCohortId = cohort_id => $http.get(`/api/surveys/getWeeklyById?id=${cohort_id}`);

  this.getWeeklyCommentsByCohortId = cohort_id => $http.get(`/api/surveys/getCommentsById?comment=all&id=${cohort_id}`);

  this.getSurveyByTopic = topic => $http.get(`/api/surveys/getSurveyByTopic?topic=${topic}`);

  this.getInstructors = () => $http.get('/api/surveys/instructors');

  this.getInstructorGraphData = topic => $http.get(`/api/surveys/instructorData?topic=${topic}`);

  this.getModules = () => $http.get('/api/surveys/modules');

  this.getTopics = () => $http.get('/api/surveys/topics');
});
