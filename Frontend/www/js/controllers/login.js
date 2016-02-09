angular.module('starter.controllers')
.controller('LoginCtrl', function($scope, $ionicModal, $timeout, $state, $http,$window) {
    $scope.goto=function(toState,params){ 
     $state.go(toState,params) 
    }

    $scope.email = "";
    $scope.pw = "";

    $scope.login = function(){
      $http({
        method: 'POST',
        url: 'http://localhost:8082/login',
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
        
      })
      .error(function(data, status, headers, config) {
        console.log($scope.email);
        console.log($scope.pw);
        console.log(data);
        console.log(headers);
        console.log('cannot reach user-service port 8082');
      });
      

    }

})
