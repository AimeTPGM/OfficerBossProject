angular.module('starter.controllers')
.factory('FileFactory', function($http, BackendPath) {

   var filedetail = {};

   filedetail.getFilename = function(docId){
    return $http.get(BackendPath.fileServicePath+'/fileDetail?documentId='+docId)
    .then(function(resp){
      return resp.data;
    }, function(resp){
      return resp;
    })
   }

   return filedetail;
})