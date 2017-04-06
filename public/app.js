angular.module('app', ['ui.router'])

.config(function($stateProvider, $urlRouterProvider){

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: "./views/home.html"
        })

        .state('cohort', {
            url: '/cohort',
            templateUrl: "./views/cohort.html"
        })

        .state('login', {
            url: '/login',
            templateUrl: "./views/login.html"
        })

});