angular.module('starter.controllers')
.controller('AddNewDocumentCtrl', function($window, $http, $scope, $stateParams,$ionicHistory,Upload, FileService, DocumentService) {
  $ionicHistory.nextViewOptions({
    disableBack: true
  });

  $scope.doc = {};
  var blank = {};
  $scope.savedDocData = null;

  $scope.upload = function (file) {
    if(!$scope.savedDocData){
    if(!$scope.doc.name){ $scope.doc.name = "Untitled"; }
    if(!$scope.doc.desc){ $scope.doc.desc = "no description";}
    console.log($scope.doc);

      $http({
        method: 'POST',
        url: 'http://localhost:8081/newdraft',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function(obj) {
            var str = [];
            for(var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
        },
        data: {documentName:$scope.doc.name, description:$scope.doc.desc, creator:1}
      
    }).
    success(function(data, status, headers, config) {
        console.log('sent POST request: successfully create new draft');
        console.log(data);
        $scope.savedDocData = data;
        FileService.upload(file,data.documentId);
        
      }).
      error(function(data, status, headers, config) {
        console.log('cannot reach document-service port 8081')
      });

    }

    else{
      FileService.upload(file,$scope.savedDocData.documentId);
      
    }   
  };

  $scope.save = function(){
    console.log($scope.doc);
    if(!$scope.savedDocData){
      console.log("creating new draft")
      $http({
        method: 'POST',
        url: 'http://localhost:8081/newdraft',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function(obj) {
            var str = [];
            for(var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
        },
        data: {documentName:$scope.doc.name, description:$scope.doc.desc, creator:1}
      
    }).
    success(function(data, status, headers, config) {
        console.log('sent POST request: successfully create new draft');
        console.log(data);
        $scope.savedDocData = data;
        $window.location.href=('#/app/doclist');
      }).
      error(function(data, status, headers, config) {
        console.log('cannot reach document-service port 8081')
      });
    }

    else {
      console.log("updating current draft")
      DocumentService.save($scope.savedDocData.documentId,$scope.doc.name,$scope.doc.desc);
    }
    
    
  }
  
  $scope.submit = function(){
    console.log($scope.doc);
    if(!$scope.savedDocData){
      console.log("creating new document");
      DocumentService.newdoc($scope.doc.name,$scope.doc.desc,1);

    }
    else {
      console.log("updating current document")
      DocumentService.save($scope.savedDocData.documentId,$scope.doc.name,$scope.doc.desc);
      DocumentService.submit($scope.savedDocData.documentId);

    }
    
  }

  $scope.reset = function(){
    if(!$scope.savedDocData){
       $scope.doc = angular.copy(blank);
    }
    else{
      DocumentService.delete($scope.savedDocData.documentId);
      document.getElementById("filename").style.display = "none";
      $scope.doc = angular.copy(blank);
    }
   
  }

})