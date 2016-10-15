angular.module('starter.controllers')
.controller('DocumentDetailCtrl', function($scope, $stateParams,$ionicHistory, $http, $window, 
  FileService, DocumentService, FolderService, PublishDocumentService, BackendPath, LoginService,
  UserFactory, DocumentFactory, FileFactory, ReviewFactory, FolderFactory, ApproverListFactory) {
  $ionicHistory.nextViewOptions({
    disableBack: true
  });
  console.log(LoginService.credential)
  console.log(LoginService.user)
  var userId = LoginService.user.userId;
  $scope.showNone = function(){
      return true;
    }
  $scope.showUploadedFiles = function(){
    $scope.showUploadedFileList = function(){
    return true;
    }
  }
  $scope.closeUploadedFiles = function(){
    $scope.showUploadedFileList = function(){
      return false;
    }
  }
  $scope.download = function(fileId){
    FileService.download(fileId);
  }
  $scope.publish = function(docId,docName){
      DocumentService.publish(docId);
      PublishDocumentService.addDocument(docId, docName);
      $window.location.href=('#/app/doc');
  }
  $scope.delete = function(docId){
      FolderService.delete($stateParams.folderId);
      $window.location.href=('#/app/doc');
  }

  $http.get(BackendPath.middleLayer+'/documentDetail/'+$stateParams.folderId+'/'+$stateParams.docId).then(function(resp){
    if(resp.status == 200){    
      $scope.doc = resp.data;
      if(resp.data.files.length != 0){ 
        $scope.files = resp.data.files; 
        $scope.numberOfFiles = $scope.files.length; 
        $scope.showNone = function(){  return false;  }
        $scope.haveFiles = function(){  return true;  }
      }
      else{  
        $scope.showNone = function(){  return true;  }  
      }
      $http.get(BackendPath.middleLayer+'/history/'+$stateParams.folderId).then(function(resp){
        if(resp.status == 200){
          $scope.folder = resp.data;
          $scope.versions = {};
          console.log(resp.data)
          for (var i = 0; i < resp.data.documentList.length; i++) {
            $scope.versions[i] = [];
            $scope.versions[i].version = resp.data.documentList[i].version;
            $scope.versions[i].docId = resp.data.documentList[i].documentId;
          };
        }
        else{
          console.log('cannot reach '+BackendPath.middleLayer);
        }
      });
    }
    else {
      console.log('cannot reach '+BackendPath.middleLayer)
      console.log(resp)
      }
  });
})
