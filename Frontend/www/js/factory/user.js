angular.module('starter.controllers')

.factory('UserFactory', function($http, BackendPath) {

   var userService = {};

   userService.getUser = function(userId){
    return $http.get(BackendPath.userServicePath+'/user?userId='+userId)
    .success(function(data){
      return data;
    })
    .error(function(data){
      console.log('cannot reach '+BackendPath.userServicePath)
      return data;
    });
     
   }

   return userService;
})