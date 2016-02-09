angular.module('starter.controllers')
.controller('AddNewDocumentCtrl', function($window, $http, $scope, $stateParams,$ionicHistory,Upload) {
  $ionicHistory.nextViewOptions({
    disableBack: true
  });

  $scope.doc = {};
  var blank = {};
  $scope.savedDocData = null;

  $scope.upload = function (file) {
    if(!$scope.doc.name){ $scope.doc.name = "Untitled"; }
    if(!$scope.doc.desc){ $scope.doc.desc = "no description";}
    console.log($scope.doc);

      $http({
        method: 'POST',
        url: 'http://localhost:8081/newdraft',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function(obj) {
            var str = [];
            for(var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
        },
        data: {documentName:$scope.doc.name, description:$scope.doc.desc, creator:1}
      
    }).
    success(function(data, status, headers, config) {
        console.log('sent POST request: successfully create new draft');
        console.log(data);
        $scope.savedDocData = data;
        Upload.upload({
            url: 'http://localhost:8084/upload',
            method: 'POST',
            data: {file: file, documentId: data.documentId}
        }).then(function (resp) {
            
            $scope.filename = resp.config.data.file.name;
            $scope.showFilename = function(){
              return true;
            }
            console.log('Success ' + resp.config.data.file.name + ' uploaded. Response: ' + resp.data);
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            $scope.progress = progressPercentage;
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
        // $window.location.href=('#/app/doclist');
      }).
      error(function(data, status, headers, config) {
        console.log('cannot reach document-service port 8081')
      });




        
    };

  $scope.save = function(){
    console.log($scope.doc);
    if(!$scope.savedDocData){
      console.log("creating new draft")
      $http({
        method: 'POST',
        url: 'http://localhost:8081/newdraft',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function(obj) {
            var str = [];
            for(var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
        },
        data: {documentName:$scope.doc.name, description:$scope.doc.desc, creator:1}
      
    }).
    success(function(data, status, headers, config) {
        console.log('sent POST request: successfully create new draft');
        console.log(data);

        $window.location.href=('#/app/doclist');
      }).
      error(function(data, status, headers, config) {
        console.log('cannot reach document-service port 8081')
      });
    }

    else {
      console.log("updating current draft")
      $http({
        method: 'POST',
        url: 'http://localhost:8081/save',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function(obj) {
            var str = [];
            for(var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
        },
        data: {documentId: $scope.savedDocData.documentId, documentName:$scope.doc.name, description:$scope.doc.desc}
      
    }).
    success(function(data, status, headers, config) {
        console.log('sent POST request: successfully updated current draft');
        console.log(data);

        $window.location.href=('#/app/doclist');
      }).
      error(function(data, status, headers, config) {
        console.log('cannot reach document-service port 8081')
      });
    }
    
    
  }
  
  $scope.submit = function(){
    console.log($scope.doc);
    if(!$scope.savedDocData){
      console.log("creating new document");
      $http.get('http://localhost:8081/newdocument?documentName='+$scope.doc.name+'&description='+$scope.doc.desc+'&creator=1')
        .success(function(data){
          $scope.savedoc = data;
          console.log('successfully create new document: waiting for approval');
          $window.location.href=('#/app/doclist');

        })
        .error(function(data){
          console.log('cannot reach document-service port 8081')
        });

    }
    else {
      console.log("updating current document")
      $http({
        method: 'POST',
        url: 'http://localhost:8081/save',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function(obj) {
            var str = [];
            for(var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
        },
        data: {documentId: $scope.savedDocData.documentId, documentName:$scope.doc.name, description:$scope.doc.desc}
      
    }).
    success(function(data, status, headers, config) {
        console.log('sent POST request: successfully updated current draft');
        console.log(data);

        $window.location.href=('#/app/doclist');
      }).
      error(function(data, status, headers, config) {
        console.log('cannot reach document-service port 8081')
      });

      $http.get('http://localhost:8081/submit?documentid='+$scope.savedDocData.documentId)
        .success(function(data){
          $scope.savedoc = data;
          console.log('successfully create new document: waiting for approval');
          $window.location.href=('#/app/doclist');

        })
        .error(function(data){
          console.log('cannot reach document-service port 8081')
        });
    }
    
  }

  $scope.reset = function(){
    $scope.doc = angular.copy(blank);
  }

})