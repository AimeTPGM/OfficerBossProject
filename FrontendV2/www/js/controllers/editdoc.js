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
                 
                  DocumentService.editable($scope.savedDocData.documentId, true);
                }
              })
            }

          } // if not 'Draft'
          
        }

        $scope.submit = function(){
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
                  $window.location.href=('#/app/doc/'+$stateParams.folderId+'/'+resp.data.documentId+'/approver');
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
                  $window.location.href=('#/app/doc/'+$stateParams.folderId+'/'+resp.data.documentId+'/approver');
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

                  $window.location.href=('#/app/doc/'+$stateParams.folderId+'/'+resp.data.documentId+'/approver');

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
                 
                  DocumentService.editable($scope.savedDocData.documentId, true);
                  $window.location.href=('#/app/doc/'+$stateParams.folderId+'/'+resp.data.documentId+'/approver');
                }
              })
            }

          } // if not 'Draft'
          
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