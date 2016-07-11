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
  $scope.approverList = [];
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
                    DocumentFactory.changeApprover($stateParams.docId, resp.data.approverIdList[resp.data.currentApproverIdIndex])
                    .then(function(resp){
                      if(resp.status == 200){
                        console.log(resp.data)
                      }
                      else {
                        console.log('cannot determine firstApprover')
                      }
                    })
                    DocumentService.submit($stateParams.docId,versionType);
                    $window.location.href=('#/app/doc');
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
                        DocumentFactory.changeApprover($stateParams.docId, resp.data.approverIdList[resp.data.currentApproverIdIndex])
                        .then(function(resp){
                          if(resp.status == 200){
                            console.log(resp.data)
                          }
                          else {
                            console.log('cannot determine firstApprover')
                          }
                        })
                        DocumentService.submit(data.documentId,versionType);
                        $window.location.href=('#/app/doc');

                      }).
                      error(function(data, status, headers, config) {
                        console.log('cannot reach '+BackendPath.documentServicePath)
                      });
                  }
                }    
              }
              var j = 0;
              for (var i = 0; i < resp.data.approverIdList.length; i++) {
                
                UserFactory.getUser(resp.data.approverIdList[i]).then(function(resp){
                  if(resp.status == 200){ 
                    $scope.approverList = $scope.approverList.concat([resp.data]); 
                   console.log($scope.approverList)
                    ReviewFactory.getReview($stateParams.docId, $scope.approverList[j]).then(function(resp){
                      if(resp.status == 200){ 
                        if(resp.data == ""){
                          $scope.approverList[j].review = "Pending"
                        }
                        else {
                          $scope.approverList[j].review = resp.data;
                        }
                        

                        j++;
                      }
                      else{ $scope.review = "Not available"; }
                    });
              

                  }
                  else{ $scope.creator = "Not available"; }
                  
                });
                console.log($scope.approverList)
              };

            }
            else { console.log(resp) }
          })
  

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