angular.module('starter.controllers')

.factory('ApproverListFactory', function($http, BackendPath) {

   var approverList = {};

   approverList.addApproverList = function(documentId, approverIdList){
    return $http.get(BackendPath.approverListServicePath+'/addApproverList?documentId='+documentId+'&&approverIdList='+approverIdList)
    .then(function(resp){
      return resp;
    }, function(resp){
      return resp;
    })
     
   }

   approverList.update = function(documentId, approverIdList){
    return $http.get(BackendPath.approverListServicePath+'/update?documentId='+documentId+'&&approverIdList='+approverIdList)
    .then(function(resp){
      return resp;
    }, function(resp){
      return resp;
    })
   }

   approverList.approve = function(documentId){
    return $http.get(BackendPath.approverListServicePath+'/approve?documentId='+documentId)
    .then(function(resp){
      return resp;
    }, function(resp){
      return resp;
    })
   }
   
   return user;
})