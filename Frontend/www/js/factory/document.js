angular.module('starter.controllers')
.factory('DocumentFactory', function($http, BackendPath) {

   var doc = {};

   doc.getDocument = function(docId){
    return $http.get(BackendPath.documentServicePath+'/getDocument?documentId='+docId)
    .success(function(data){
      return data;
    })
    .error(function(data){
      console.log('cannot reach '+BackendPath.documentServicePath)
      return data;
    });
     
   }

   return doc;
})