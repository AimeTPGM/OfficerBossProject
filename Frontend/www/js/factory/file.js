angular.module('starter.controllers')
.factory('FileFactory', function($http, BackendPath) {

   var filedetail = {};

   filedetail.getFilename = function(docId){
    return $http.get(BackendPath.fileServicePath+'/fileDetail?documentId='+docId)
    .success(function(data){
      return data;
    })
    .error(function(data){
      console.log('cannot reach '+BackendPath.fileServicePath)
      return data;
    });
     
   }

   return filedetail;
})