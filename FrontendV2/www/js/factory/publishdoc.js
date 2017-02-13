angular.module('starter.controllers')
.factory('PublishDocumentFactory', function($http, BackendPath) {

   var doc = {};

   doc.getDocument = function(docId){
    return $http.get(BackendPath.documentServicePath+'/getDocument?documentId='+docId)
    .then(function(resp){
      return resp;
    }, function(resp){
      return resp;
    })
     
   }

   return doc;
})