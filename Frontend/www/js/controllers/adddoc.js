angular.module('starter.controllers')
.controller('AddNewDocumentCtrl', function($window, $http, $scope, $stateParams,$ionicHistory,Upload, FileService, DocumentService, FolderService, BackendPath) {
  $ionicHistory.nextViewOptions({
    disableBack: true
  });

  $scope.doc = {};
  var blank = {};
  $scope.savedDocData = null;
  $scope.savedFolder = null;
  $scope.showFileName = function(){
    return true;
  }


  $scope.upload = function (file) {
    // if it never been uploaded
    if(!$scope.savedDocData){
    // if there is no document name
    if(!$scope.doc.name){ $scope.doc.name = "Untitled"; }
    // if there is no description
    if(!$scope.doc.desc){ $scope.doc.desc = "no description";}
    console.log($scope.doc);

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
        data: {documentName:$scope.doc.name, description:$scope.doc.desc, creatorId:1}
      
        }).
        success(function(data, status, headers, config) {
            console.log('sent POST request: successfully create new draft');
            console.log(data);
            $scope.savedDocData = data;
            $scope.lastModifiedDate = data.lastModifiedDate;
            $scope.showNotification = function(){
              return true;
            }

            //new Folder
            $http({
            method: 'POST',
            url: BackendPath.folderServicePath+'/createFolder',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: {folderName: $scope.doc.name, creatorId: 1}
          
            }).
            success(function(data, status, headers, config) {
                console.log('sent POST request: add new folder');
                console.log(data);
                $scope.savedFolder = data;
                FolderService.addDocument(data.id, $scope.savedDocData.documentId);
                Upload.upload({
                    url: BackendPath.fileServicePath+'/upload',
                    method: 'POST',
                    data: {file: file, documentId: $scope.savedDocData.documentId}
                }).then(function (resp) {
                    $scope.filename = resp.config.data.file.name;
                    $scope.showFileName = function(){
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

              
              }).
              error(function(data, status, headers, config) {
                console.log('cannot reach '+BackendPath.folderServicePath)
              });

            
          }).
          error(function(data, status, headers, config) {
            console.log('cannot reach '+BackendPath.documentServicePath)
          });

    }

    else{
       Upload.upload({
                url: BackendPath.fileServicePath+'/upload',
                method: 'POST',
                data: {file: file, documentId: $scope.savedDocData.documentId}
            }).then(function (resp) {
              
                $scope.filename = resp.config.data.file.name;
                $scope.showFileName = function(){
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
        data: {documentName:$scope.doc.name, description:$scope.doc.desc, creatorId:1}
      
    }).
    success(function(data, status, headers, config) {
        console.log('sent POST request: successfully create new draft');
        console.log(data);
        $scope.savedDocData = data;
        $scope.lastModifiedDate = data.lastModifiedDate;
        $scope.showNotification = function(){
          return true;
        }

        //new Folder
        $http({
        method: 'POST',
        url: BackendPath.folderServicePath+'/createFolder',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function(obj) {
            var str = [];
            for(var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
        },
        data: {folderName: $scope.doc.name, creatorId: 1}
      
        }).
        success(function(data, status, headers, config) {
            console.log('sent POST request: add new folder');
            console.log(data);
            $scope.savedFolder = data;
            FolderService.addDocument(data.id, $scope.savedDocData.documentId);
           

          
          }).
          error(function(data, status, headers, config) {
            console.log('cannot reach '+BackendPath.folderServicePath)
          });

        
      }).
      error(function(data, status, headers, config) {
        console.log('cannot reach '+BackendPath.documentServicePath)
      });
    }

    else {
      console.log("updating current draft")
      // DocumentService.save($scope.savedDocData.documentId,$scope.doc.name,$scope.doc.desc);
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
        data: {documentId: $scope.savedDocData.documentId, documentName: $scope.doc.name, description: $scope.doc.desc}
      
        }).
        success(function(data, status, headers, config) {
            console.log('sent POST request: successfully updated current document : '+data.documentStatus);
            console.log(data);
            $scope.lastModifiedDate = data.lastModifiedDate;
            $scope.showNotification = function(){
              return true;
            }
            $scope.savedDocData = data;

            
          }).
          error(function(data, status, headers, config) {
            console.log('cannot reach '+BackendPath.documentServicePath)
          });
      

    }
    
    
  }

  $scope.selectVersion = function(){
    $scope.showVersionSelector = function(){
      return true;
    }

    $scope.submit = function(versionType){
      console.log(versionType);
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
        data: {documentName:$scope.doc.name, description:$scope.doc.desc, creatorId:1}
      
        })
        .success(function(data){
          console.log('successfully create new document: waiting for approval');
          $scope.savedDocData = data;
         
          //new Folder
          $http({
          method: 'POST',
          url: BackendPath.folderServicePath+'/createFolder',
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          transformRequest: function(obj) {
              var str = [];
              for(var p in obj)
              str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
              return str.join("&");
          },
          data: {folderName: $scope.doc.name, creatorId: 1}
        
          }).
          success(function(data, status, headers, config) {
              console.log('sent POST request: add new folder');
              console.log(data);
              $scope.savedFolder = data;

              console.log('adding new doc '+$scope.savedDocData.documentId)
              FolderService.addDocument(data.id, $scope.savedDocData.documentId);
              console.log("submitting current document : "+versionType)
              DocumentService.submit($scope.savedDocData.documentId,versionType);
              $window.location.href=('#/app/doc');

            
            }).
            error(function(data, status, headers, config) {
              console.log('cannot reach '+BackendPath.folderServicePath)
            });

        })
        .error(function(data){
          console.log('cannot reach '+BackendPath.documentServicePath)
        });

      }
      else{
        console.log("updating current document : "+versionType)
        DocumentService.save($scope.savedDocData.documentId,$scope.doc.name,$scope.doc.desc);
        DocumentService.submit($scope.savedDocData.documentId,versionType);
        $window.location.href=('#/app/doc');
      }
    }

    $scope.hideVersionSelector = function(){
      $scope.showVersionSelector = function(){
        return false;
      }
    }
  }

  $scope.reset = function(){
    if(!$scope.savedDocData){
       $scope.doc = angular.copy(blank);
    }
    else{
      FolderService.delete($scope.savedFolder.id);
      $scope.showFileName = function(){
                  return true;
      }
      $scope.doc = angular.copy(blank);
      $window.location.reload();
    }
   
  }

})