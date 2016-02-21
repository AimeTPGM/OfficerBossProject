angular.module('starter.controllers')
.controller('RegisterCtrl', function($scope, $ionicModal, $timeout, $state,$http,$window) {
    $scope.goto=function(toState,params){ 
     $state.go(toState,params);
    }

    $scope.user = {};
    console.log($scope.user)

    $scope.register = function(){

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