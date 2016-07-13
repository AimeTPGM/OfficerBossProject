angular.module('starter.controllers')
.controller('DocumentReviewCtrl', function($scope, $stateParams,$ionicHistory, $http, $window, 
  ReviewService, FileService, BackendPath,
  UserFactory, DocumentFactory, FileFactory, FolderFactory, ApproverListFactory, ReviewFactory) {
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
  $scope.approverList = [];
          ApproverListFactory.getApproverList($stateParams.docId).then(function(resp){
            if(resp.status == 200){
              var idList = resp.data.approverIdList;
              for (var i = 0; i < resp.data.approverIdList.length; i++) {
                
                UserFactory.getUser(resp.data.approverIdList[i]).then(function(resp){
                  if(resp.status == 200){ 
                    for (var j = 0; j < idList.length; j++) {
                      if (resp.data.userId == idList[j]) {
                        idList[j] = resp.data;
                        $scope.approverList[j] = idList[j];
                        break;
                      }
                    };
                    ReviewFactory.getReview($stateParams.docId, idList[i]).then(function(resp){
                    if(resp.status == 200){ 
                    for (var j = 0; j < idList.length; j++) {
                      if(resp.data == ""){
                          $scope.approverList[j].review = "Pending";
                      }
                      else if (resp.data.approverId == idList[j]) {
                          $scope.approverList[j].review  = resp.data.reviewStatus;
                        break;
                      }
                    };

                  }
                  else{ $scope.creator = "Not available"; }
                  
                });


                  }
                  else{ $scope.creator = "Not available"; }
                  
                });
                
              };
              

            }
            else { console.log(resp) }
          })
  

  $scope.doc = {};
  DocumentFactory.getDocument($stateParams.docId).then(function(resp){
    if(resp.status == 200){
      $scope.doc = resp.data;
      var approverId = $scope.doc.approver;

      

      UserFactory.getUser($scope.doc.creator).then(function(resp){
        if(resp.status == 200){ $scope.creator = resp.data; }
        else{ $scope.creator = "Not available"; }
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

    $scope.reviewtext = "";
    $scope.approve = function(){
      if($scope.reviewtext == ""){
        $scope.reviewtext = 'Approved!';
      }
      ApproverListFactory.approve($stateParams.docId).then(function(resp){
        if(resp.status == 200){
          console.log(resp.data)
          if(resp.data == "done"){
            ReviewService.approve($stateParams.docId,approverId,$scope.reviewtext);
            ReviewService.changeDocumentToApprove($stateParams.docId);
          }
          else {
            DocumentFactory.changeApprover($stateParams.docId, resp.data).then(function(resp){
            if(resp.status == 200){
              console.log('changed approver')
              ReviewService.approve($stateParams.docId,approverId,$scope.reviewtext);
            }
            else {
              console.log(resp.status)
            }
          })

          }
          
        }
        else {
          console.log('cannot reach -> approve on ApproverList')
          

        }
      })
      

    }
    $scope.reject = function(){
      ReviewService.reject($stateParams.docId,approverId,$scope.reviewtext);
    }
        

    }
    else{ console.log('cannot reach '+BackendPath.documentServicePath) }
        
  });


    

})