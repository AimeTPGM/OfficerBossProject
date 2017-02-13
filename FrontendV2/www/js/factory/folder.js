angular.module('starter.controllers')
.factory('FolderFactory', function($http, BackendPath) {

   var folder = {};

   folder.getFolder = function(folderId){
    return $http.get(BackendPath.folderServicePath+'/folder?folderId='+folderId)
    .then(function(resp){
      return resp;
    }, function(resp){
      return resp;
    })
     
   }

   folder.getFolderByCreatorId = function(creatorId){
    return $http.get(BackendPath.folderServicePath+'/getFolderByCreatorId?creatorId='+creatorId)
    .then(function(resp){
      return resp;
    }, function(resp){
      return resp;
    })
     
   }

   folder.getFolders = function(){
    return $http.get(BackendPath.folderServicePath+'/folders')
    .then(function(resp){
      return resp;
    }, function(resp){
      return resp;
    })
     
   }

   folder.getFolderByDocumentId = function(docId){
    return $http.get(BackendPath.folderServicePath+'/getFolderByDocumentId?documentId='+docId)
    .then(function(resp){
      return resp;
    }, function(resp){
      return resp;
    })
     
   }

   return folder;
})