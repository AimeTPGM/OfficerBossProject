angular.module('starter.controllers')
.controller('ForgotPasswordCtrl', function($scope, $ionicModal, $timeout, $state) {
    $scope.goto=function(toState,params){ 
     $state.go(toState,params) 
    }
})
