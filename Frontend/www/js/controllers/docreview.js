angular.module('starter.controllers')
.controller('DocumentReviewCtrl', function($scope, $stateParams,$ionicHistory, $http, $window) {
  $ionicHistory.nextViewOptions({
    disableBack: true
  });

  var documentid = $stateParams.docId;
  var approverid = "";

  $http.get('http://localhost:8081/getdocument?documentid='+$stateParams.docId)
    .success(function(data){
      $scope.doc = data;
      approverid = $scope.doc.approver;

      $scope.download = function(){
          var url = 'http://localhost:8084/download?documentId='+$stateParams.docId;
          console.log(url)
          $window.open(url);
          
    }

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
        $http.get('http://localhost:8084/filedetail?documentId='+$scope.doc.documentId)
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
    $scope.reviewtext = "";
    $scope.approve = function(){
      $scope.reviewtext = 'approved!';
      $http.get('http://localhost:8083/createreview?documentid='+documentid+'&approverid='+approverid+'&reviewdesc='+$scope.reviewtext)
        .success(function(data){
        console.log('created review from '+approverid+' review text: '+$scope.reviewtext);
        $http.get('http://localhost:8081/approve?documentid='+documentid)
          .success(function(data){
            $scope.savedoc = data;
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
    $scope.reject = function(){
        
        $http.get('http://localhost:8083/createreview?documentid='+documentid+'&approverid='+approverid+'&reviewdesc='+$scope.reviewtext)
          .success(function(data){
            console.log('created review from '+approverid+' review text: '+$scope.reviewtext);
            $http.get('http://localhost:8081/reject?documentid='+documentid)
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