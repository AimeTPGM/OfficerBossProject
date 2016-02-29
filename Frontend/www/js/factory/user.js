angular.module('starter.controllers')

.factory('UserFactory', function($http, BackendPath) {

   var user = {};

   user.getUser = function(userId){
    return $http.get(BackendPath.userServicePath+'/user?userId='+userId)
    .success(function(data){
      return data;
    })
    .error(function(data){
      console.log('cannot reach '+BackendPath.userServicePath)
      return data;
    });
     
   }

   user.getUsers = function(){
    return $http.get(BackendPath.userServicePath+'/users')
    .success(function(data){
      return data;
    })
    .error(function(data){
      console.log('cannot reach '+BackendPath.userServicePath)
      return data;
    });
     
   }


   return user;
})