angular.module('starter.controllers', ['ngFileUpload'])

.service('BackgroundService', function($http,$window,DocumentService){
  this.deleteAll = function(){

  }


})

.service('DocumentService', function($http,$window,FolderService, FileService) {



  this.newdraft = function(){

  }

  this.newdoc = function(docName,docDesc,creatorId){

    $http.get('http://localhost:8081/newdocument?documentName='+docName+'&description='+docDesc+'&creator='+creatorId)
        .success(function(data){
          console.log('successfully create new document: waiting for approval');
          FolderService.addDocument(folderId, data.documentId);
          $window.location.href=('#/app/folderlist');

        })
        .error(function(data){
          console.log('cannot reach document-service port 8081')
        });

  }
  this.updateNoNewFile = function(docName,docDesc,creatorId,docId,folderId){
    $http.get('http://localhost:8081/newdocument?documentName='+docName+'&description='+docDesc+'&creator='+creatorId)
        .success(function(data){
          console.log('successfully create new document: waiting for approval');
          FolderService.addDocument(folderId, data.documentId);
          FileService.copy(docId,data.documentId);
          $window.location.href=('#/app/folderlist');

        })
        .error(function(data){
          console.log('cannot reach document-service port 8081')
        });

  }
  this.updateWithNewFile = function(){

  }

  this.save = function(docId,docName,docDesc){
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
        data: {documentId: docId, documentName: docName, description: docDesc}
      
    }).
    success(function(data, status, headers, config) {
        console.log('sent POST request: successfully updated current document : '+data.documentStatus);
        console.log(data);

        $window.location.href=('#/app/folderlist');
      }).
      error(function(data, status, headers, config) {
        console.log('cannot reach document-service port 8081')
      });

  }

  this.submit = function(docId){
    $http.get('http://localhost:8081/submit?documentid='+docId)
        .success(function(data){
          console.log('successfully submit document: change to waiting for approval');
          $window.location.href=('#/app/folderlist');

        })
        .error(function(data){
          console.log('cannot reach document-service port 8081')
        });

  }

  this.delete = function(docId){
    console.log('deleting document');
    $http.get('http://localhost:8081/delete?documentid='+docId)
        .success(function(data){
          console.log('successfully delete document');
          

        })
        .error(function(data){
          console.log('cannot reach document-service port 8081')
        });
    console.log('deleting review');
    $http.get('http://localhost:8083/deleteByDocumentId?documentId='+docId)
        .success(function(data){
          console.log('successfully delete review');
          

        })
        .error(function(data){
          console.log('cannot reach review-service port 8083')
        });

    console.log('deleting file')
    $http.get('http://localhost:8084/deletebydocid?documentId='+docId)
        .success(function(data){
          console.log('successfully delete file');
          

        })
        .error(function(data){
          console.log('cannot reach file-service port 8084')
        });

    console.log('delete documentid from folder')
    FolderService.deleteDocument(folderId,docId);

  }

  this.publish = function(docId){
    $http.get('http://localhost:8081/publish?documentid='+docId)
        .success(function(data){
          console.log('successfully publish document');
          $window.location.reload();

        })
        .error(function(data){
          console.log('cannot reach document-service port 8081')
        });
  }

})


.service('ReviewService', function($http,$window) {

  this.getReview = function(){

  }

  this.approve = function(docId,approverId,reviewText){
    $http.get('http://localhost:8083/createreview?documentid='+docId+'&approverid='+approverId+'&reviewdesc='+reviewText)
        .success(function(data){
        console.log('created review from '+approverId+' review text: '+reviewText);
        $http.get('http://localhost:8081/approve?documentid='+docId)
          .success(function(data){
            console.log('successfully approve document: change from waiting for approval to aprove');
            $window.location.href=('#/app/doclistforboss');

          })
          .error(function(data){
            console.log('cannot reach document-service port 8081')
          });
                
        })
        .error(function(data){
          console.log('cannot reach review-service port 8083')
        });
  }

  this.reject = function(docId,approverId,reviewText){

    $http.get('http://localhost:8083/createreview?documentid='+docId+'&approverid='+approverId+'&reviewdesc='+reviewText)
          .success(function(data){
            console.log('created review from '+approverId+' review text: '+reviewText);
            $http.get('http://localhost:8081/reject?documentid='+docId)
              .success(function(data){
                console.log('successfully reject document: change from approve to reject');
                $window.location.href=('#/app/doclistforboss');
              })
              .error(function(data){
                console.log('cannot reach document-service port 8081')
              });
          })
          .error(function(data){
            console.log('cannot reach review-service port 8083')
          });

  }

})

.service('FileService', function(Upload, $http, $window) {


  this.upload = function (file, docId) {
     
        console.log("File service from controller: uploading file ("+file.size+") to document id: "+docId);
      
        Upload.upload({
            url: 'http://localhost:8084/upload',
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
      
      $http.get('http://localhost:8084/filedetail?documentId='+docId)
        .success(function(data){
          
        })
        .error(function(data){
          console.log('cannot reach file-service port 8084')
          console.log(data)
        });
 

    }

    this.download = function(docId){
      var url = 'http://localhost:8084/download?documentId='+docId;
      console.log(url)
      $window.open(url);
    }

    this.delete = function(docId){
       $http.get('http://localhost:8084/deletebydocid?documentId='+docId)
        .success(function(data){
          
        })
        .error(function(data){
          console.log('cannot reach file-service port 8084')
          console.log(data)
        });
    }

    this.copy = function(copyFrom, copyTo){
      $http.get('http://localhost:8084/copy?copyFrom='+copyFrom+'&copyTo='+copyTo)
        .success(function(data){
          console.log(data);

        })
        .error(function(data){
          console.log('cannot reach file-service port 8084')
        });
    }

})

.service('FolderService', function(Upload, $http, $window) {
  this.newFolder = function(folderName, creatorId){
    $http({
        method: 'POST',
        url: 'http://localhost:8085/createFolder',
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

        $window.location.href=('#/app/folderlist');
      }).
      error(function(data, status, headers, config) {
        console.log('cannot reach folder-service port 8085')
      });

  }


  this.delete = function(folderId){
    $http.get('http://localhost:8085/folder?folderId='+folderId)
        .success(function(data){
          for (var i = 0; i < data.numberOfDocuments; i++) {
            var docId = data.documentList[i];
            console.log('docId: '+docId)
           console.log('deleting document');
            $http.get('http://localhost:8081/delete?documentid='+docId)
                .success(function(data){
                  console.log('successfully delete document');
                  

                })
                .error(function(data){
                  console.log('cannot reach document-service port 8081')
                });
            console.log('deleting review');
            $http.get('http://localhost:8083/deleteByDocumentId?documentId='+docId)
                .success(function(data){
                  console.log('successfully delete review');
                  

                })
                .error(function(data){
                  console.log('cannot reach review-service port 8083')
                });

            console.log('deleting file')
            $http.get('http://localhost:8084/deletebydocid?documentId='+docId)
                .success(function(data){
                  console.log('successfully delete file');
                  

                })
                .error(function(data){
                  console.log('cannot reach file-service port 8084')
                });



          };

          $http.get('http://localhost:8085/deleteById?folderId='+folderId)
            .success(function(data){
              console.log('successfully delete folder: '+folderId)
              $window.location.reload();
            })
            .error(function(data){
              console.log('cannot reach folder-service port 8085')
              console.log(data)
            });

        })
        .error(function(data){
          console.log('cannot reach folder-service port 8085')
          console.log(data)
        });


    



  }

  this.update = function(folderId, folderName){
    $http({
        method: 'POST',
        url: 'http://localhost:8085/update',
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

        $window.location.href=('#/app/folderlist');
      }).
      error(function(data, status, headers, config) {
        console.log('cannot reach folder-service port 8085')
      });

  }

  this.addDocument = function(folderId, docId){
      $http.get('http://localhost:8085/addDocument?folderId='+folderId+'&documentId='+docId)
        .success(function(data){
          console.log('successfully add new document')
        })
        .error(function(data){
          console.log('cannot reach folder-service port 8085')
          console.log(data)
        });

  }

  this.deleteDocument = function(folderId,docId){
    $http.get('http://localhost:8085/addDocument?folderId='+folderId+'&documentId='+docId)
        .success(function(data){
          console.log('successfully delete document')
        })
        .error(function(data){
          console.log('cannot reach folder-service port 8085')
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
