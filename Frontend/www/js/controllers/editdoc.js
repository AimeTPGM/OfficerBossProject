angular.module('starter.controllers')
.controller('EditDocumentCtrl', function($scope, $stateParams,$ionicHistory,$http,$window, $state, DocumentService, FileService) {
  $ionicHistory.nextViewOptions({
    disableBack: true
  });

  $scope.savedDocData = null;

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
          console.log('cannot reach document-service port 8082')
        });

        $http.get('http://localhost:8084/filedetail?documentId='+$scope.doc.documentId)
        .success(function(data){
          $scope.filename = data;
            
        })
        .error(function(data){
          console.log('cannot reach file-service port 8084')
          console.log(data)
        });

        $scope.upload = function(file){
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
              data: {documentName:$scope.doc.name, description:$scope.doc.desc, documentId: $stateParams.docId}
            
          }).success(function(data, status, headers, config) {
            FileService.delete($stateParams.docId)
            FileService.upload(file, data.documentId)
            $scope.savedDocData = data;
            $http.get('http://localhost:8084/filedetail?documentId='+data.documentId)
            .success(function(data){
              $scope.filename = data;
                
            })
            .error(function(data){
              console.log('cannot reach file-service port 8084')
              console.log(data)
            });

          }).
          error(function(data, status, headers, config) {
            console.log('cannot reach document-service port 8081')
          });


        }

        $scope.save = function(documentid){

          DocumentService.save($stateParams.docId,$scope.doc.documentName,$scope.doc.description);
        }
        $scope.submit = function(docId, docStatus){
          
          if(docStatus != 'Draft'){
            if(!$scope.savedDocData){
               DocumentService.updateNoNewFile($scope.doc.documentName,$scope.doc.description,1,docId,$stateParams.folderId);

            }
            else{
              DocumentService.save(docId,$scope.doc.documentName,$scope.doc.description);
              DocumentService.submit(docId);
            }
            
          }
          else{

            DocumentService.submit(docId);
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