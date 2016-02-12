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



  }


  

        
})

