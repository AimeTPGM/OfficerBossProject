angular.module('starter.controllers')
.controller('DocumentListCtrl', function($scope, $stateParams,$ionicHistory, $http, $window, 
  FolderService, DocumentService, BackendPath, LoginService,
  UserFactory, DocumentFactory, FolderFactory) {
  if (LoginService.credential == false){
    $window.location.href=('#/login');
  }
  var userId = LoginService.user.userId;
  $ionicHistory.nextViewOptions({
    disableBack: true
  });
  $scope.delete = function(folderId){
    FolderService.delete(folderId);
    $window.location.href=('#/app/doc');
  }

  $http.get(BackendPath.middleLayer+'/doclist/officer/'+userId).then(function(resp){
    if(resp.status == 200){
      console.log(resp)
      if(resp.data == 0){
          $scope.noDocument = function(){
          return true;
          $scope.showNoConnection = function(){
            return false;
          }
        } 
      }
      else {
        console.log(resp.data);
        $scope.folders = resp.data;
      }
    }
    else {
      console.log('cannot reach '+BackendPath.middleLayer)
      console.log(resp)
      $scope.showNoConnection = function(){ return true; }
    }
  })       
})

