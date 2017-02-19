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
        $scope.documents[i].folder = [];
        $scope.documents[j].folder = resp.data[0][i];
      };
      var doc = resp.data;
      var k=0;
      for (var i = 0; i < $scope.documents.length; i++) {
        UserFactory.getUser($scope.documents[i].creator).then(function(resp){
          
          for (var j = 0; j < $scope.documents.length; j++) {
            if(resp.data.userId == $scope.documents[j].creator){
              $scope.documents[j].creator = resp.data.lastname +" "+resp.data.firstname;
              console.log($scope.documents[j])
              break;
            }
          };
        })
      };
    }
    else {

    }
  })

})