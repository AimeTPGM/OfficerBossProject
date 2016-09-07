angular.module('starter.controllers')
.service('LoginService', function() {
  this.credential = false;
  this.user = {};
  this.setCredential = function(credential, user){
    this.credential = credential;
    this.user = user;
  }

})

.controller('LoginCtrl', function($scope, $ionicModal, $timeout, $state, $http,$window,LoginService,BackendPath) {

    $scope.goto=function(toState,params){ 
     $state.go(toState,params) 
    }

    var empUser = {};
    LoginService.setCredential(false, empUser);

    $scope.email = "";
    $scope.pw = "";
    console.log(LoginService.credential);

    $scope.login = function(){

      $http({
        method: 'POST',
        url: BackendPath+'/login',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function(obj) {
            var str = [];
            for(var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
        },
        data: {email:$scope.email, password:$scope.pw}
      })
      .success(function(data, status, headers, config) {
       
        LoginService.setCredential(true, data);
        console.log(LoginService.credential)
        console.log(LoginService.user)
        if (data.userStatus == 'Officer'){
          $window.location.href=('#/app/doc');
        }
        else if(data.userStatus == 'Boss'){
          $window.location.href=('#/app/doclistforboss'); 
        }
      })
      .error(function(data, status, headers, config) {
        console.log(data);
      });
      

    }

})
