angular.module('starter.controllers')
.controller('FolderListCtrl', function($scope, $stateParams,$ionicHistory, $http, $window, FolderService) {
  $ionicHistory.nextViewOptions({
    disableBack: true
  });
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
    if (!$scope.folderName){
      FolderService.newFolder($scope.folderName, 1);
      $window.location.reaload();
    }
    else {
      alert('please enter foldername')
    }


  }

  $http.get('http://localhost:8085/getFolderByCreatorId?creatorId=1')
        .success(function(data){
          console.log('successfully add new document')
          $scope.folders = data;
          console.log($scope.folders)
        })
        .error(function(data){
          console.log('cannot reach folder-service port 8085')
          console.log(data)
        });


  

        
})

