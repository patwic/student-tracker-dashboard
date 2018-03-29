angular
  .module('app', ['ui.router', '720kb.datepicker'])

  // testing a pull request
  .config(($stateProvider, $urlRouterProvider) => {
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: './views/login.html',
      })

      .state('home', {
        url: '/',
        controller: 'mainCtrl',
        templateUrl: './views/home.html',
        resolve: {
          authenticate(userService, $state, $rootScope) {
            userService.getUser().then(response => {
              if (response === 'NOPE') {
                event.preventDefault();
                $state.go('login');
              }
            });
          },
        },
      })

      .state('cohort', {
        url: '/cohort',
        templateUrl: './views/cohort.html',
        controller: 'mainCtrl',
        resolve: {
          authenticate(userService, $state, $rootScope) {
            userService.getUser().then(response => {
              if (response === 'NOPE') {
                event.preventDefault();
                $state.go('login');
              }
            });
          },
        },
      })

      .state('surveys', {
        url: '/surveys',
        templateUrl: './views/surveys.html',
        resolve: {
          authenticate(userService, $state, $rootScope) {
            userService.getUser().then(response => {
              if (response === 'NOPE') {
                event.preventDefault();
                $state.go('login');
              }
            });
          },
        },
      });
  });
