angular.module('starter.controllers')
.controller('EditDocumentCtrl', function($scope, $stateParams,$ionicHistory,$http,$window, $state, DocumentService, FolderService, FileService, Upload) {
  $ionicHistory.nextViewOptions({
    disableBack: true
  });

  $scope.savedDocData = null;
  var count = 0;

  $http.get('http://localhost:8083/getreviewbydocumentid?documentid='+$stateParams.docId)
    .success(function(data){
      $scope.review = data;
      
      

    })
    .error(function(data){
      console.log('cannot reach review-service port 8083')
    });

    $scope.download = function(){
          FileService.download($stateParams.docId);   
      }


  $http.get('http://localhost:8081/getdocument?documentid='+$stateParams.docId)
    .success(function(data){
      $scope.doc = data;
      // get creator
      $http.get('http://localhost:8082/getuser?userid='+$scope.doc.creator)
        .success(function(data){
          $scope.creator = data;
            
        })
        .error(function(data){
          console.log('cannot reach user-service port 8082')
        });
        // get approver
      $http.get('http://localhost:8082/getuser?userid='+$scope.doc.approver)
        .success(function(data){
          $scope.approver = data;
            
        })
        .error(function(data){
          console.log('cannot reach document-service port 8082')
        });
        // get file detail
        $http.get('http://localhost:8084/filedetail?documentId='+$scope.doc.documentId)
        .success(function(data){
          $scope.filename = data;
            
        })
        .error(function(data){
          console.log('cannot reach file-service port 8084')
          console.log(data)
        });

        $scope.upload = function(file){
          if(!$scope.savedDocData){
            $http({
                method: 'POST',
                url: 'http://localhost:8081/newEditDraft',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: {documentName: $scope.doc.documentName, 
                  description: $scope.doc.description, 
                  documentId: $stateParams.docId,
                }
              
            }).success(function(data, status, headers, config) {
              $scope.savedDocData = data;
              FolderService.update($stateParams.folderId, $scope.doc.documentName);
              FolderService.addDocument($stateParams.folderId, data.documentId);
              //Upload file
              Upload.upload({
              url: 'http://localhost:8084/upload',
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
              console.log('cannot reach document-service port 8081')
            });

          }
          else{
            FileService.delete($scope.savedDocData.documentId);
            $http({
                method: 'POST',
                url: 'http://localhost:8081/save',
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
              url: 'http://localhost:8084/upload',
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
              console.log('cannot reach document-service port 8081')
            });

          }

         


        }

        $scope.save = function(docId){
          if(!$scope.savedDocData){
            $http({
                method: 'POST',
                url: 'http://localhost:8081/newEditDraft',
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
              FolderService.update($stateParams.folderId, $scope.doc.documentName);
              FolderService.addDocument($stateParams.folderId, data.documentId);

            }).
            error(function(data, status, headers, config) {
              console.log('cannot reach document-service port 8081')
            });

          }
          else{

            $http({
                method: 'POST',
                url: 'http://localhost:8081/save',
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
              console.log('cannot reach document-service port 8081')
            });

          }

        }
        $scope.submit = function(docId, docStatus){

          if(!$scope.savedDocData){
            $http({
                method: 'POST',
                url: 'http://localhost:8081/newEditDraft',
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
              FolderService.update($stateParams.folderId, $scope.doc.documentName);
              FolderService.addDocument($stateParams.folderId, data.documentId);
              FileService.copy($stateParams.docId, $scope.savedDocData.documentId)
              DocumentService.submit($scope.savedDocData.documentId);

            }).
            error(function(data, status, headers, config) {
              console.log('cannot reach document-service port 8081')
            });

          }
          else{
            DocumentService.submit($scope.savedDocData.documentId);
          }
         
          
        }

        $scope.delete = function(docId){
        DocumentService.delete(docId)
        }

        
    })
    .error(function(data){
      console.log('cannot reach document-service port 8081')
    });

  

})