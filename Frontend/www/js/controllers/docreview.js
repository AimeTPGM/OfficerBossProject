angular.module('starter.controllers')
.controller('DocumentReviewCtrl', function($scope, $stateParams,$ionicHistory, $http, $window, 
  ReviewService, FileService, BackendPath, LoginService,
  UserFactory, DocumentFactory, FileFactory, FolderFactory, ApproverListFactory, ReviewFactory) {
  $ionicHistory.nextViewOptions({
    disableBack: true
  });

  var userId = LoginService.user.userId;


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
                console.log(resp.data.approverIdList[i]);
                UserFactory.getUser(resp.data.approverIdList[i]).then(function(resp){
                  if(resp.status == 200){ 
                    for (var j = 0; j < idList.length; j++) {
                      if (resp.data.userId == idList[j]) {
                       
                        $scope.approverList[j] = resp.data;
                        ReviewFactory.getReview($stateParams.docId, idList[j]).then(function(resp){
                          if(resp.status == 200){ 
                            console.log(resp)
                            if(resp.data == ""){
                              $scope.approverList[j].review = [];
                              $scope.approverList[j].review.reviewStatus = "";
                              $scope.approverList[j].review.reviewDesc = "Currently no data";
                            }
                            else if (resp.data.approverId == idList[j]) {
                              $scope.approverList[j].review = [];
                              $scope.approverList[j].review.reviewStatus  = resp.data.reviewStatus;
                              $scope.approverList[j].review.reviewDesc = resp.data.reviewDesc;
                             
                            }
                          }
                          else{ $scope.creator = "Not available"; }
                        });
                        break;
                      }
                    };
                    


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
        if(resp.status == 200){

         $scope.doc.creator = resp.data; 
         console.log($scope.doc.creator)
       }
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
          $scope.numberOfFiles = $scope.files.length;
          if ($scope.numberOfFiles > 0){
            $scope.haveFiles = function(){
              return true;
            }
            $scope.showUploadedFiles = function(){
              $scope.showUploadedFileList = function(){
                return true;
              }
              $scope.closeUploadedFiles =function(){
                $scope.showUploadedFileList = function(){
                  return false;
                }
              }
            }
          }
          else{
            $scope.showNone = function(){
              return true;
            }
          }
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
            ReviewService.approve($stateParams.docId,userId,$scope.reviewtext);
            ReviewService.changeDocumentToApprove($stateParams.docId);
          }
          else {
            DocumentFactory.changeApprover($stateParams.docId, resp.data).then(function(resp){
            if(resp.status == 200){
              console.log('changed approver')
              ReviewService.approve($stateParams.docId,userId,$scope.reviewtext);
              $window.location.href=('#/app/doclistforboss');
            }
            else {
              console.log(resp.status)
            }
          })

          }
          
        }
        else {
          console.log('cannot reach -> approve on ApproverList')
          console.log(resp)

        }
      })
      

    }
    $scope.reject = function(){
      ReviewService.reject($stateParams.docId,userId,$scope.reviewtext);
    }
        

    }
    else{ console.log('cannot reach '+BackendPath.documentServicePath) }
        
  });


    

})