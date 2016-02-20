angular.module('starter.controllers')
.controller('DocumentListCtrl', function($scope, $stateParams,$ionicHistory, $http, $window, FolderService, DocumentService) {
  $ionicHistory.nextViewOptions({
    disableBack: true
  });

  

  $scope.delete = function(folderId){
    FolderService.delete(folderId);
    $window.location.href=('#/app/doc');
  }

  $http.get('http://localhost:8085/getFolderByCreatorId?creatorId=1')
    .success(function(data){
      console.log('return folders')
      $scope.folders = data;
      var temp = {};
      for (var i = 0; i < $scope.folders.length; i++) {
        var index = $scope.folders[i].documentList.length - 1;
        $scope.folders[i].lastDocId = $scope.folders[i].documentList[index];
        var tempLastDocId = $scope.folders[i].documentList[index];
        temp[i] = $scope.folders[i].documentList[index];

      };
      var j = 0;
      for (var i = 0; i < $scope.folders.length; i++) {
        console.log(temp[i])
        $http.get('http://localhost:8081/getdocument?documentid='+temp[i])
          .success(function(data){

            for (var j = 0; j < $scope.folders.length; j++) {
           
              if(temp[j] == data.documentId){
                $scope.folders[j].lastDocData = data;
                if($scope.folders[j].lastDocData.editable == false){
                  DocumentService.editable($scope.folders[j].lastDocId, true);
                }
                break;
              }
            };
            
              

            
            
          })
          .error(function(data){
            console.log('cannot reach document-service port 8081')
          });
        
      };


      if($scope.folders.length == 0){
        $scope.noDocument = function(){
          return true;
        } 
      }
      else{
        return false;
      }


      
    })
    .error(function(data){
          console.log('cannot reach folder-service port 8085')
          console.log(data)
    });

   

  $http.get('http://localhost:8082/getuser?userid=56a0d083d4c607b2e7a60a5c')
    .success(function(data){
      $scope.user = data;
    })
    .error(function(data){
      console.log('cannot reach user-service port 8082')
    });


  

        
})

