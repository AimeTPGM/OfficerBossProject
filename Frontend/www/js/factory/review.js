angular.module('starter.controllers')
.factory('ReviewFactory', function($http, BackendPath) {

   var review = {};

   review.getReview = function(docId){
    return $http.get(BackendPath.reviewServicePath+'/getReviewByDocumentId?documentId='+docId)
    .success(function(data){
      return data;
    })
    .error(function(data){
      console.log('cannot reach '+BackendPath.reviewServicePath)
      return data;
    });
     
   }

   return review;
})