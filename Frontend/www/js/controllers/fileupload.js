angular.module('starter.controllers')
.controller('FileCtrl', function($scope, $ionicModal, $timeout, $state, $http,FileService,Upload,BackendPath) {
    $scope.goto=function(toState,params){ 
     $state.go(toState,params) 
    }

    $scope.upload = function (file) {
      FileService.upload(file, "0");
    }
    $scope.uploadFileDetail = {};
    var j = 0;
    $scope.uploadFiles = function(files){
    	if(files && files.length){
	      for (var i = 0; i < files.length; i++) {
	        Upload.upload({
	          url: BackendPath.fileServicePath+'/upload',
	          method: 'POST',
	          data: {file: files[i], documentId: "1"}
	        }).then(function (resp) {
	          $scope.uploadFileDetail[j] = resp.config.data.file.name;
	          j++;

	          console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
	        }, function (resp) {
	          console.log('Error status: ' + resp.status);
	        }, function (evt) {
	          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
	          console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
	        });
	      };
	    }
    }



})