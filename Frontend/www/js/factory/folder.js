angular.module('starter.controllers')
.factory('FolderFactory', function($http, BackendPath) {

   var folder = {};

   folder.getFolder = function(folderId){
    return $http.get(BackendPath.folderServicePath+'/folder?folderId='+folderId)
    .success(function(data){
      return data;
    })
    .error(function(data){
      console.log('cannot reach '+BackendPath.folderServicePath)
      return data;
    });
     
   }

   return folder;
})