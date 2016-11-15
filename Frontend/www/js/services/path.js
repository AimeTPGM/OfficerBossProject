angular.module('starter.controllers')

.service('BackendPath', function(){
  this.documentServicePath = "http://localhost:8081";
  this.userServicePath = "http://localhost:8082";
  this.reviewServicePath = "http://localhost:8083";
  this.fileServicePath = "http://localhost:8084";
  this.folderServicePath = "http://localhost:8085";
  this.publishDocumentServicePath = "http://localhost:8086";
  this.approverListServicePath = "http://localhost:8087";
})