angular.module('starter.controllers')

.factory('ApproverListFactory', function($http, BackendPath) {

   var approverList = {};

   approverList.getUser = function(documentId, approverIdList){
    return $http.get(BackendPath.approverListServicePath+'/addApproverList?documentId='+documentId+'&&approverIdList='+approverIdList)
    .then(function(resp){
      return resp;
    }, function(resp){
      return resp;
    })
     
   }
   
   return user;
})