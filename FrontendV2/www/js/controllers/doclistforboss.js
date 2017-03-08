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
      $scope.documents = resp.data[1];
      for (var i = 0; i < $scope.documents.length; i++) {
        $scope.documents[i].folder = {};
        $scope.documents[i].folder = resp.data[0][i];
      };
      for (var i = 0; i < $scope.documents.length; i++) {
        UserFactory.getUser($scope.documents[i].creatorId).then(function(resp){
          $scope.documents[i] = {};
          $scope.documents[i].creator = resp.data.lastname +" "+resp.data.firstname;  
        })
      };
    }
    else {

    }
  })

})