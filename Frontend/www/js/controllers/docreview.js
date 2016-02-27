angular.module('starter.controllers')
.controller('DocumentReviewCtrl', function($scope, $stateParams,$ionicHistory, $http, $window, ReviewService,FileService,ReviewService,BackendPath,UserService) {
  $ionicHistory.nextViewOptions({
    disableBack: true
  });

  var approverid = "";

   $http.get(BackendPath.folderServicePath+'/folder?folderId='+$stateParams.folderId)
    .success(function(data){
      $scope.folder = data;
      
      $scope.versions = {};
      var j = 0;
      for (var i = 0; i < $scope.folder.documentList.length; i++) {
        var tempDocId = $scope.folder.documentList[i];
        $http.get(BackendPath.documentServicePath+'/getDocument?documentId='+tempDocId)
          .success(function(data){
            var temp = {};
            temp.version = data.version;
            temp.docId = tempDocId;
            $scope.versions[j] = temp;
            $scope.versions[j].docId = data.documentId;
            j++;

            
            
          })
          .error(function(data){
            console.log('cannot reach '+BackendPath.documentServicePath)

          });
      };


    })
    .error(function(data){
      console.log('cannot reach '+BackendPath.folderServicePath)
    });

  $http.get(BackendPath.documentServicePath+'/getDocument?documentId='+$stateParams.docId)
    .success(function(data){
      $scope.doc = data;
      approverid = $scope.doc.approver;

      $scope.download = function(){
          FileService.download($stateParams.docId);   
      }

      $scope.creator = {};
      UserService.getUser($scope.doc.creator).then(function(resp){
        $scope.creator = resp.data;
      });

      $scope.approver = {};
      UserService.getUser($scope.doc.approver).then(function(resp){
        $scope.approver = resp.data;
      });

        $http.get(BackendPath.fileServicePath+'/fileDetail?documentId='+$scope.doc.documentId)
        .success(function(data){
          $scope.filename = data;
            
        })
        .error(function(data){
          console.log('cannot reach '+BackendPath.fileServicePath)
          console.log(data)
        });
        
        

    })
    .error(function(data){
      console.log('cannot reach '+BackendPath.documentServicePath)
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