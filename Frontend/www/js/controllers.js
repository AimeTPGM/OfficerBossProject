angular.module('starter.controllers', ['ngFileUpload'])

.service('DocumentService', function() {

  this.newdraft = function(){

  }

  this.save = function(){

  }

  this.submit = function(){

  }

  this.delete = function(){

  }

  this.publish = function(){

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

.service('FileService', function(Upload, $http, $window,$q) {


  this.upload = function (file, docId) {
     
        console.log("File service from cintroller: uploading file ("+file.size+")");
      
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
