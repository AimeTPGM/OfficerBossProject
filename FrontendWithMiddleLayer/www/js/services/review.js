angular.module('starter.controllers')


.service('ReviewService', function($http,$window,FolderService,BackendPath) {

  this.approve = function(docId,approverId,reviewText){
    $http.get(BackendPath.reviewServicePath+'/approve?documentId='+docId+'&approverId='+approverId+'&reviewDesc='+reviewText)
        .success(function(data){
        console.log('created APPROVE review from '+approverId+' review text: '+reviewText);
        
                
        })
        .error(function(data){
          console.log('cannot reach '+BackendPath.reviewServicePath)
        });
  }

  this.changeDocumentToApprove = function(docId){
    $http.get(BackendPath.documentServicePath+'/approve?documentId='+docId)
    .success(function(data){
      console.log('successfully approve document: change from waiting for approval to aprove');
      $window.location.href=('#/app/doclistforboss');
    })
    .error(function(data){
      console.log('cannot reach '+BackendPath.documentServicePath)
    });
  }

  this.reject = function(docId,approverId,reviewText){

    $http.get(BackendPath.reviewServicePath+'/reject?documentId='+docId+'&approverId='+approverId+'&reviewDesc='+reviewText)
          .success(function(data){
            console.log('created REJECT review from '+approverId+' review text: '+reviewText);
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
