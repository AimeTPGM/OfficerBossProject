angular.module('starter.controllers')
.controller('DocumentListForBossCtrl', function($scope, $stateParams,$ionicHistory, $http) {
  $ionicHistory.nextViewOptions({
    disableBack: true
  });


  // For boss
  $http.get('http://localhost:8081/getalldocuments')
    .success(function(data){
      $scope.documents = data;
      var alldoc = data;

      $http.get('http://localhost:8082/getusers')
        .success(function(data){
          $scope.users = data;
          var temp_users = data;
          for (var i = 0; i < alldoc.length; i++) {
              for (var j = 0; j < temp_users.length; j++) {
                if (alldoc[i].creator == temp_users[j].userId){
                  $scope.documents[i].creatorName = temp_users[j].firstname;
                  break;
                }
              };
          };

          console.log(alldoc);
            
        })
        .error(function(data){
          console.log('cannot reach user-service port 8082')
        });

        
    })
    .error(function(data){
      console.log('cannot reach document-service port 8081')
    });
        
})