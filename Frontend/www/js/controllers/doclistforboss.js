angular.module('starter.controllers')
.controller('DocumentListForBossCtrl', function($scope, $stateParams,$ionicHistory, $http) {
  $ionicHistory.nextViewOptions({
    disableBack: true
  });

  $http.get('http://localhost:8085/folders')
    .success(function(data){
      $scope.documents = data;
      var alldoc = data;

      $http.get('http://localhost:8082/getusers')
        .success(function(data){
          var temp_users = data;
          for (var i = 0; i < alldoc.length; i++) {
              for (var j = 0; j < temp_users.length; j++) {
                if (alldoc[i].creatorId == temp_users[j].userId){
                  $scope.documents[i].creatorName = temp_users[j].lastname+" "+temp_users[j].firstname;
                  $scope.documents[i].lastDocId = $scope.documents[i].documentList[($scope.documents[i].documentList.length)-1];
                  break;
                }
              };
          };

          console.log($scope.documents);
            
        })
        .error(function(data){
          console.log('cannot reach user-service port 8082')
        });

        
    })
    .error(function(data){
      console.log('cannot reach document-service port 8081')
    });
        
})