angular.module('starter.controllers')
.controller('HistoryCtrl', function($scope, $stateParams,$ionicHistory, $http, $window, 
  LoginService,DocumentService, FolderService, PublishDocumentService, BackendPath,
  UserFactory, DocumentFactory, FolderFactory) {
  $ionicHistory.nextViewOptions({
    disableBack: true
  });

  FolderFactory.getFolder($stateParams.folderId).then(function(resp){
    if(resp.status == 200){
      $scope.folder = resp.data;
      $scope.documents = {};
      if($scope.folder.numberOfDocuments > 0){
      console.log('this folder has '+$scope.folder.numberOfDocuments+' documents')
      $scope.noDocument = function(){
        return false;
      }
      var j = 0;
      $scope.documents = $scope.folder.documentList;
      for (var i = 0; i < $scope.folder.numberOfDocuments; i++) {
        console.log($scope.folder.documentList[i])
        DocumentFactory.getDocument($scope.folder.documentList[i]).then(function(resp){
          if(resp.status == 200){
            for (var j = 0; j < $scope.documents.length; j++) {
                if($scope.documents[j] == resp.data.documentId){
                  $scope.documents[j] = resp.data;
                  $scope.creator = {};
                  UserFactory.getUser(data.approver).then(function(resp){
                    $scope.approver = resp.data;
                  });
                  break;
                }
            };
          }
          else{ console.log('cannot reach '+BackendPath.documentServicePath) }
        });
       };
      }
      else{
        $scope.noDocument = function(){
          return true;
        }
      }
    }
    else{ console.log('cannot reach '+BackendPath.folderServicePath) }
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

