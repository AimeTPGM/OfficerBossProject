angular.module('starter.controllers')
.controller('DocumentListForBossCtrl', function($scope, $stateParams,$ionicHistory, $http, 
  BackendPath, LoginService,
  FolderFactory, UserFactory, DocumentFactory) {
  $ionicHistory.nextViewOptions({
    disableBack: true
  });
  console.log(LoginService.credential)
  console.log(LoginService.user)
  var userId = LoginService.user.userId;
  console.log(userId)
  DocumentFactory.getDocumentByApproverId(userId).then(function(resp){
    if(resp.status == 200){
      console.log(resp.data)
      $scope.documents = resp.data;
      var j = 0, k = 0;
      for (var i = 0; i < resp.data.length; i++) {
        FolderFactory.getFolderByDocumentId(resp.data[j].documentId).then(function(resp){
          $scope.documents[j].folder = resp.data;
          UserFactory.getUser($scope.documents[k].creator).then(function(resp){
            $scope.documents[k].creatorName =  resp.data.lastname +" "+resp.data.firstname;
            k++;
          })
          j++;
        })

      };
      
     
    }
     
    else {

    }
  })


})