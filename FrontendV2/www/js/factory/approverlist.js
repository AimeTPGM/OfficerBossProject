angular.module('starter.controllers')

.factory('ApproverListFactory', function($http, BackendPath, $httpParamSerializerJQLike) {

   var approverList = {};

   approverList.getApproverList = function(documentId){
    return $http.get(BackendPath.approverListServicePath+'/approverListByDocumentId?documentId='+documentId)
    .then(function(resp){
      return resp;
    }, function(resp){
      return resp;
    })

   }
   approverList.addApproverList = function(documentId, approverIdList){
    console.log(approverIdList);
    console.log(documentId)
    var list = $httpParamSerializerJQLike(approverIdList);

    return $http({
        method: 'GET',
        url: BackendPath.approverListServicePath+'/addApproverList',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        params: {
          'documentId': documentId, 
          'approverIdList[]' : approverIdList }
      
        }).then(function(resp){
      return resp;
    }, function(resp){
      return resp;
    })
    
     
   }

   approverList.update = function(documentId, approverIdList){
   
    return $http({
        method: 'GET',
        url: BackendPath.approverListServicePath+'/update',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        params: {
          'documentId': documentId, 
          'approverIdList[]' : approverIdList }
      
        })
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

   approverList.copy = function(copyFrom, copyTo){
    return $http.get(BackendPath.approverListServicePath+'/copy?copyFrom='+copyFrom+'&&copyTo='+copyTo)
    .then(function(resp){
      return resp;
    }, function(resp){
      return resp;
    })
   }
   
   return approverList;
})