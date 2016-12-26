angular.module('starter.controllers')

.factory('UserFactory', function($http, BackendPath) {

   var user = {};

   user.getUser = function(userId){
    return $http.get(BackendPath.userServicePath+'/user/'+userId)
    .then(function(resp){
      return resp;
    }, function(resp){
      return resp;
    })
     
   }

   user.getUsers = function(){
    return $http.get(BackendPath.userServicePath+'/users')
    .then(function(resp){
      return resp;
    }, function(resp){
      return resp;
    })
     
   }
   
   return user;
})