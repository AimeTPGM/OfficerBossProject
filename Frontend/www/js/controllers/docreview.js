angular.module('starter.controllers')
.controller('DocumentReviewCtrl', function($scope, $stateParams,$ionicHistory, $http, $window, ReviewService,FileService,ReviewService) {
  $ionicHistory.nextViewOptions({
    disableBack: true
  });

  var approverid = "";

   $http.get('http://localhost:8085/folder?folderId='+$stateParams.folderId)
    .success(function(data){
      $scope.folder = data;
      
      $scope.versions = {};
      var j = 0;
      for (var i = 0; i < $scope.folder.documentList.length; i++) {
        var tempDocId = $scope.folder.documentList[i];
        $http.get('http://localhost:8081/getDocument?documentId='+tempDocId)
          .success(function(data){
            var temp = {};
            temp.version = data.version;
            temp.docId = tempDocId;
            $scope.versions[j] = temp;
            $scope.versions[j].docId = data.documentId;
            j++;

            
            
          })
          .error(function(data){
            console.log('cannot reach document-service port 8081')

          });
      };


    })
    .error(function(data){
      console.log('cannot reach folder-service port 8085')
    });

  $http.get('http://localhost:8081/getDocument?documentId='+$stateParams.docId)
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
        $http.get('http://localhost:8084/fileDetail?documentId='+$scope.doc.documentId)
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
      ReviewService.approve($stateParams.docId,approverid,$scope.reviewtext,$stateParams.folderId);

    }
    $scope.reject = function(){

      ReviewService.reject($stateParams.docId,approverid,$scope.reviewtext);
    }

})