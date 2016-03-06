angular.module('starter.controllers')
.factory('FileFactory', function($http, BackendPath, Upload) {

   var filedetail = {};

   filedetail.getFilename = function(docId){
    return $http.get(BackendPath.fileServicePath+'/fileDetail?documentId='+docId)
    .then(function(resp){
      return resp;
    }, function(resp){
      return resp;
    })
   }

   filedetail.uploadFile = function(file, docId){
    return Upload.upload({
      url: BackendPath.fileServicePath+'/upload',
      method: 'POST',
      data: {file: file, documentId: docId}
    }).then(function (resp) {
      return resp;
      console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
    }, function (resp) {
      return resp;
      console.log('Error status: ' + resp.status);
    }, function (evt) {
      var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
      console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
    });
   }

   filedetail.uploadFiles = function(files,docId){
    if(files && files.length){
      for (var i = 0; i < files.length; i++) {
        Upload.upload({
          url: BackendPath.fileServicePath+'/upload',
          method: 'POST',
          data: {file: files[i], documentId: docId}
        }).then(function (resp) {
          return resp;
          console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
        }, function (resp) {
          return resp;
          console.log('Error status: ' + resp.status);
        }, function (evt) {
          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
          console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
      };
    }
   }

   filedetail.deleteByFileId = function(fileId){
    return $http.get(BackendPath.fileServicePath+'/delete?id='+fileId)
    .then(function(resp){
      return resp;
    }, function(resp){
      return resp;
    })
   }

   filedetail.allFileDetail = function(docId){
    return $http.get(BackendPath.fileServicePath+'/allFileDetail?documentId='+docId)
    .then(function(resp){
      return resp;
    }, function(resp){
      return resp;
    })
   }
   

   return filedetail;
})