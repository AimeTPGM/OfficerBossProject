angular.module('starter.controllers')
.controller('DocumentListCtrl', function($scope, $stateParams,$ionicHistory, $http, $window, 
  FolderService, DocumentService, BackendPath, LoginService,
  UserFactory, DocumentFactory, FolderFactory) {
  console.log(LoginService.credential)
  if (LoginService.credential == false){
    $window.location.href=('#/login');
  }
  console.log(LoginService.user)
  var userId = LoginService.user.userId;
  $ionicHistory.nextViewOptions({
    disableBack: true
  });
  $scope.delete = function(folderId){
    FolderService.delete(folderId);
    $window.location.href=('#/app/doc');
  }
  FolderFactory.getFolderByCreatorId(userId).then(function(resp){
    if(resp.status == 200){
      $scope.folders = resp.data;
      if($scope.folders.length == 0){
        $scope.noDocument = function(){
          return true;
          $scope.showNoConnection = function(){
            return false;
          }
        } 
      }

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

        DocumentFactory.getDocument(temp[i]).then(function(resp){
          if(resp.status == 200){
            for (var j = 0; j < $scope.folders.length; j++) {
           
              if(temp[j] == resp.data.documentId){
                $scope.folders[j].lastDocData = resp.data;
                if($scope.folders[j].lastDocData.editable == false){
                  DocumentService.editable($scope.folders[j].lastDocId, true);
                }
                break;
              }


            };


          }
          else{
           console.log('cannot reach '+BackendPath.documentServicePath)
          }
            
        });
      };
      $scope.searchText = "";
      $scope.searchList = {};
      var j = 0;

      $scope.search = function(){
        console.log($scope.searchText);
        for (var i = 0; i < $scope.folders.length; i++) {
          if($scope.folders[i].lastDocData.documentName.indexOf($scope.searchText) > -1){
            $scope.searchList[j] = $scope.folders[i].lastDocId;
            $scope.searchList[j].documentName = $scope.folders[i].lastDocData.documentName
            j++;
          }

        };
        console.log($scope.searchList);
        
      }
    }
    else{
      console.log('cannot reach '+BackendPath.folderServicePath)
      $scope.showNoConnection = function(){ return true; }
    }

  });
       
})

