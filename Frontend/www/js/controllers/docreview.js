angular.module('starter.controllers')
.controller('DocumentReviewCtrl', function($scope, $stateParams,$ionicHistory, $http, $window, ReviewService,FileService) {
  $ionicHistory.nextViewOptions({
    disableBack: true
  });

  var documentid = $stateParams.docId;
  var approverid = "";

  $http.get('http://localhost:8081/getdocument?documentid='+$stateParams.docId)
    .success(function(data){
      $scope.doc = data;
      approverid = $scope.doc.approver;

      $scope.download = function(){
          FileService.download($stateParams.docId);   
      }

      $http.get('http://localhost:8082/getuser?userid='+$scope.doc.creator)
        .success(function(data){
          $scope.creator = data;
            
        })
        .error(function(data){
          console.log('cannot reach user-service port 8082')
        });
      $http.get('http://localhost:8082/getuser?userid='+$scope.doc.approver)
        .success(function(data){
          $scope.approver = data;
            
        })
        .error(function(data){
          console.log('cannot reach user-service port 8082')
        });
        $http.get('http://localhost:8084/filedetail?documentId='+$scope.doc.documentId)
        .success(function(data){
          $scope.filename = data;
            
        })
        .error(function(data){
          console.log('cannot reach file-service port 8084')
          console.log(data)
        });
        
        

    })
    .error(function(data){
      console.log('cannot reach document-service port 8081')
    });
    $scope.reviewtext = "";
    $scope.approve = function(){
      if($scope.reviewtext == ""){
        $scope.reviewtext = 'Approved!';
      }
      ReviewService.approve($stateParams.docId,approverid,$scope.reviewtext);

    }
    $scope.reject = function(){

      ReviewService.reject($stateParams.docId,approverid,$scope.reviewtext);
    }

})