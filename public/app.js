angular.module('app', ['ui.router'])

.config(function($stateProvider, $urlRouterProvider){

    $urlRouterProvider.otherwise('/root');

    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: "./views/login.html"
        })

        .state('root', {
            abstract: true,
            views: {
                '@': {
                    template: '<ui-view />'
                }
            }
        })

        .state('root.home', {
            parent: 'root',
            url: '/',
            templateUrl: "./views/home.html"
        })

        .state('root.cohort', {
            parent: 'root',
            url: '/cohort',
            templateUrl: "./views/cohort.html"
        })


});