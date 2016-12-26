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
    .state('app.preferences', {
      url: '/preferences',
      views: {
        'menuContent': {
          templateUrl: 'templates/preferences.html',
          controller: 'PreferencesCtrl'
        }
      }
    })
    .state('app.doc', {
      url: '/doc',
      views: {
        'menuContent': {
          templateUrl: 'templates/document/doclist.html',
          controller: 'DocumentListCtrl'
        }
      }
    })
    .state('app.history', {
      url: '/doc/:folderId/history',
      views: {
        'menuContent': {
          templateUrl: 'templates/document/history.html',
          controller: 'HistoryCtrl'
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
    .state('app.newdoc', {
      url: '/doc/new',
      views: {
        'menuContent': {
          templateUrl: 'templates/document/adddoc.html',
          controller: 'AddNewDocumentCtrl'
        }
      }
    })
    .state('app.editdoc', {
      url: '/doc/:folderId/:docId/edit',
      views: {
        'menuContent': {
          templateUrl: 'templates/document/editdoc.html',
          controller: 'EditDocumentCtrl'
        }
      }
    })
    // .state('app.approver', {
    //   url: '/doc/:folderId/:docId/approver',
    //   views: {
    //     'menuContent': {
    //       templateUrl: 'templates/document/approver.html',
    //       controller: 'ApproverCtrl'
    //     }
    //   }
    // })
    .state('app.approver', {
      url: '/doc/:folderId/:docId/approver',
      views: {
        'menuContent': {
          templateUrl: 'templates/org.html',
          controller: 'OrgCtrl'
        }
      }
    })
    .state('organization', {
      url: '/org',
      templateUrl: 'templates/org.html',
      controller: 'OrgCtrl'
    })

    .state('app.docdetail', {
      url: '/doc/:folderId/:docId',
      views: {
        'menuContent': {
          templateUrl: 'templates/document/docdetail.html',
          controller: 'DocumentDetailCtrl'

        }
      }
    })
    .state('app.review', {
      url: '/doc/:folderId/:docId/review',
      views: {
        'menuContent': {
          templateUrl: 'templates/boss/review.html',
          controller: 'DocumentReviewCtrl'

        }
      }
    })
    .state('app.publishdocument', {
        url: '/publish',
        views: {
        'menuContent': {
          templateUrl: 'templates/publish/doclist.html',
          controller: 'PublishDocumentCtrl'

        }
      }
    })
  

    .state('app.dashboard', {
      url: '/dashboard',
      views: {
        'menuContent': {
          templateUrl: 'templates/dashboard.html',
          controller: 'DashboardCtrl'

        }
      }
    })
    .state('app.file', {
      url: '/file',
      views: {
        'menuContent': {
          templateUrl: 'templates/testAddfile.html',
          controller: 'FileCtrl'

        }
      }
    })
;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});
