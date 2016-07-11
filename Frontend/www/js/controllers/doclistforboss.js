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
      
      // for (var i = 0; i < $scope.alldoc.length; i++) {
      //   var tempDocId = $scope.alldoc[i].documentId;
      //   FolderFactory.getFolderByDocumentId(tempDocId).then(function(resp){
      //     if(resp.status == 200){
      //       $scope.alldoc[i].folder = resp.data;
      //     }
      //     else {
      //       console.log('cannot reach Folder service')
      //     }
      //   })

        // var tempCreatorId = $scope.alldoc[i].creatorId;
        // UserFactory.getUser(tempCreatorId).then(function(resp){
        // if(resp.status == 200){
        //     $scope.alldoc[i].creator = resp.data;
        //   }
        //   else {
        //     console.log('cannot reach User service')
        //   }
        // })

      // };
    }
     
    else {

    }
  })




  /**
  * Old version
  
  FolderFactory.getFolders().then(function(resp){
    if(resp.status == 200){
      $scope.documents = resp.data;
      var alldoc = resp.data;
      var temp = {};
      UserFactory.getUsers().then(function(resp){
        if(resp.status == 200){
          var temp_users = resp.data;
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
          for (var i = 0; i < alldoc.length; i++) {
            console.log(temp[i])
            DocumentFactory.getDocument(temp[i]).then(function(resp){
              if(resp.status == 200){
                for (var j = 0; j < alldoc.length; j++) {
                    if(temp[j] == resp.data.documentId){
                      $scope.documents[j].lastDocData = resp.data;
                      break;
                    }
                };
              }
              else{
                console.log('cannot reach '+BackendPath.documentServicePath)
              }
            })
          };
        }
        else{
          console.log('cannot reach '+BackendPath.userServicePath)
        }

      });
    }
    else{
      console.log('cannot reach '+BackendPath.folderServicePath)
      $scope.showNoConnection = function(){
        return true;
      }
    }
  }) 
  **/   
})