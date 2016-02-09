angular.module('starter.controllers')
.controller('FileCtrl', function($scope, $ionicModal, $timeout, $state, $http,FileService) {
    $scope.goto=function(toState,params){ 
     $state.go(toState,params) 
    }

    $scope.upload = function (file) {
      FileService.upload(file, "0");
    }



})