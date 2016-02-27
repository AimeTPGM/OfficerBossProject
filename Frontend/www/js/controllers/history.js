angular.module('starter.controllers')
.controller('HistoryCtrl', function($scope, $stateParams,$ionicHistory, $http, $window, DocumentService, FolderService,PublishDocumentService,BackendPath,UserService) {
  $ionicHistory.nextViewOptions({
    disableBack: true
  });
  
  $http.get(BackendPath.folderServicePath+'/folder?folderId='+$stateParams.folderId)
  .success(function(data){
    console.log('folder')
    console.log(data)
    $scope.folder = data;
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
      $http.get(BackendPath.documentServicePath+'/getDocument?documentId='+$scope.folder.documentList[i])
          .success(function(data){


            for (var j = 0; j < $scope.documents.length; j++) {
              if($scope.documents[j] == data.documentId){
                $scope.documents[j] = data;
                $scope.creator = {};
                UserService.getUser(data.approver).then(function(resp){
                  $scope.approver = resp.data;
                });
                break;
              }
            };

            
            

          })
          .error(function(data){
            console.log('cannot reach '+BackendPath.documentServicePath)
          });
       
     };
     
        
      
      
    }
    else{
      $scope.noDocument = function(){
        return true;
      }
    }
    
  })
  .error(function(data){
      console.log('cannot reach '+BackendPath.folderServicePath)
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

