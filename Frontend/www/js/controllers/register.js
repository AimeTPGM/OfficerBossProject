angular.module('starter.controllers')
.controller('RegisterCtrl', function($scope, $ionicModal, $timeout, $state,$http,$window) {
    $scope.goto=function(toState,params){ 
     $state.go(toState,params);
    }

    $scope.user = {};
    console.log($scope.user)
    $scope.emailCheck = function(){
      var emailFormat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if(emailFormat.test($scope.user.email)){
        $scope.emailCorrect = function(){
          return true;
        }  
      }
      else{
        $scope.emailCorrect = function(){
          return false;
        }
      }
    }
    $scope.passwordCheck = function(){
      if($scope.user.password == $scope.user.confirmpw){
        $scope.passwordMatch = function(){
          return true;
        }
      }
      else{
        $scope.passwordMatch = function(){
          return false;
        }
      }
    }
    $scope.bossRegis = function(){

      $http({
        method: 'POST',
        url: 'http://localhost:8082/newBoss',
        headers: {'Content-Type': 'application/json'},
        data: $scope.user
    
      })
      .success(function(data, status, headers, config) {
        console.log('sent POST request: successfully create new boss');
        console.log(data);


        $window.location.href=('#/login');
      })
      .error(function(data, status, headers, config) {
        console.log(data);
        console.log(headers);
        console.log('cannot reach user-service port 8082');
      });

    }
    $scope.officerRegis = function(){

      $http({
        method: 'POST',
        url: 'http://localhost:8082/newOfficer',
        headers: {'Content-Type': 'application/json'},
        data: $scope.user
    
      })
      .success(function(data, status, headers, config) {
        console.log('sent POST request: successfully create new officer');
        console.log(data);


        $window.location.href=('#/login');
      })
      .error(function(data, status, headers, config) {
        console.log(data);
        console.log(headers);
        console.log('cannot reach user-service port 8082');
      });

    }


})