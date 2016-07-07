angular.module('starter.controllers')
.controller('DocumentReviewCtrl', function($scope, $stateParams,$ionicHistory, $http, $window, 
  ReviewService, FileService, BackendPath,
  UserFactory, DocumentFactory, FileFactory, FolderFactory, ApproverListFactory) {
  $ionicHistory.nextViewOptions({
    disableBack: true
  });

  var approverId = "";


  FolderFactory.getFolder($stateParams.folderId).then(function(resp){
    if(resp.status == 200){
      $scope.folder = resp.data;
      $scope.versions = {};
      var j = 0;
      for (var i = 0; i < $scope.folder.documentList.length; i++) {
        var tempDocId = $scope.folder.documentList[i];
        DocumentFactory.getDocument(tempDocId).then(function(resp){
            if(resp.status == 200){ 
              var temp = {};
              temp.version = resp.data.version;
              temp.docId = tempDocId;
              $scope.versions[j] = temp;
              $scope.versions[j].docId = resp.data.documentId;
              j++;
            }
            else{ console.log('cannot reach '+BackendPath.documentServicePath); } 
          });
      };
    }
    else{
      console.log('cannot reach '+BackendPath.folderServicePath);
    }
  });
  

  $scope.doc = {};
  DocumentFactory.getDocument($stateParams.docId).then(function(resp){
    if(resp.status == 200){
      $scope.doc = resp.data;
      approverId = $scope.doc.approver;

      

      UserFactory.getUser($scope.doc.creator).then(function(resp){
        if(resp.status == 200){ $scope.creator = resp.data; }
        else{ $scope.creator = "Not available"; }
      });
      UserFactory.getUser($scope.doc.approver).then(function(resp){
        if(resp.status == 200){ $scope.approver = resp.data; }
        else{ $scope.approver = "Not available"; }
      });

      $scope.closeUploadedFiles = function(){
        $scope.showUploadedFileList = function(){
          return false;
        }
      }
      $scope.download = function(fileId){
        FileService.download(fileId);
      }

      FileFactory.allFileDetail($stateParams.docId).then(function(resp){
        if(resp.status == 200){
          $scope.files = resp.data;
          console.log($scope.files)
          $scope.numberOfFiles = $scope.uploadFileDetail.length;
          }
      })
        

    }
    else{ console.log('cannot reach '+BackendPath.documentServicePath) }
        
  });


    $scope.reviewtext = "";
    $scope.approve = function(){
      if($scope.reviewtext == ""){
        $scope.reviewtext = 'Approved!';
      }
      ApproverListFactory.approve($stateParams.docId).then(function(resp){
        if(resp.status == 200){
          console.log(resp.data)
          DocumentFactory.changeApprover($stateParams.docId, resp.data).then(function(resp){
            if(resp.status == 200){
              console.log('changed approver')
            }
            else {
              console.log(resp.status)
            }
          })
        }
        else {
          console.log('cannot reach -> approve on ApproverList')
          console.log(resp)

        }
      })
      ReviewService.approve($stateParams.docId,approverId,$scope.reviewtext);

    }
    $scope.reject = function(){
      ReviewService.reject($stateParams.docId,approverId,$scope.reviewtext);
    }

})