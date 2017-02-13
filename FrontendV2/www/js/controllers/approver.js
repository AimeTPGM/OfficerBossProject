angular.module('starter.controllers')
.controller('ApproverCtrl', function(
  $window, $http, $scope, $stateParams,$ionicHistory,
  Upload, 
  DocumentService, FolderService, BackendPath, LoginService,
  FileFactory, UserFactory, ApproverListFactory, DocumentFactory) {
  $ionicHistory.nextViewOptions({
    disableBack: true
  });
  console.log(LoginService.credential)
  console.log(LoginService.user)
  var userId = LoginService.user.userId;


  $scope.selectVersion = function(){
    $scope.showVersionSelector = function(){
      return true;
    }

    $scope.submit = function(versionType){
      ApproverListFactory.addApproverList($stateParams.docId, $scope.approverIdList).then(function(resp){
        if(resp.status == 200){
          console.log(resp.data)
          DocumentFactory.changeApprover($stateParams.docId, resp.data.approverIdList[0]).then(function(resp){
            if(resp.status == 200){
              console.log(resp.data)
              console.log("submitting current document : "+versionType)
              DocumentService.submit($stateParams.docId,versionType);
              $window.location.href=('#/app/doc');
            }
            else {
              console.log('cannot determine firstApprover')
            }
          })
        }
        else {
          console.log('cannot add approverlist')
        }
      })
    }

    $scope.hideVersionSelector = function(){
      $scope.showVersionSelector = function(){
        return false;
      }
    }
  }
  // $scope.addApprover = function(){
  //      console.log('aime')
  // }

  UserFactory.getBosses().then(function(resp){
    if(resp.status == 200){ 
      
      $scope.select = {
        availableOptions: resp.data,
        selectedOption: {id: '0', name: 'Please Select ...'}
        };
        $scope.approverList = [];
        $scope.approverIdList = [];
      $scope.addApprover = function(){
        $scope.approverList = $scope.approverList.concat([$scope.select.selectedOption]);
        $scope.approverIdList = $scope.approverIdList.concat([$scope.select.selectedOption.userId]);
        console.log($scope.approverIdList);
        

      }
      $scope.deleteApprover = function(index){
        $scope.approverList.splice(index, 1);
        $scope.approverIdList.splice(index, 1);
      }
    }
    else{ $scope.approvers = "Not available"; }
            
  });


})