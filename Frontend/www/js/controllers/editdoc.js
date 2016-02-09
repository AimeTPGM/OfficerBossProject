angular.module('starter.controllers')
.controller('EditDocumentCtrl', function($scope, $stateParams,$ionicHistory,$http,$window, $state) {
  $ionicHistory.nextViewOptions({
    disableBack: true
  });

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

        $scope.save = function(documentid){
          $http.get('http://localhost:8081/save?docId='+documentid+'&documentName='+$scope.doc.documentName+'&description='+$scope.doc.description)
            .success(function(data){
              
              console.log('successfully save editing draft');
              $window.location.href=('#/app/doclist');

            })
            .error(function(data){
              console.log('cannot reach document-service port 8081')
            });
          $window.location.href=('#/app/doclist');
        }
        $scope.submit = function(documentid){
          alert('submit!');
          $http.get('http://localhost:8081/submit?documentid='+documentid)
            .success(function(data){
              $scope.savedoc = data;
              console.log('successfully submit document: change from draft to waiting for approval');
              $window.location.href=('#/app/doclist');

            })
            .error(function(data){
              console.log('cannot reach document-service port 8081')
            });
        }

        $scope.delete = function(documentid){
        $http.get('http://localhost:8081/delete?documentid='+documentid)
          .success(function(data){
            console.log('successfully delete document');
            $window.location.href=('#/app/doclist');

          })
          .error(function(data){
            console.log('cannot reach document-service port 8081')
          });
    }

        
    })
    .error(function(data){
      console.log('cannot reach document-service port 8081')
    });

  

})