angular.module('starter.controllers', ['ngFileUpload'])

.factory('UserService', function($http, BackendPath) {

   var userService = {};

   userService.getUser = function(userId){
    return $http.get(BackendPath.userServicePath+'/user?userId='+userId)
    .success(function(data){
      return data;
    })
    .error(function(data){
      console.log('cannot reach '+BackendPath.userServicePath)
      return data;
    });
     
   }

   return userService;
})

.service('BackendPath', function(){
  this.documentServicePath = "http://localhost:8081";
  this.userServicePath = "http://localhost:8082";
  this.reviewServicePath = "http://localhost:8083";
  this.fileServicePath = "http://localhost:8084";
  this.folderServicePath = "http://localhost:8085";
  this.publishDocumentServicePath = "http://localhost:8086";
  


})

.service('DocumentService', function($http,$window,FolderService, FileService,BackendPath) {



  this.newdraft = function(){

  }

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


.service('ReviewService', function($http,$window,FolderService,BackendPath) {

  this.getReview = function(){

  }

  this.approve = function(docId,approverId,reviewText,folderId){
    $http.get(BackendPath.reviewServicePath+'/createReview?documentId='+docId+'&approverId='+approverId+'&reviewDesc='+reviewText)
        .success(function(data){
        console.log('created review from '+approverId+' review text: '+reviewText);
        $http.get(BackendPath.documentServicePath+'/approve?documentId='+docId)
          .success(function(data){
            console.log('successfully approve document: change from waiting for approval to aprove');
            

            $window.location.href=('#/app/doclistforboss');

          })
          .error(function(data){
            console.log('cannot reach '+BackendPath.documentServicePath)
          });
                
        })
        .error(function(data){
          console.log('cannot reach '+BackendPath.reviewServicePath)
        });
  }

  this.reject = function(docId,approverId,reviewText){

    $http.get(BackendPath.reviewServicePath+'/createReview?documentId='+docId+'&approverId='+approverId+'&reviewDesc='+reviewText)
          .success(function(data){
            console.log('created review from '+approverId+' review text: '+reviewText);
            $http.get(BackendPath.documentServicePath+'/reject?documentId='+docId)
              .success(function(data){
                console.log('successfully reject document: change from approve to reject');
                $window.location.href=('#/app/doclistforboss');
              })
              .error(function(data){
                console.log('cannot reach '+BackendPath.documentServicePath)
              });
          })
          .error(function(data){
            console.log('cannot reach '+BackendPath.reviewServicePath)
          });

  }

})

.service('FileService', function(Upload, $http, $window,BackendPath) {


  this.upload = function (file, docId) {
     
        console.log("File service from controller: uploading file ("+file.size+") to document id: "+docId);
      
        Upload.upload({
            url: BackendPath.fileServicePath+'/upload',
            method: 'POST',
            data: {file: file, documentId: docId}
        }).then(function (resp) {
            
            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
        }, function (resp) {
            console.log('Error status: ' + resp.status);
            console.log(resp.config.data)
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
        

    };

    this.getFileDetail = function(docId){
      
      $http.get(BackendPath.fileServicePath+'/fileDetail?documentId='+docId)
        .success(function(data){
          
        })
        .error(function(data){
          console.log('cannot reach '+BackendPath.fileServicePath)
          console.log(data)
        });
 

    }

    this.download = function(docId){
      var url = BackendPath.fileServicePath+'/download?documentId='+docId;
      console.log(url)
      $window.open(url);
    }

    this.delete = function(docId){
       $http.get(BackendPath.fileServicePath+'/deleteByDocumentId?documentId='+docId)
        .success(function(data){
          
        })
        .error(function(data){
          console.log('cannot reach '+BackendPath.fileServicePath)
          console.log(data)
        });
    }

    this.copy = function(copyFrom, copyTo){
      $http.get(BackendPath.fileServicePath+'/copy?copyFrom='+copyFrom+'&copyTo='+copyTo)
        .success(function(data){
          console.log(data);

        })
        .error(function(data){
          console.log('cannot reach '+BackendPath.fileServicePath)
        });
    }

})

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
            $http.get(BackendPath.fileServicePath+'/deleteByDocumentId?documentId='+docId)
                .success(function(data){
                  console.log('successfully delete file');
                  

                })
                .error(function(data){
                  console.log('cannot reach '+BackendPath.fileServicePath)
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

.service('PublishDocumentService', function($http,BackendPath) {

  this.addDocument = function(docId, docName){
    $http.get(BackendPath.publishDocumentServicePath+'/addPublishDocument?documentId='+docId+'&documentName='+docName)
        .success(function(data){
          console.log('successfully add new publish document')
        })
        .error(function(data){
          console.log('cannot reach '+BackendPath.publishDocumentServicePath)
          console.log(data)
        });
  }
})


.directive('showWhen', ['$window', function($window) {


 return {
    restrict: 'A',
    link: function($scope, $element, $attr) {

  function checkExpose() {
    var lg = $attr.showWhen == 'large' ? '(min-width:1024px)' : $attr.showWhen;
    var sm = $attr.showWhen == 'small' ? '(max-width:1024px)' : $attr.showWhen;
    if($window.matchMedia(lg).matches){
    $element.removeClass('ng-hide');
  } 
    else if($window.matchMedia(sm).matches){
    $element.removeClass('ng-hide');
  }

  else {
    $element.addClass('ng-hide');   
  }
  }

  function onResize() {
    debouncedCheck();
  }

  var debouncedCheck = ionic.debounce(function() {
    $scope.$apply(function(){
      checkExpose();
    });
  }, 300, false);

  checkExpose();

  ionic.on('resize', onResize, $window);

  $scope.$on('$destroy', function(){
    ionic.off('resize', onResize, $window);
  });

}
  };
}]);;
