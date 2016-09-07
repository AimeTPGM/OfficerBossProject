angular.module('starter.controllers')
.controller('DocumentListForBossCtrl', function($scope, $stateParams,$ionicHistory, $http, 
  BackendPath, LoginService,
  FolderFactory, UserFactory, DocumentFactory) {
  $ionicHistory.nextViewOptions({
    disableBack: true
  });
  var userId = LoginService.user.userId;
  $scope.documents = [];
  DocumentFactory.getDocumentByApproverId(userId).then(function(resp){
    if(resp.status == 200){
      $scope.documents = resp.data;
      var doc = resp.data;
      var k=0;
      for (var i = 0; i < resp.data.length; i++) {
        UserFactory.getUser(resp.data[i].creator).then(function(resp){
          
          for (var j = 0; j < $scope.documents.length; j++) {
            if(resp.data.userId == $scope.documents[j].creator){
              $scope.documents[j].creator = resp.data.lastname +" "+resp.data.firstname;
              console.log($scope.documents[j])
              break;
            }

          };
        })
        FolderFactory.getFolderByDocumentId(resp.data[i].documentId).then(function(resp){

          for (var j = 0; j < $scope.documents.length; j++) {
            for (var k = 0; k < resp.data.documentList.length; k++) {
              if($scope.documents[j].documentId == resp.data.documentList[k]){
                $scope.documents[j].folder = [];
                $scope.documents[j].folder = resp.data;
              }
            };
          };
        })



      };
      
     
    }
     
    else {

    }
  })

})