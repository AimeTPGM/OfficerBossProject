angular.module('starter.controllers')
.controller('DocumentDetailCtrl', function($scope, $stateParams,$ionicHistory, $http, $window, 
  FileService, DocumentService, FolderService, PublishDocumentService, BackendPath, LoginService,
  UserFactory, DocumentFactory, FileFactory, ReviewFactory, FolderFactory, ApproverListFactory) {
  $ionicHistory.nextViewOptions({
    disableBack: true
  });
  console.log(LoginService.credential)
  console.log(LoginService.user)
  var userId = LoginService.user.userId;
  $scope.showNone = function(){
      return true;
    }
  $scope.showUploadedFiles = function(){
    $scope.showUploadedFileList = function(){
    return true;
    }
  }
  $scope.closeUploadedFiles = function(){
    $scope.showUploadedFileList = function(){
      return false;
    }
  }
  $scope.download = function(fileId){
    FileService.download(fileId);
  }
  $scope.publish = function(docId,docName){
      DocumentService.publish(docId);
      PublishDocumentService.addDocument(docId, docName);
      $window.location.href=('#/app/doc');
  }
  $scope.delete = function(docId){
      FolderService.delete($stateParams.folderId);
      $window.location.href=('#/app/doc');
  }


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
          
          UserFactory.getUser($scope.doc.creator).then(function(resp){
            if(resp.status == 200){ $scope.creator = resp.data; }
            else{ $scope.creator = "Not available"; }
            
          });
          $scope.approverList = [];
          $scope.approverList.review = [];
          ApproverListFactory.getApproverList($stateParams.docId).then(function(resp){
            if(resp.status == 200){
              $scope.selectVersion = function(docId, docStatus){
                $scope.showVersionSelector = function(){
                    return true;
                }
                $scope.hideVersionSelector = function(){
                  $scope.showVersionSelector = function(){
                      return false;
                  }
                }
                $scope.submit = function(versionType){
                  console.log(versionType);
                  if(docStatus == 'Draft'){
                    console.log('here')
                    console.log(resp.data.approverIdList[resp.data.currentApproverIdIndex])
                    console.log(resp.data)

                    DocumentFactory.changeApprover($stateParams.docId, resp.data.approverIdList[resp.data.currentApproverIdIndex].userId)
                    .then(function(resp){
                      if(resp.status == 200){
                        console.log(resp.data)
                        DocumentService.submit($stateParams.docId,versionType);
                        $window.location.href=('#/app/doc');
                      }
                      else {
                        console.log('cannot determine firstApprover')
                        $window.location.href=('#/app/doc');
                      }
                    })
                    
                  }
                  else if(docStatus == 'Reject'){
                    $http({
                    method: 'POST',
                    url: BackendPath.documentServicePath+'/newEditDraft',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: function(obj) {
                      var str = [];
                      for(var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        return str.join("&");
                      },
                      data: {documentName:$scope.doc.documentName, 
                        description:$scope.doc.description, 
                        documentId: $stateParams.docId
                      }
                    
                      }).success(function(data, status, headers, config) {
                        DocumentService.editable($stateParams.docId, false);
                        FolderService.addDocument($stateParams.folderId, data.documentId);
                        DocumentFactory.changeApprover($stateParams.docId, resp.data.approverIdList[resp.data.currentApproverIdIndex].userId)
                        .then(function(resp){
                          if(resp.status == 200){
                            console.log(resp.data)
                            DocumentService.submit(data.documentId,versionType);
                            $window.location.href=('#/app/doc');
                          }
                          else {
                            console.log('cannot determine firstApprover')
                            $window.location.href=('#/app/doc');
                          }
                        })
                        

                      }).
                      error(function(data, status, headers, config) {
                        console.log('cannot reach '+BackendPath.documentServicePath)
                      });
                  }
                }    
              }

              var idList = resp.data.approverIdList;
              for (var i = 0; i < resp.data.approverIdList.length; i++) {
                
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
          
          FileFactory.allFileDetail($stateParams.docId).then(function(resp){
            if(resp.status == 200){ 
              $scope.files = resp.data; 
              $scope.numberOfFiles = $scope.files.length; 
              $scope.showNone = function(){
                return false;
              }
              $scope.haveFiles = function(){
                return true;
              }
            }
            else{
              $scope.showNone = function(){
                return true;
              }
            }
            
          })
          
        }
        else{
          console.log('cannot reach '+BackendPath.documentServicePath)
        }
        
    });

})
