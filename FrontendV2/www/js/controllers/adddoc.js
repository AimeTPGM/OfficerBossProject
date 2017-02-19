angular.module('starter.controllers')
.controller('AddNewDocumentCtrl', function(
  $window, $http, $scope, $stateParams,$ionicHistory,
  Upload, 
  DocumentService, FolderService, BackendPath, LoginService,
  FileFactory, UserFactory, ApproverListFactory, DocumentFactory) {
  $ionicHistory.nextViewOptions({
    disableBack: true
  });
  console.log(LoginService.credential)
  console.log(LoginService.user)
  var userId = LoginService.user.userId;
  $scope.doc = {};
  var blank = {};
  $scope.uploadFileDetail = {};
  $scope.numberOfFiles = 0;
  $scope.savedDocData = null;
  $scope.savedFolder = null;
  $scope.showNone = function(){
    return true;
  }

  $scope.deleteFileById = function(fileId){
    FileFactory.deleteByFileId(fileId).then(function(resp){
      if(resp.status == 200){
        for (var i = 0; i < $scope.numberOfFiles; i++) {
          if($scope.uploadFileDetail[i].id == fileId) {
            $scope.uploadFileDetail.splice(i,1);
            console.log($scope.uploadFileDetail);
            $scope.numberOfFiles = $scope.uploadFileDetail.length;
            if($scope.uploadFileDetail.length == 0){
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


  $scope.showUploadedFiles = function(){
    if(!$scope.savedDocData){

    }
    else{
      FileFactory.allFileDetail($scope.savedDocData.documentId).then(function(resp){
        if(resp.status == 200){
          $scope.uploadFileDetail = resp.data;
          console.log($scope.uploadFileDetail)
          $scope.numberOfFiles = $scope.uploadFileDetail.length;
        }
      })

    }
    
    $scope.showUploadedFileList = function(){
      return true;
    }
  }

  $scope.closeUploadedFiles = function(){
    $scope.showUploadedFileList = function(){
      return false;
    }
  }
  $scope.upload = function (files) {
    // if it never been uploaded
    if(!$scope.savedDocData){
    // if there is no document name
    if(!$scope.doc.name){ $scope.doc.name = "Untitled"; }
    // if there is no description
    if(!$scope.doc.desc){ $scope.doc.desc = "no description";}
    console.log($scope.doc);
      //doing middle layer
      $http({
        method: 'POST',
        url: BackendPath.documentServicePath+'/newDraft',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function(obj) {
            var str = [];
            for(var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
        },
        data: {documentName:$scope.doc.name, description:$scope.doc.desc, creatorId: userId}
      
        }).
        success(function(data, status, headers, config) {
            console.log('sent POST request: successfully create new draft');
            console.log(data);
            var dataLength = data[1].length-1;
            $scope.savedDocData = data[1][dataLength];
            $scope.lastModifiedDate = $scope.savedDocData.lastModifiedDate;
            $scope.savedFolder = data[0];
            $scope.showNotification = function(){
              return true;
            }
            $scope.showUploading = function(){
              return true;
            }
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
                        $scope.showUploading = function(){
                          return false;
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
          }).
          error(function(data, status, headers, config) {
            console.log('cannot reach '+BackendPath.documentServicePath)
            console.error(config)
          });
    }
    else{
        
        if(files && files.length){
          $scope.showUploading = function(){
            return true;
          }
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
                    $scope.showUploading = function(){
                      return false;
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
  };

  $scope.save = function(){
    console.log($scope.doc);
    // if it never been uploaded 
    if(!$scope.savedDocData){
       // if there is no document name
    if(!$scope.doc.name){ $scope.doc.name = "Untitled"; }
    // if there is no description
    if(!$scope.doc.desc){ $scope.doc.desc = "no description";}
    
      console.log("creating new draft")
      $http({
        method: 'POST',
        url: BackendPath.documentServicePath+'/newDraft',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function(obj) {
            var str = [];
            for(var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
        },
        data: {documentName:$scope.doc.name, description:$scope.doc.desc, creatorId: userId}
      
    }).
    success(function(data, status, headers, config) {
        console.log('sent POST request: successfully create new draft');
        console.log(data);
        var dataLength = data[1].length-1;
        $scope.savedDocData = data[1][dataLength];
        $scope.lastModifiedDate = $scope.savedDocData.lastModifiedDate;
        $scope.savedFolder = data[0];
        $scope.showNotification = function(){
          return true;
        }
      }).
      error(function(data, status, headers, config) {
        console.log('cannot reach '+BackendPath.documentServicePath)
      });
    }

    else {
      console.log("updating current draft")
      $http({
        method: 'POST',
        url: BackendPath.documentServicePath+'/save',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function(obj) {
            var str = [];
            for(var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
        },
        data: {
          documentId: $scope.savedDocData.documentId, 
          documentName: $scope.doc.name, 
          description: $scope.doc.desc, 
          folderId:$scope.savedFolder.id
        }
      
        }).
        success(function(data, status, headers, config) {
            console.log('sent POST request: successfully updated current document : '+data.documentStatus);
            console.log(data);
            var dataLength = data[1].length-1;
            $scope.savedDocData = data[1][dataLength];
            $scope.lastModifiedDate = $scope.savedDocData.lastModifiedDate;
            $scope.savedFolder = data[0];
            $scope.showNotification = function(){
              return true;
            }
          }).
          error(function(data, status, headers, config) {
            console.log('cannot reach '+BackendPath.documentServicePath)
          });
    }
  }



      $scope.submit = function(){
 
      if(!$scope.savedDocData){
        // if there is no document name
        if(!$scope.doc.name){ $scope.doc.name = "Untitled"; }
        // if there is no description
        if(!$scope.doc.desc){ $scope.doc.desc = "no description";}

        $http({
        method: 'POST',
        url: BackendPath.documentServicePath+'/newDraft',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function(obj) {
            var str = [];
            for(var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
        },
        data: {documentName:$scope.doc.name, description:$scope.doc.desc, creatorId: userId}
      
        })
        .success(function(data){
          console.log("creating new draft and will redirect to select approver page")
          var dataLength = data[1].length-1;
          $scope.savedDocData = data[1][dataLength];
          $scope.lastModifiedDate = $scope.savedDocData.lastModifiedDate;
          $scope.savedFolder = data[0];
          $window.location.href=('#/app/doc/'+$scope.savedFolder.id+'/'+$scope.savedDocData.documentId+'/approver');

        })
        .error(function(data){
          console.log('cannot reach '+BackendPath.documentServicePath)
        });

      }
      else{
        DocumentService.save($scope.savedDocData.documentId,$scope.doc.name,$scope.doc.desc,$scope.savedFolder.id);
        $window.location.href=('#/app/doc/'+$scope.savedFolder.id+'/'+$scope.savedDocData.documentId+'/approver');
      }
    }

  $scope.reset = function(){
    if(!$scope.savedDocData){
       $scope.doc = angular.copy(blank);
    }
    else{
      FolderService.delete($scope.savedFolder.id);
      $scope.uploadFileDetail = {};
      $scope.numberOfFiles = 0;
      $scope.showNone = function(){
        return true;
      }
      $scope.haveFiles = function(){
        return false;
      }
      $scope.doc = angular.copy(blank);
      $window.location.reload();
    }
   
  }

})