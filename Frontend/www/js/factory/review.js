angular.module('starter.controllers')
.factory('ReviewFactory', function($http, BackendPath) {

   var review = {};

   review.getReview = function(docId){
    return $http.get(BackendPath.reviewServicePath+'/getReviewByDocumentId?documentId='+docId)
    .then(function(resp){
      return resp;
    }, function(resp){
      return resp;
    })
     
   }

   return review;
})