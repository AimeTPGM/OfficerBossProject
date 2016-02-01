// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })
    .state('register', {
    url: '/register',
    templateUrl: 'templates/register.html',
    controller: 'RegisterCtrl'
  })
    .state('forgotpw', {
    url: '/forgotpw',
    templateUrl: 'templates/forgotpw.html',
    controller: 'ForgotPasswordCtrl'
  })
    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
    .state('app.doclist', {
      url: '/doclist',
      views: {
        'menuContent': {
          templateUrl: 'templates/doclist.html',
          controller: 'DocumentListCtrl'
        }
      }
    })
    .state('app.doclistforboss', {
      url: '/doclistforboss',
      views: {
        'menuContent': {
          templateUrl: 'templates/boss/doclist.html',
          controller: 'DocumentListForBossCtrl'
        }
      }
    })
    .state('app.adddoc', {
      url: '/adddoc',
      views: {
        'menuContent': {
          templateUrl: 'templates/adddoc.html',
          controller: 'AddNewDocumentCtrl'
        }
      }
    })
    .state('app.editdoc', {
      url: '/editdoc/:docId',
      views: {
        'menuContent': {
          templateUrl: 'templates/editdoc.html',
          controller: 'EditDocumentCtrl'
        }
      }
    })

    .state('app.docdetail', {
      url: '/docdetail/:docId',
      views: {
        'menuContent': {
          templateUrl: 'templates/docdetail.html',
          controller: 'DocumentDetailCtrl'

        }
      }
    })
    .state('app.review', {
      url: '/review/:docId',
      views: {
        'menuContent': {
          templateUrl: 'templates/review.html',
          controller: 'DocumentReviewCtrl'

        }
      }
    })
;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});
