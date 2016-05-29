angular.module('starter.controllers')

.service('DocumentService', function($http,$window,FolderService, FileService,BackendPath) {

  this.newdoc = function(docName,docDesc,creatorId){

    $http.get(BackendPath.documentServicePath+'/newDocument?documentName='+docName+'&description='+docDesc+'&creatorId='+creatorId)
        .success(function(data){
          console.log('successfully create new document: waiting for approval');
          FolderService.addDocument(folderId, data.documentId);
          $window.location.href=('#/app/doc');

        })
        .error(function(data){
          console.log('cannot reach '+BackendPath.documentServicePath)
        });

  }
  this.updateNoNewFile = function(docName,docDesc,creatorId,docId,folderId){
    $http.get(BackendPath.documentServicePath+'/newDocument?documentName='+docName+'&description='+docDesc+'&creatorId='+creatorId)
        .success(function(data){
          console.log('successfully create new document: waiting for approval');
          FolderService.addDocument(folderId, data.documentId);
          FileService.copy(docId,data.documentId);
          FolderService.update(folderId, docName);
          $window.location.href=('#/app/doc');

        })
        .error(function(data){
          console.log('cannot reach '+BackendPath.documentServicePath)
        });

  }

  this.save = function(docId,docName,docDesc){
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
        data: {documentId: docId, documentName: docName, description: docDesc}
      
    }).
    success(function(data, status, headers, config) {
        console.log('sent POST request: successfully updated current document : '+data.documentStatus);
        console.log(data);

        
      }).
      error(function(data, status, headers, config) {
        console.log('cannot reach '+BackendPath.documentServicePath)
      });

  }

  this.submit = function(docId,versionType){
    console.log(versionType)
    $http.get(BackendPath.documentServicePath+'/submit?documentId='+docId+'&&versionType='+versionType)
        .success(function(data){
          console.log('successfully submit document: change to waiting for approval');

        })
        .error(function(data){
          console.log('cannot reach '+BackendPath.documentServicePath)
        });

  }

  this.delete = function(docId){
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
    $http.get(BackendPath.fileServicePath+'/deleteByDocumentId?documentId='+docId)
        .success(function(data){
          console.log('successfully delete file');
          

        })
        .error(function(data){
          console.log('cannot reach '+BackendPath.fileServicePath)
        });

    console.log('delete documentId from folder')
    FolderService.deleteDocument(folderId,docId);

  }

  this.publish = function(docId){
    $http.get(BackendPath.documentServicePath+'/publish?documentId='+docId)
        .success(function(data){
          console.log('successfully publish document');

        })
        .error(function(data){
          console.log('cannot reach '+BackendPath.documentServicePath)
        });
  }

  this.editable = function(docId, editable){
    $http.get(BackendPath.documentServicePath+'/getDocument?documentId='+docId)
        .success(function(data){
          console.log('successfully get document');
          if(data.documentStatus == 'Reject' || data.documentStatus == 'Draft'){
            console.log(docId+" "+data.documentStatus)
            var temp = editable;
            $http.get(BackendPath.documentServicePath+'/editable?documentId='+docId+'&&editable='+temp)
              .success(function(data){
                console.log('successfully set document editable to '+temp);

              })
              .error(function(data){
                console.log('cannot reach '+BackendPath.documentServicePath)
              });
          }
          else{
            console.log(docId+" "+data.documentStatus+" then not set editable to true")
          }
        })
        .error(function(data){
          console.log('cannot reach '+BackendPath.documentServicePath)
        });



    
  }

})