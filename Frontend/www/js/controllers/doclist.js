angular.module('starter.controllers')
.controller('DocumentListCtrl', function($scope, $stateParams,$ionicHistory, $http, $window, FolderService) {
  $ionicHistory.nextViewOptions({
    disableBack: true
  });

  $scope.tempFolder = {};
  

  $scope.showBtn = function(){
  	return true;
  }

  $scope.showForm = function(){
  	return false;
  }


  $scope.newFolder = function(){
  	$scope.showBtn = function(){
	  	return false;
	  }

	  $scope.showForm = function(){
	  	return true;
	  }

  }

  $scope.addFolder= function(){
  	$scope.showBtn = function(){
	  	return true;
	  }

	  $scope.showForm = function(){
	  	return false;
	  }
    if ($scope.tempFolder.folderName){
      FolderService.newFolder($scope.tempFolder.folderName, 1);
      $window.location.reload();
    }
    else {
      $scope.tempFolder.folderName = "Untitled";
      FolderService.newFolder($scope.tempFolder.folderName, 1);
      $window.location.reload();
    }


  }

  $scope.delete = function(folderId){
    FolderService.delete(folderId);
    
  }

  

  $http.get('http://localhost:8085/getFolderByCreatorId?creatorId=1')
    .success(function(data){
      console.log('return folders')
      $scope.folders = data;
      console.log($scope.folders)
      for (var i = 0; i < $scope.folders.length; i++) {
        var index = $scope.folders[i].documentList.length - 1;
        $scope.folders[i].lastDocId = $scope.folders[i].documentList[index];
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

  $http.get('http://localhost:8082/getuser?userid=1')
    .success(function(data){
      $scope.user = data;
    })
    .error(function(data){
      console.log('cannot reach user-service port 8082')
    });


  

        
})

