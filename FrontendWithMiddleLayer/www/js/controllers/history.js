angular.module('starter.controllers')
.controller('HistoryCtrl', function($scope, $stateParams,$ionicHistory, $http, $window, 
  LoginService,DocumentService, FolderService, PublishDocumentService, BackendPath,
  UserFactory, DocumentFactory, FolderFactory) {
  $ionicHistory.nextViewOptions({
    disableBack: true
  });

  $http.get(BackendPath.middleLayer+'/history/'+$stateParams.folderId).then(function(resp){
    if(resp.status == 200){
      $scope.folder = resp.data;
      $scope.documents = resp.data.documentList;
      $scope.noDocument = function(){ 
        return false;
      }
    }
    else{
      $scope.noDocument = function(){
        return true;
      }
    }
  });

  $scope.delete = function(docId){
    FolderService.delete($stateParams.folderId);
    $window.location.reload();
    }
  $scope.publish = function(docId, docName){
    console.log('publish document: '+docId)
    DocumentService.publish(docId)
    PublishDocumentService.addDocument(docId, docName)
    console.log('change folder status: '+$stateParams.folderId)
    $window.location.href=('#/app/doc');
  }

  $scope.isLast = function(check) {
    var cssClass = check ? 'last' : null;
    return cssClass;
  };
     
})

