angular.module('starter.controllers')
.controller('DocumentListForBossCtrl', function($scope, $stateParams,$ionicHistory, $http, BackendPath) {
  $ionicHistory.nextViewOptions({
    disableBack: true
  });

  $http.get(BackendPath.folderServicePath+'/folders')
    .success(function(data){
      $scope.documents = data;
      var alldoc = data;
      var temp = {};
      $http.get(BackendPath.userServicePath+'/users')
        .success(function(data){
          var temp_users = data;
          for (var i = 0; i < alldoc.length; i++) {
              for (var j = 0; j < temp_users.length; j++) {
                if (alldoc[i].creatorId == temp_users[j].userId){
                  $scope.documents[i].creatorName = temp_users[j].lastname+" "+temp_users[j].firstname;
                  $scope.documents[i].lastDocId = $scope.documents[i].documentList[($scope.documents[i].documentList.length)-1];
                  temp[i] = $scope.documents[i].lastDocId;
                  break;
                }
              };
          };

          console.log(temp)
          for (var i = 0; i < alldoc.length; i++) {
            console.log(temp[i])
                $http.get(BackendPath.documentServicePath+'/getDocument?documentId='+temp[i])
                  .success(function(data){
                    for (var j = 0; j < alldoc.length; j++) {
                      if(temp[j] == data.documentId){
                        $scope.documents[j].lastDocData = data;
                        console.log($scope.documents[j].lastDocData)
                        break;
                      }
                    };
                  })
                  .error(function(data){
                    console.log('cannot reach '+BackendPath.documentServicePath)
                  });

          };

          
            
        })
        .error(function(data){
          console.log('cannot reach '+BackendPath.userServicePath)
        });



      

        
    })
    .error(function(data){
      console.log('cannot reach '+BackendPath.documentServicePath)
       $scope.showNoConnection = function(){
            return true;
          }
    });
        
})