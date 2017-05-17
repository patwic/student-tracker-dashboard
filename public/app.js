angular.module('app', ['ui.router'])

    //testing a pull request
    .config(function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: "./views/login.html"
            })

            .state('home', {
                url: '/',
                controller: 'mainCtrl',
                templateUrl: "./views/home.html",
                resolve: {
                    authenticate: function (userService, $state, $rootScope) {
                        userService.getUser().then(response => {
                            if (response === 'NOPE') {
                                event.preventDefault()
                                $state.go("login")
                            }
                        })
                    }
                }
            })

            .state('cohort', {
                url: '/cohort',
                templateUrl: "./views/cohort.html",
                controller: 'mainCtrl',
                resolve: {
                    authenticate: function (userService, $state, $rootScope) {
                        userService.getUser().then(response => {
                            if (response === 'NOPE') {
                                event.preventDefault()
                                $state.go("login")
                            }
                        })
                    }
                }
            })


    });