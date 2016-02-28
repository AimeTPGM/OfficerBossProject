angular.module('starter.controllers')
.controller('DocumentDetailCtrl', function($scope, $stateParams,$ionicHistory, $http,$window, FileService, DocumentService,FolderService,PublishDocumentService, BackendPath, UserFactory) {
  $ionicHistory.nextViewOptions({
    disableBack: true
  });

   $scope.publish = function(docId,docName){
      DocumentService.publish(docId);
      PublishDocumentService.addDocument(docId, docName);
      $window.location.href=('#/app/doc');
    }

    $scope.delete = function(docId){
      FolderService.delete($stateParams.folderId);
      $window.location.href=('#/app/doc');
    }
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
            DocumentService.submit(data.documentId,versionType);
            $window.location.href=('#/app/doc');

          }).
          error(function(data, status, headers, config) {
            console.log('cannot reach '+BackendPath.documentServicePath)
          });
        }
      }
      
      
    }

  $http.get(BackendPath.folderServicePath+'/folder?folderId='+$stateParams.folderId)
    .success(function(data){
      $scope.folder = data;
      
      $scope.versions = {};
      var j = 0;
      for (var i = 0; i < $scope.folder.documentList.length; i++) {
        var tempDocId = $scope.folder.documentList[i];
        $http.get(BackendPath.documentServicePath+'/getDocument?documentId='+tempDocId)
          .success(function(data){
            var temp = {};
            temp.version = data.version;
            temp.docId = tempDocId;
            $scope.versions[j] = temp;
            $scope.versions[j].docId = data.documentId;
            j++;
            
          })
          .error(function(data){
            console.log('cannot reach '+BackendPath.documentServicePath)

          });

      };

    })
    .error(function(data){
      console.log('cannot reach '+BackendPath.folderServicePath)
    });

    $scope.download = function(){
          FileService.download($stateParams.docId);
    }


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
      console.log(data)

      $scope.creator = {};
      UserFactory.getUser($scope.doc.creator).then(function(resp){
        $scope.creator = resp.data;
      });
      
      $scope.approver = {};
      UserFactory.getUser($scope.doc.approver).then(function(resp){
        $scope.approver = resp.data;
      });

      $http.get(BackendPath.fileServicePath+'/fileDetail?documentId='+$scope.doc.documentId)
        .success(function(data){
          $scope.filename = data;
            
        })
        .error(function(data){
          console.log('cannot reach '+BackendPath.fileServicePath)
          console.log(data)
        });

    })
    .error(function(data){
      console.log('cannot reach '+BackendPath.documentServicePath)
    });
  

   
    

})
