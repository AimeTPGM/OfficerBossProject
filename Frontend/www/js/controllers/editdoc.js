angular.module('starter.controllers')
.controller('EditDocumentCtrl', function($scope, $stateParams,$ionicHistory,$http, $window, $state,
  UserFactory, FileFactory, DocumentFactory,LoginService,
  DocumentService, FolderService, FileService, Upload, BackendPath, ApproverListFactory, ReviewFactory) {
  $ionicHistory.nextViewOptions({
    disableBack: true
  });
  console.log(LoginService.credential)
  console.log(LoginService.user)
  var userId = LoginService.user.userId;
  $scope.showNone = function(){
      return true;
    }

  
  $scope.closeUploadedFiles = function(){
    $scope.showUploadedFileList = function(){
      return false;
    }
  }
  $scope.download = function(fileId){
    FileService.download(fileId);
  }

  $scope.deleteFileById = function(fileId){
    FileFactory.deleteByFileId(fileId).then(function(resp){
      if(resp.status == 200){
        for (var i = 0; i < $scope.numberOfFiles; i++) {
          if($scope.files[i].id == fileId) {
            $scope.files.splice(i,1);
            console.log($scope.files);
            $scope.numberOfFiles = $scope.files.length;
            if($scope.files.length == 0){
              $scope.showNone = function(){
                return true;
              }
              $scope.haveFiles = function(){
                return false;
              }
            }
          }
        }
      
      }
      else {
        console.log('cannot delete file, file service is not available')
      }
    })
    
  }
  $scope.savedDocData = null;
  var count = 0;

    $scope.files = {};
  $http.get(BackendPath.documentServicePath+'/getDocument?documentId='+$stateParams.docId)
    .success(function(data){
      $scope.doc = data;
      // get creator
      $scope.creator = {};
      UserFactory.getUser($scope.doc.creator).then(function(resp){
        $scope.creator = resp.data;
      });

      $scope.approverList = [];
      ApproverListFactory.getApproverList($stateParams.docId).then(function(resp){
            if(resp.status == 200){
              
              var idList = resp.data.approverIdList;
              $scope.approverList = idList;
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

                  if($scope.doc.documentStatus == 'Draft'){
                    if(!$scope.savedDocData){
                      console.log("updating and submitting current draft : "+versionType)
                      DocumentService.save($stateParams.docId,$scope.doc.documentName,$scope.doc.description);
                      FolderService.update($stateParams.folderId, $scope.doc.documentName);
                      console.log('ApproverList')
                      console.log($scope.approverList)
                      DocumentFactory.changeApprover($stateParams.docId, $scope.approverList[resp.data.currentApproverIdIndex])
                        .then(function(resp){
                          if(resp.status == 200){
                            console.log(resp.data)
                            DocumentService.submit($stateParams.docId,versionType);
                            $window.location.href=('#/app/doc');

                          }
                          else {
                            console.log('cannot change approver')
                            $window.location.href=('#/app/doc');
                          }
                        })
                      
                      
                    }
                    else{
                      console.log("updating and submitting current draft : "+versionType)
                      DocumentService.save($scope.savedDocData.documentId,$scope.doc.documentName,$scope.doc.description);
                      FolderService.update($stateParams.folderId, $scope.doc.documentName);
                      console.log('ApproverList')
                      console.log($scope.approverList)
                      DocumentFactory.changeApprover($stateParams.docId, $scope.approverList[resp.data.currentApproverIdIndex])
                        .then(function(resp){
                          if(resp.status == 200){
                            console.log(resp.data)
                            DocumentService.submit($scope.savedDocData.documentId,versionType);
                            $window.location.href=('#/app/doc');
                          }
                          else {
                            console.log('cannot change approver')
                            $window.location.href=('#/app/doc');
                          }
                        })
                      
                      
                    }
                  } // if 'Draft'
                   else{
                    if(!$scope.savedDocData){
                      DocumentFactory.newEditDraft($stateParams.docId,$scope.doc.documentName,$scope.doc.description).then(function(resp){

                        $scope.savedDocData = resp.data;
                        DocumentService.editable($stateParams.docId, false);
                        FolderService.update($stateParams.folderId, $scope.doc.documentName);
                        FolderService.addDocument($stateParams.folderId, $scope.savedDocData.documentId);
                        if($scope.files.length > 0){
                          for (var i = 0; i < $scope.files.length; i++) {
                            FileService.copy($stateParams.docId, $scope.savedDocData.documentId);
                          };
                        }
                        ApproverListFactory.copy($stateParams.docId, $scope.savedDocData.documentId).then(function(resp){
                          if(resp.status == 200) {
                            console.log('copied approver list')
                            $scope.approverList = resp.data;
                            console.log('ApproverList')
                            console.log($scope.approverList)
                            console.log($scope.approverList.approverIdList[$scope.approverList.currentApproverIdIndex])
                            var toThisApprover = $scope.approverList.approverIdList[$scope.approverList.currentApproverIdIndex];
                            console.log(toThisApprover)
                            DocumentFactory.changeApprover($scope.savedDocData.documentId, toThisApprover)
                                .then(function(resp){
                                  if(resp.status == 200){
                                    console.log(resp.data)
                                    DocumentService.submit($scope.savedDocData.documentId, versionType);
                                    $window.location.href=('#/app/doc');
                                  }
                                  else {
                                    console.log('cannot change approver')
                                    $window.location.href=('#/app/doc');
                                  }
                                })

                          }
                        })
                        
                        
                      })
                    }
                    else{
                      DocumentService.save($scope.savedDocData.documentId,$scope.doc.documentName,$scope.doc.description);
                      DocumentService.editable($scope.savedDocData.documentId, false);
                      FolderService.update($stateParams.folderId, $scope.doc.documentName);
                      
                      DocumentFactory.changeApprover($scope.savedDocData.documentId, $scope.approverList[resp.data.currentApproverIdIndex])
                        .then(function(resp){
                                  if(resp.status == 200){
                                    console.log(resp.data)
                                    DocumentService.submit($scope.savedDocData.documentId, versionType);
                                    $window.location.href=('#/app/doc');
                                  }
                                  else {
                                    console.log('cannot change approver')
                                    $window.location.href=('#/app/doc');
                                  }
                                })
                      
                     
                    }

                  } // if not 'Draft'
                }    
              }
              

            }
            else { console.log(resp) }
      })
          

      FileFactory.allFileDetail($stateParams.docId).then(function(resp){
        if(resp.status == 200){ 
          $scope.files = resp.data; 
          $scope.numberOfFiles = $scope.files.length;
          console.log($scope.files) 
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

      

        $scope.upload = function(files){
          if ($scope.doc.documentStatus == 'Draft'){
            // if it have never been saved
            if(!$scope.savedDocData){
              // if there is no document name
              if(!$scope.doc.documentName){ $scope.doc.documentName = "Untitled"; }
              // if there is no description
              if(!$scope.doc.description){ $scope.doc.description = "no description";}

              DocumentFactory.save($stateParams.docId, $scope.doc.documentName, $scope.doc.description)
              .then(function(resp){
                if(resp.status == 200){
                  $scope.lastModifiedDate = resp.data.lastModifiedDate;
                    $scope.showNotification = function(){
                      return true;
                  }

                  $scope.savedDocData = resp.data;
                  FolderService.update($stateParams.folderId, $scope.doc.documentName);
                  DocumentService.editable(resp.data.documentId, true);
                  ApproverListFactory.copy($stateParams.docId, $scope.savedDocData.documentId).then(function(resp){
                    if (resp.status == 200){
                      console.log('copied approver list')
                    }
                    else {
                      console.log('cannot copy approver list')
                    }
                  })
                  //Upload files
                  if(files && files.length){
                      for (var i = 0; i < files.length; i++) {
                      Upload.upload({
                      url: BackendPath.fileServicePath+'/upload',
                      method: 'POST',
                      data: {file: files[i], documentId: resp.data.documentId}
                        }).then(function (resp) {
                          $scope.numberOfFiles++;
                          $scope.showNone = function(){
                            return false;
                          }
                          $scope.haveFiles = function(){
                            return true;
                          }
                          console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
                        }, function (resp) {
                            console.log('Error status: ' + resp.status);
                            console.log(resp.config.data)
                        }, function (evt) {
                            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                        });

                    } // for
                  } // if files

                } // if resp == 200

                else{
                  console.log(resp)
                }

              }) // DocumentFactory.save


            } // if !$scope.savedDocData
            else{
              // if there is no document name
              if(!$scope.doc.documentName){ $scope.doc.documentName = "Untitled"; }
              // if there is no description
              if(!$scope.doc.description){ $scope.doc.description = "no description";}
              DocumentFactory.save($scope.savedDocData.documentId, $scope.doc.documentName, $scope.doc.description)
              .then(function(resp){
                if(resp.status == 200){
                  $scope.lastModifiedDate = resp.data.lastModifiedDate;
                    $scope.showNotification = function(){
                      return true;
                  }
                  $scope.savedDocData = resp.data;
                  FolderService.update($stateParams.folderId, $scope.doc.documentName);
                  DocumentService.editable(resp.data.documentId, true);
                  //Upload files
                  if(files && files.length){
                      for (var i = 0; i < files.length; i++) {
                      Upload.upload({
                      url: BackendPath.fileServicePath+'/upload',
                      method: 'POST',
                      data: {file: files[i], documentId: resp.data.documentId}
                        }).then(function (resp) {
                          $scope.numberOfFiles++;
                          $scope.showNone = function(){
                            return false;
                          }
                          $scope.haveFiles = function(){
                            return true;
                          }
                          console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
                        }, function (resp) {
                            console.log('Error status: ' + resp.status);
                            console.log(resp.config.data)
                        }, function (evt) {
                            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                        });

                    } // for
                  } // if files

                } // if resp == 200

              }) // DocumentFactory.save


            } // if not !$scope.savedDocData

          } // if 'Draft'
          else{
            FileFactory.allFileDetail($stateParams.docId).then(function(resp){
              if(resp.status == 200){ 
                $scope.files = resp.data; 
                $scope.numberOfFiles = $scope.files.length;
                console.log($scope.files)    
              }
            }) // FileFactory
            // if it have never been saved
            if(!$scope.savedDocData){
              // if there is no document name
              if(!$scope.doc.documentName){ $scope.doc.documentName = "Untitled"; }
              // if there is no description
              if(!$scope.doc.description){ $scope.doc.description = "no description";}

              DocumentFactory.newEditDraft($stateParams.docId, $scope.doc.documentName, $scope.doc.description)
              .then(function(resp){
                if(resp.status == 200){
                  $scope.lastModifiedDate = resp.data.lastModifiedDate;
                    $scope.showNotification = function(){
                      return true;
                  }
                  $scope.savedDocData = resp.data;
                  DocumentService.editable($stateParams.docId, false);
                  FolderService.update($stateParams.folderId, $scope.doc.documentName);
                  FolderService.addDocument($stateParams.folderId, resp.data.documentId);
                  DocumentService.editable(resp.data.documentId, true);
                  ApproverListFactory.copy($stateParams.docId, $scope.savedDocData.documentId).then(function(resp){
                    if (resp.status == 200){
                      console.log('copied approver list')
                    }
                    else {
                      console.log('cannot copy approver list')
                    }
                  })

                  //copy files
                  if($scope.files.length > 0){
                    for (var i = 0; i < $scope.files.length; i++) {
                      FileService.copy($stateParams.docId, $scope.savedDocData.documentId);
                    };
                  }


                  //Upload files
                  if(files && files.length){
                      for (var i = 0; i < files.length; i++) {
                      Upload.upload({
                      url: BackendPath.fileServicePath+'/upload',
                      method: 'POST',
                      data: {file: files[i], documentId: resp.data.documentId}
                        }).then(function (resp) {
                          $scope.numberOfFiles++;
                          $scope.showNone = function(){
                            return false;
                          }
                          $scope.haveFiles = function(){
                            return true;
                          }
                          console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
                        }, function (resp) {
                            console.log('Error status: ' + resp.status);
                            console.log(resp.config.data)
                        }, function (evt) {
                            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                        });

                    }
                  }
                }
                else{
                  console.log('cannot reach '+BackendPath.documentServicePath)

                }
              })


            } // if !$scope.savedDocData
            else{

              DocumentFactory.save($scope.savedDocData.documentId, $scope.doc.documentName, $scope.doc.description)
              .then(function(resp){
                if(resp.status == 200){
                  $scope.lastModifiedDate = resp.data.lastModifiedDate;
                    $scope.showNotification = function(){
                      return true;
                  }
                  $scope.savedDocData = resp.data;
                  FolderService.update($stateParams.folderId, resp.data.documentName);
                  //Upload files
                  if(files && files.length){
                    for (var i = 0; i < files.length; i++) {
                     Upload.upload({
                              url: BackendPath.fileServicePath+'/upload',
                              method: 'POST',
                              data: {file: files[i], documentId: $scope.savedDocData.documentId}
                          }).then(function (resp) {
                              
                              $scope.numberOfFiles++;
                              $scope.showNone = function(){
                                return false;
                              }
                              $scope.haveFiles = function(){
                                    return true;
                              }
                              console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
                          }, function (resp) {
                              console.log('Error status: ' + resp.status);
                              console.log(resp.config.data)
                          }, function (evt) {
                              var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                              console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                          });
                    }
                  }
                }
              })
              
            } // if not !$scope.savedDocData
            
          } // if not 'Draft'
        } // $scope.upload

        $scope.save = function(){
          if ($scope.doc.documentStatus == 'Draft'){
            if(!$scope.savedDocData){
              DocumentFactory.save($stateParams.docId, $scope.doc.documentName, $scope.doc.description).then(function(resp){
                if(resp.status == 200){
                  $scope.lastModifiedDate = resp.data.lastModifiedDate;
                    $scope.showNotification = function(){
                      return true;
                  }
                  $scope.savedDocData = resp.data;
                  FolderService.update($stateParams.folderId, $scope.doc.documentName);
                  DocumentService.editable(resp.data.documentId, true);
                }
              })
            }
            else{
              DocumentFactory.save($scope.savedDocData.documentId, $scope.doc.documentName, $scope.doc.description).then(function(resp){
                if(resp.status == 200){
                  $scope.lastModifiedDate = resp.data.lastModifiedDate;
                    $scope.showNotification = function(){
                      return true;
                  }
                  $scope.savedDocData = resp.data;
                  FolderService.update($stateParams.folderId, $scope.doc.documentName);
                  DocumentService.editable(resp.data.documentId, true);
                }
              })
            }
          
          } // if 'Draft'
          else{
            if(!$scope.savedDocData){
              DocumentFactory.newEditDraft($stateParams.docId, $scope.doc.documentName, $scope.doc.description).then(function(resp){
                if(resp.status == 200){
                  $scope.lastModifiedDate = resp.data.lastModifiedDate;
                    $scope.showNotification = function(){
                      return true;
                  }
                  console.log(resp.data)
                  $scope.savedDocData = resp.data;
                  DocumentService.editable($stateParams.docId, false);
                  FolderService.update($stateParams.folderId, $scope.doc.documentName);
                  FolderService.addDocument($stateParams.folderId, resp.data.documentId);
                  DocumentService.editable(resp.data.documentId, true);
                  ApproverListFactory.copy($stateParams.docId, $scope.savedDocData.documentId).then(function(resp){
                    if (resp.status == 200){
                      console.log('copied approver list')
                    }
                    else {
                      console.log('cannot copy approver list')
                    }
                  })

                  // get files
                  FileFactory.allFileDetail($stateParams.docId).then(function(resp){
                    if(resp.status == 200){ 
                      $scope.files = resp.data; 
                      $scope.numberOfFiles = $scope.files.length;
                      }
                  })

                  // Copy files
                  if($scope.files.length > 0){
                    for (var i = 0; i < $scope.files.length; i++) {
                      FileService.copy($stateParams.docId, $scope.savedDocData.documentId);
                    };
                  } // Copy files

                } // resp 200
              })
               
            } // if !$scope.savedDocData
            else{
              DocumentFactory.save($scope.savedDocData.documentId, $scope.doc.documentName, $scope.doc.description).then(function(resp){
                if(resp.status == 200){
                  $scope.lastModifiedDate = resp.data.lastModifiedDate;
                    $scope.showNotification = function(){
                      return true;
                  }
                  $scope.savedDocData = resp.data;
                  FolderService.update($stateParams.folderId, $scope.doc.documentName);
                  ApproverListFactory.copy($stateParams.docId, $scope.savedDocData.documentId).then(function(resp){
                    if (resp.status == 200){
                      console.log('copied approver list')
                    }
                    else {
                      console.log('cannot copy approver list')
                    }
                  })
                  DocumentService.editable($scope.savedDocData.documentId, true);
                }
              })
            }

          } // if not 'Draft'
          
        }

        $scope.selectVersion = function(){
          $scope.showVersionSelector = function(){
            return true;
          }
        }
     

        $scope.showUploadedFiles = function(){
          if(!$scope.savedDocData){
            FileFactory.allFileDetail($stateParams.docId).then(function(resp){
              if(resp.status == 200){
                $scope.files = resp.data;
                console.log($scope.files)
                $scope.numberOfFiles = $scope.files.length;
              }
            })

          }
          else{
            FileFactory.allFileDetail($scope.savedDocData.documentId).then(function(resp){
              if(resp.status == 200){
                $scope.files = resp.data;
                console.log($scope.files)
                $scope.numberOfFiles = $scope.files.length;
              }
            })

          }
            

          
          
          $scope.showUploadedFileList = function(){
            return true;
          }
        }
       

        $scope.delete = function(){
          FolderService.delete($stateParams.folderId);
          $window.location.href=('#/app/doc');
        }

        
    })
    .error(function(data){
      console.log('cannot reach '+BackendPath.documentServicePath)
    });

  

})