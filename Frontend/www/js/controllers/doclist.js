angular.module('starter.controllers')
.controller('DocumentListCtrl', function($scope, $stateParams,$ionicHistory, $http, $window, DocumentService) {
  $ionicHistory.nextViewOptions({
    disableBack: true
  });
  $scope.documents = {};
  console.log($stateParams)
  $http.get('http://localhost:8085/folder?folderId='+$stateParams.folderId)
  .success(function(data){
    console.log(data)
    $scope.folder = data;
    
  })
  .error(function(data){
      console.log('cannot reach folder-service port 8085')
  });


  // //For each user
  // $http.get('http://localhost:8081/getalldocumentsbyuserid?userid=1')
  // .success(function(data){
  //   $scope.documents = data;
  //   $http.get('http://localhost:8082/getuser?userid=1')
  //   .success(function(data){
  //     $scope.user = data;
  //   })
  //   .error(function(data){
  //     console.log('cannot reach user-service port 8082')
  //   });
  // })


  // .error(function(data){
  //     console.log('cannot reach document-service port 8081')
  // });

  $scope.delete = function(docId){
    DocumentService.delete(docId);

    $window.location.reload();
    }
  $scope.publish = function(docId){
      DocumentService.publish(docId)
    }  
        
})

