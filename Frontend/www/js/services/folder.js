angular.module('starter.controllers')
.service('FolderService', function(Upload, $http, $window,BackendPath) {
  this.newFolder = function(folderName, creatorId){
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
        data: {folderName: folderName, creatorId: creatorId}
      
    }).
    success(function(data, status, headers, config) {
        console.log('sent POST request: add new folder');
        console.log(data);

        
      }).
      error(function(data, status, headers, config) {
        console.log('cannot reach '+BackendPath.folderServicePath)
      });

  }


  this.delete = function(folderId){
    $http.get(BackendPath.folderServicePath+'/folder?folderId='+folderId)
        .success(function(data){
          for (var i = 0; i < data.numberOfDocuments; i++) {
            var docId = data.documentList[i];
            console.log('docId: '+docId)
           console.log('deleting document');
            $http.get(BackendPath.documentServicePath+'/delete?documentId='+docId)
                .success(function(data){
                  console.log('successfully delete document');
                  

                })
                .error(function(data){
                  console.log('cannot reach '+BackendPath.documentServicePath)
                });
            console.log('deleting review');
            $http.get(BackendPath.reviewServicePath+'/deleteByDocumentId?documentId='+docId)
                .success(function(data){
                  console.log('successfully delete review');
                  

                })
                .error(function(data){
                  console.log('cannot reach '+BackendPath.reviewServicePath)
                });

            console.log('deleting file')
            $http.get(BackendPath.fileServicePath+'/deleteAllByDocumentId?documentId='+docId)
              .success(function(data){
                
              })
              .error(function(data){
                console.log('cannot reach '+BackendPath.fileServicePath)
                console.log(data)
              });



          };

          $http.get(BackendPath.folderServicePath+'/deleteById?folderId='+folderId)
            .success(function(data){
              console.log('successfully delete folder: '+folderId)
              $window.location.reload();
            })
            .error(function(data){
              console.log('cannot reach '+BackendPath.folderServicePath)
              console.log(data)
            });

        })
        .error(function(data){
          console.log('cannot reach '+BackendPath.folderServicePath)
          console.log(data)
        });


    



  }

  this.update = function(folderId, folderName){
    $http({
        method: 'POST',
        url: BackendPath.folderServicePath+'/update',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function(obj) {
            var str = [];
            for(var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
        },
        data: {folderId: folderId, folderName: folderName}
      
    }).
    success(function(data, status, headers, config) {
        console.log('sent POST request: update folder');
        console.log(data);
      }).
      error(function(data, status, headers, config) {
        console.log('cannot reach '+BackendPath.folderServicePath)
      });

  }

  this.addDocument = function(folderId, docId){
      $http.get(BackendPath.folderServicePath+'/addDocument?folderId='+folderId+'&documentId='+docId)
        .success(function(data){
          console.log('successfully add new document')
        })
        .error(function(data){
          console.log('cannot reach '+BackendPath.folderServicePath)
          console.log(data)
        });

  }

  this.deleteDocument = function(folderId,docId){
    $http.get(BackendPath.folderServicePath+'/addDocument?folderId='+folderId+'&documentId='+docId)
        .success(function(data){
          console.log('successfully delete document')
        })
        .error(function(data){
          console.log('cannot reach '+BackendPath.folderServicePath)
          console.log(data)
        });
  }

})