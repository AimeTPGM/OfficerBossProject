angular.module('starter.controllers')
.factory('ReviewFactory', function($http, BackendPath) {

   var review = {};

   review.getReview = function(docId, approverId){
    return $http.get(BackendPath.reviewServicePath+'/getReviewByDocument?documentId='+docId+'&&approverId='+approverId)
    .then(function(resp){
      return resp;
    }, function(resp){
      return resp;
    })
     
   }

   return review;
})