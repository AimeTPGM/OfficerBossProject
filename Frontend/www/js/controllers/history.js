angular.module('starter.controllers')
.controller('HistoryCtrl', function($scope, $stateParams,$ionicHistory, $http, $window, DocumentService, FolderService) {
  $ionicHistory.nextViewOptions({
    disableBack: true
  });
  
  $http.get('http://localhost:8085/folder?folderId='+$stateParams.folderId)
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
      $http.get('http://localhost:8081/getDocument?documentId='+$scope.folder.documentList[i])
          .success(function(data){


            for (var j = 0; j < $scope.documents.length; j++) {
              if($scope.documents[j] == data.documentId){
                $scope.documents[j] = data;
                $http.get('http://localhost:8082/getuser?userid='+data.approver)
                  .success(function(data){
                    $scope.approver = data;

                  })
                  .error(function(data){
                    console.log('cannot reach user-service port 8082')
                  });

                break;
              }
            };

            
            

          })
          .error(function(data){
            console.log('cannot reach user-service port 8082')
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
      console.log('cannot reach folder-service port 8085')
  });


  $scope.delete = function(docId){
    DocumentService.delete(docId);

    $window.location.reload();
    }
  $scope.publish = function(docId){
    console.log('publish document: '+docId)
      DocumentService.publish(docId)
      console.log('change folder status: '+$stateParams.folderId)

    }

    $scope.isLast = function(check) {
    var cssClass = check ? 'last' : null;
    return cssClass;
    };

  
        
})

