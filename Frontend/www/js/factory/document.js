angular.module('starter.controllers')
.factory('DocumentFactory', function($http, BackendPath) {

   var doc = {};

   doc.getDocument = function(docId){
    return $http.get(BackendPath.documentServicePath+'/getDocument?documentId='+docId)
    .then(function(resp){
      return resp;
    }, function(resp){
      return resp;
    })
     
   }

   doc.newEditDraft = function(docId, docName, docDesc){

    return $http({
                method: 'POST',
                url: BackendPath.documentServicePath+'/newEditDraft',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: {
                  documentName: docName, 
                  description: docDesc, 
                  documentId: docId
                }
              
            })
    .then(function(resp){
      return resp;
    }, function(resp){
      return resp;
    })

   }

   doc.save = function(docId, docName, docDesc){
    return $http({
                method: 'POST',
                url: BackendPath.documentServicePath+'/save',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: {
                  documentName: docName, 
                  description: docDesc, 
                  documentId: docId
                }
              
            })
    .then(function(resp){
      return resp;
    }, function(resp){
      return resp;
    })

   }

   doc.changeApprover = function(docId, approverId){
    return $http.get(BackendPath.documentServicePath+'/changeApprover?documentId='+docId+'&&approverId='+approverId)
    .then(function(resp){
      return resp;
    }, function(resp){
      return resp;
    })

   }

   doc.getDocumentByApproverId = function(approverId){
    return $http.get(BackendPath.documentServicePath+'/getDocumentByApproverId?approverId='+approverId)
    .then(function(resp){
      return resp;
    }, function(resp){
      return resp;
    })

   }


   

   return doc;
})