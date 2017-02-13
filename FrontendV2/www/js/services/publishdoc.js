angular.module('starter.controllers')

.service('PublishDocumentService', function($http,BackendPath) {

  this.addDocument = function(docId, docName){
    $http.get(BackendPath.publishDocumentServicePath+'/addPublishDocument?documentId='+docId+'&documentName='+docName)
        .success(function(data){
          console.log('successfully add new publish document')
        })
        .error(function(data){
          console.log('cannot reach '+BackendPath.publishDocumentServicePath)
          console.log(data)
        });
  }
})
