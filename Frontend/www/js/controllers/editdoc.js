angular.module('starter.controllers')
.controller('EditDocumentCtrl', function($scope, $stateParams,$ionicHistory,$http,$window, $state, DocumentService, FolderService, FileService, Upload, BackendPath) {
  $ionicHistory.nextViewOptions({
    disableBack: true
  });

  $scope.savedDocData = null;
  var count = 0;

  $http.get(BackendPath.reviewServicePath+'/getReviewByDocumentId?documentId='+$stateParams.docId)
    .success(function(data){
      $scope.review = data;
      
      

    })
    .error(function(data){
      console.log('cannot reach '+BackendPath.reviewServicePath)
    });

    $scope.download = function(){
          FileService.download($stateParams.docId);   
      }


  $http.get(BackendPath.documentServicePath+'/getDocument?documentId='+$stateParams.docId)
    .success(function(data){
      $scope.doc = data;
      // get creator
      $http.get(BackendPath.userServicePath+'/user?userId='+$scope.doc.creator)
        .success(function(data){
          $scope.creator = data;
            
        })
        .error(function(data){
          console.log('cannot reach '+BackendPath.userServicePath)
        });
        // get approver
      $http.get(BackendPath.userServicePath+'/user?userId='+$scope.doc.approver)
        .success(function(data){
          $scope.approver = data;
            
        })
        .error(function(data){
          console.log('cannot reach '+BackendPath.userServicePath)
        });
        // get file detail
        $http.get(BackendPath.fileServicePath+'/fileDetail?documentId='+$scope.doc.documentId)
        .success(function(data){
          $scope.filename = data;
            
        })
        .error(function(data){
          console.log('cannot reach '+BackendPath.fileServicePath)
          console.log(data)
        });

        $scope.upload = function(file){
          if(!$scope.savedDocData){
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
                data: {documentName: $scope.doc.documentName, 
                  description: $scope.doc.description, 
                  documentId: $stateParams.docId
                }
              
            }).success(function(data, status, headers, config) {
              $scope.savedDocData = data;
              DocumentService.editable($stateParams.docId, false);
              FolderService.update($stateParams.folderId, $scope.doc.documentName);
              FolderService.addDocument($stateParams.folderId, data.documentId);
              DocumentService.editable(data.documentId, true);
              //Upload file
              Upload.upload({
              url: BackendPath.fileServicePath+'/upload',
              method: 'POST',
              data: {file: file, documentId: data.documentId}
                }).then(function (resp) {
                  count++;
                    $scope.filename = resp.config.data.file.name;
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
              console.log('cannot reach '+BackendPath.documentServicePath)
            });

          }
          else{
            FileService.delete($scope.savedDocData.documentId);
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
                data: {documentName:$scope.doc.documentName, 
                  description: $scope.doc.description, 
                  documentId: $scope.savedDocData.documentId,
                }
              
            }).success(function(data, status, headers, config) {
              $scope.savedDocData = data;
              FolderService.update($stateParams.folderId, $scope.doc.documentName);
              //Upload file
              Upload.upload({
              url: BackendPath.fileServicePath+'/upload',
              method: 'POST',
              data: {file: file, documentId: data.documentId}
                }).then(function (resp) {
                  count++;
                    $scope.filename = resp.config.data.file.name;
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
              console.log('cannot reach '+BackendPath.documentServicePath)
            });

          }

         


        }

        $scope.save = function(docId){
          if(!$scope.savedDocData){
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
              $scope.savedDocData = data;
              DocumentService.editable($stateParams.docId, false);
              FolderService.update($stateParams.folderId, $scope.doc.documentName);
              FolderService.addDocument($stateParams.folderId, data.documentId);
              DocumentService.editable($data.documentId, true);

            }).
            error(function(data, status, headers, config) {
              console.log('cannot reach '+BackendPath.documentServicePath)
            });

          }
          else{

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
                data: {documentName:$scope.doc.documentName, 
                  description: $scope.doc.description, 
                  documentId: $scope.savedDocData.documentId
                }
              
            }).success(function(data, status, headers, config) {
              $scope.savedDocData = data;
              FolderService.update($stateParams.folderId, $scope.doc.documentName);
            }).
            error(function(data, status, headers, config) {
              console.log('cannot reach '+BackendPath.documentServicePath)
            });

          }

        }
        $scope.submit = function(docId, docStatus){

          if(!$scope.savedDocData){
            if(docStatus == 'Draft'){
              DocumentService.submit($stateParams.docId);
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
                $scope.savedDocData = data;
                DocumentService.editable($stateParams.docId, false);
                FolderService.update($stateParams.folderId, $scope.doc.documentName);
                FolderService.addDocument($stateParams.folderId, data.documentId);
                FileService.copy($stateParams.docId, $scope.savedDocData.documentId)
                DocumentService.submit($scope.savedDocData.documentId);

              }).
              error(function(data, status, headers, config) {
                console.log('cannot reach '+BackendPath.documentServicePath)
              });

            }
           
            

          }
          else{
            DocumentService.submit($scope.savedDocData.documentId);
          }
         
          
        }

        $scope.delete = function(docId){
        FolderService.delete($stateParams.folderId);
        $window.location.href=('#/app/doc');
        }

        
    })
    .error(function(data){
      console.log('cannot reach '+BackendPath.documentServicePath)
    });

  

})