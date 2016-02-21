angular.module('starter.controllers')
.controller('DocumentDetailCtrl', function($scope, $stateParams,$ionicHistory, $http,$window, FileService, DocumentService,FolderService) {
  $ionicHistory.nextViewOptions({
    disableBack: true
  });

   $scope.publish = function(docId){
      DocumentService.publish(docId);
    }

    $scope.delete = function(docId){
      FolderService.delete($stateParams.folderId);
      $window.location.href=('#/app/doc');
    }

    $scope.submit = function(docId, docStatus){
      if(docStatus == 'Draft'){
        DocumentService.submit(docId);
      }
      else if(docStatus == 'Reject'){
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
        DocumentService.editable($stateParams.docId, false);
        FolderService.addDocument($stateParams.folderId, data.documentId);
        DocumentService.submit(data.documentId);

      }).
      error(function(data, status, headers, config) {
        console.log('cannot reach document-service port 8081')
      });

      }
    }



  $http.get('http://localhost:8085/folder?folderId='+$stateParams.folderId)
    .success(function(data){
      $scope.folder = data;
      // var lastDocId = $scope.folder.documentList[($scope.folder.documentList.length)-1];
      
      
      $scope.versions = {};
      var j = 0;
      for (var i = 0; i < $scope.folder.documentList.length; i++) {
        var tempDocId = $scope.folder.documentList[i];
        $http.get('http://localhost:8081/getDocument?documentId='+tempDocId)
          .success(function(data){
            var temp = {};
            temp.version = data.version;
            temp.docId = tempDocId;
            $scope.versions[j] = temp;
            $scope.versions[j].docId = data.documentId;
            j++;
            
            
            
          })
          .error(function(data){
            console.log('cannot reach document-service port 8081')

          });

      };




      



    })
    .error(function(data){
      console.log('cannot reach folder-service port 8085')
    });

    $scope.download = function(){
          FileService.download($stateParams.docId);
    }


  $http.get('http://localhost:8083/getreviewbydocumentid?documentId='+$stateParams.docId)
    .success(function(data){
      $scope.review = data;

    })
    .error(function(data){
      console.log('cannot reach review-service port 8083')
    });

    $scope.download = function(){
          FileService.download($stateParams.docId);
    }

  $http.get('http://localhost:8081/getDocument?documentId='+$stateParams.docId)
    .success(function(data){
      $scope.doc = data;
      console.log(data)
      
      $http.get('http://localhost:8082/getuser?userid='+$scope.doc.creator)
        .success(function(data){
          $scope.creator = data;
            
        })
        .error(function(data){
          console.log('cannot reach user-service port 8082')
        });
      $http.get('http://localhost:8082/getuser?userid='+$scope.doc.approver)
        .success(function(data){
          $scope.approver = data;
            
        })
        .error(function(data){
          console.log('cannot reach user-service port 8082')
        });

      $http.get('http://localhost:8084/fileDetail?documentId='+$scope.doc.documentId)
        .success(function(data){
          $scope.filename = data;
            
        })
        .error(function(data){
          console.log('cannot reach file-service port 8084')
          console.log(data)
        });


      

    })
    .error(function(data){
      console.log('cannot reach document-service port 8081')
    });
  

   
    

})
