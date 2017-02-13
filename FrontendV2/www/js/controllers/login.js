angular.module('starter.controllers')
.service('LoginService', function() {
  this.credential = false;
  this.user = {};
  this.setCredential = function(credential, user){
    this.credential = credential;
    this.user = user;
  }

})

.controller('LoginCtrl', function($scope, $ionicModal, $timeout, $state, $http,$window,LoginService) {
    /**
    * Boss
    * Boss1
    * boss@test.com
    * boss
    *
    * Boss2
    * boss2@test.com
    * boss
    *
    * Boss3
    * boss3@test.com
    * boss
    * 
    * Officer
    * officer1@test.com
    * officer
    * 
    * Officer2
    * officer2@test.com
    * officer
    */

    /**
    * John Doe
    * john@doe.test
    * test
    **/



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
        url: 'http://localhost:5001/login',
        headers: {
            'Content-type': 'application/json'
        },
        data: {email:$scope.email, password:$scope.pw}
        
    })
      .success(function(data, status, headers, config) {
        if (data.response == false){
            console.log($scope.email);
            console.log($scope.pw);
            console.log(data);
        }
        else {
            LoginService.setCredential(true, data);
            console.log(LoginService.credential)
            console.log(LoginService.user)
            $window.location.href=('#/app/doc');
            
        }
        
        // if (data.userStatus == 'Officer'){
        //   $window.location.href=('#/app/doc');
        // }
        // else if(data.userStatus == 'Boss'){
        //   $window.location.href=('#/app/doclistforboss'); 
        // }
      })
      .error(function(data, status, headers, config) {
        console.log($scope.email);
        console.log($scope.pw);
        console.log(data);
        console.log(headers);
        console.log('cannot reach user-service');
      });
      

    }

})
