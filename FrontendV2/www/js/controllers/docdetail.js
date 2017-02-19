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

    DocumentFactory.getDocument($stateParams.docId, $stateParams.folderId).then(function(resp){
        if(resp.status == 200){
          $scope.folder = resp.data[0];
          $scope.doc = resp.data[1];
          $scope.versions = resp.data[2];
          console.log($scope.versions)
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
              }
              $scope.submit = function(versionType){
                  console.log(versionType);
                  if(docStatus == 'Draft'){
                    $window.location.href=('#/app/doc/'+data.id+'/'+$scope.savedDocData.documentId+'/approver');
                    
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
                      data: {
                        documentName:$scope.doc.documentName, 
                        description:$scope.doc.description, 
                        documentId: $stateParams.docId, 
                        folderId: $stateParams.folderId
                      }
                    
                      }).success(function(data, status, headers, config) {
                        $scope.savedFolder = data[0];
                        $scope.savedDocData = data[1];
                        $window.location.href=('#/app/doc/'+$scope.savedFolder.id+'/'+$scope.savedDocData.documentId+'/edit');
                        

                      }).
                      error(function(data, status, headers, config) {
                        console.log('cannot reach '+BackendPath.documentServicePath)
                      });
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
