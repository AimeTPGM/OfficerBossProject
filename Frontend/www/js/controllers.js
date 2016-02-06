angular.module('starter.controllers', ['ngFileUpload'])

.service('pathService', function() {

})



.controller('LoginCtrl', function($scope, $ionicModal, $timeout, $state, $http,$window) {
    $scope.goto=function(toState,params){ 
     $state.go(toState,params) 
    }

    $scope.email = "";
    $scope.pw = "";

    $scope.login = function(){
      $http({
        method: 'POST',
        url: 'http://localhost:8082/login',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function(obj) {
            var str = [];
            for(var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
        },
        data: {email:$scope.email, password:$scope.pw}
      })
      .success(function(data, status, headers, config) {
        
      })
      .error(function(data, status, headers, config) {
        console.log($scope.email);
        console.log($scope.pw);
        console.log(data);
        console.log(headers);
        console.log('cannot reach user-service port 8082');
      });
      

    }

})

.controller('RegisterCtrl', function($scope, $ionicModal, $timeout, $state,$http,$window) {
    $scope.goto=function(toState,params){ 
     $state.go(toState,params);
    }

    $scope.user = {};
    console.log($scope.user)

    $scope.register = function(){

      $http({
        method: 'POST',
        url: 'http://localhost:8082/newboss',
        headers: {'Content-Type': 'application/json'},
        data: $scope.user
    
    })
      .success(function(data, status, headers, config) {
        console.log('sent POST request: successfully create new boss');
        console.log(data);


        $window.location.href=('#/login');
      })
      .error(function(data, status, headers, config) {
        console.log(data);
        console.log(headers);
        console.log('cannot reach user-service port 8082');
      });

    }


})

.controller('ForgotPasswordCtrl', function($scope, $ionicModal, $timeout, $state) {
    $scope.goto=function(toState,params){ 
     $state.go(toState,params) 
    }
})

.controller('FileCtrl', function($scope, $ionicModal, $timeout, $state, $http,Upload) {
    $scope.goto=function(toState,params){ 
     $state.go(toState,params) 
    }

    $scope.upload = function (file) {
        Upload.upload({
            url: 'http://localhost:8084/upload',
            method: 'POST',
            data: {file: file}
        }).then(function (resp) {
            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
    };


    $scope.testget = function(){
      
          $http.get('http://localhost:8084/upload')
          .success(function(data){
            console.log(data);
            console.log('reached')
          })
          .error(function(data){
            console.log('cannot reach file-service port 8084')
          });
    }

})




.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

})

.controller('DocumentListCtrl', function($scope, $stateParams,$ionicHistory, $http, $window) {
  $ionicHistory.nextViewOptions({
    disableBack: true
  });
  //For each user
  $http.get('http://localhost:8081/getalldocumentsbyuserid?userid=1')
  .success(function(data){
    $scope.documents = data;
    $http.get('http://localhost:8082/getuser?userid=1')
    .success(function(data){
      $scope.user = data;
    })
    .error(function(data){
      console.log('cannot reach user-service port 8082')
    });
  })


  .error(function(data){
      console.log('cannot reach document-service port 8081')
  });

  $scope.delete = function(id){
      $http.get('http://localhost:8081/delete?documentid='+id)
        .success(function(data){
          console.log('successfully delete document');
          $window.location.reload();

        })
        .error(function(data){
          console.log('cannot reach document-service port 8081')
        });
    }
  $scope.publish = function(id){
      $http.get('http://localhost:8081/publish?documentid='+id)
        .success(function(data){
          console.log('successfully publish document');
          $window.location.reload();

        })
        .error(function(data){
          console.log('cannot reach document-service port 8081')
        });
    }  
        
})

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


.controller('AddNewDocumentCtrl', function($window, $http, $scope, $stateParams,$ionicHistory) {
  $ionicHistory.nextViewOptions({
    disableBack: true
  });

  $scope.doc = {};
  var blank = {};

  $scope.save = function(){
    console.log($scope.doc);
    console.log($scope.doc.file);
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

        var file = $scope.myFile;
        var uploadUrl = 'http://localhost:8084/upload';
        fileUpload.uploadFileToUrl(file, uploadUrl);

        $window.location.href=('#/app/doclist');
      }).
      error(function(data, status, headers, config) {
        console.log('cannot reach document-service port 8081')
      });
  }
  
  $scope.submit = function(){
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

  $scope.reset = function(){
    $scope.doc = angular.copy(blank);
  }

})
.controller('EditDocumentCtrl', function($scope, $stateParams,$ionicHistory,$http,$window, $state) {
  $ionicHistory.nextViewOptions({
    disableBack: true
  });

  $http.get('http://localhost:8083/getreviewbydocumentid?documentid='+$stateParams.docId)
    .success(function(data){
      $scope.review = data;
      
      

    })
    .error(function(data){
      console.log('cannot reach review-service port 8083')
    });


  $http.get('http://localhost:8081/getdocument?documentid='+$stateParams.docId)
    .success(function(data){
      $scope.doc = data;
      $http.get('http://localhost:8082/getuser?userid='+$scope.doc.creator)
        .success(function(data){
          $scope.creator = data;
            
        })
        .error(function(data){
          console.log('cannot reach user-service port 8082')
        });
      $http.get('http://localhost:8082/getuser?userid='+$scope.doc.approver)
        .success(function(data){
          $scope.approver = data;
            
        })
        .error(function(data){
          console.log('cannot reach document-service port 8082')
        });

        // $scope.docname = "";
        // $scope.docdesc = "";

        $scope.save = function(documentid){
          $http.get('http://localhost:8081/save?docId='+documentid+'&documentName='+$scope.doc.documentName+'&description='+$scope.doc.description)
            .success(function(data){
              
              console.log('successfully save editing draft');
              $window.location.href=('#/app/doclist');

            })
            .error(function(data){
              console.log('cannot reach document-service port 8081')
            });
          $window.location.href=('#/app/doclist');
        }
        $scope.submit = function(documentid){
          alert('submit!');
          $http.get('http://localhost:8081/submit?documentid='+documentid)
            .success(function(data){
              $scope.savedoc = data;
              console.log('successfully submit document: change from draft to waiting for approval');
              $window.location.href=('#/app/doclist');

            })
            .error(function(data){
              console.log('cannot reach document-service port 8081')
            });
        }

        $scope.delete = function(documentid){
        $http.get('http://localhost:8081/delete?documentid='+documentid)
          .success(function(data){
            console.log('successfully delete document');
            $window.location.href=('#/app/doclist');

          })
          .error(function(data){
            console.log('cannot reach document-service port 8081')
          });
    }

        
    })
    .error(function(data){
      console.log('cannot reach document-service port 8081')
    });

  

})
.controller('DocumentDetailCtrl', function($scope, $stateParams,$ionicHistory, $http,$window) {
  $ionicHistory.nextViewOptions({
    disableBack: true
  });

  $http.get('http://localhost:8083/getreviewbydocumentid?documentid='+$stateParams.docId)
    .success(function(data){
      $scope.review = data;
      
      

    })
    .error(function(data){
      console.log('cannot reach review-service port 8083')
    });

  $http.get('http://localhost:8081/getdocument?documentid='+$stateParams.docId)
    .success(function(data){
      $scope.doc = data;
      
      $http.get('http://localhost:8082/getuser?userid='+$scope.doc.creator)
        .success(function(data){
          $scope.creator = data;
            
        })
        .error(function(data){
          console.log('cannot reach user-service port 8082')
        });
      $http.get('http://localhost:8082/getuser?userid='+$scope.doc.approver)
        .success(function(data){
          $scope.approver = data;
            
        })
        .error(function(data){
          console.log('cannot reach user-service port 8082')
        });
      

    })
    .error(function(data){
      console.log('cannot reach document-service port 8081')
    });
  

    $scope.publish = function(id){
      $http.get('http://localhost:8081/publish?documentid='+id)
        .success(function(data){
          console.log('successfully publish document');
          $window.location.href=('#/app/doclist');

        })
        .error(function(data){
          console.log('cannot reach document-service port 8081')
        });
    }

    $scope.delete = function(id){
      $http.get('http://localhost:8081/delete?documentid='+id)
        .success(function(data){
          console.log('successfully delete document');
          $window.location.href=('#/app/doclist');

        })
        .error(function(data){
          console.log('cannot reach document-service port 8081')
        });
    }

    $scope.submit = function(docid){
      $http.get('http://localhost:8081/submit?documentid='+docid)
        .success(function(data){
          $scope.savedoc = data;
          console.log('successfully submit document: change from draft to waiting for approval');
          $window.location.href=('#/app/doclist');

        })
        .error(function(data){
          console.log('cannot reach document-service port 8081')
        });

    }

    

})
.controller('DocumentReviewCtrl', function($scope, $stateParams,$ionicHistory, $http, $window) {
  $ionicHistory.nextViewOptions({
    disableBack: true
  });

  var documentid = $stateParams.docId;
  var approverid = "";

  $http.get('http://localhost:8081/getdocument?documentid='+$stateParams.docId)
    .success(function(data){
      $scope.doc = data;
      approverid = $scope.doc.approver;
      $http.get('http://localhost:8082/getuser?userid='+$scope.doc.creator)
        .success(function(data){
          $scope.creator = data;
            
        })
        .error(function(data){
          console.log('cannot reach user-service port 8082')
        });
      $http.get('http://localhost:8082/getuser?userid='+$scope.doc.approver)
        .success(function(data){
          $scope.approver = data;
            
        })
        .error(function(data){
          console.log('cannot reach user-service port 8082')
        });
        
        

    })
    .error(function(data){
      console.log('cannot reach document-service port 8081')
    });
    $scope.reviewtext = "";
    $scope.approve = function(){
      $scope.reviewtext = 'approved!';
      $http.get('http://localhost:8083/createreview?documentid='+documentid+'&approverid='+approverid+'&reviewdesc='+$scope.reviewtext)
        .success(function(data){
        console.log('created review from '+approverid+' review text: '+$scope.reviewtext);
        $http.get('http://localhost:8081/approve?documentid='+documentid)
          .success(function(data){
            $scope.savedoc = data;
            console.log('successfully approve document: change from waiting for approval to aprove');
            $window.location.href=('#/app/doclistforboss');

          })
          .error(function(data){
            console.log('cannot reach document-service port 8081')
          });
                
        })
        .error(function(data){
          console.log('cannot reach review-service port 8083')
        });


      

    }
    $scope.reject = function(){
        
        $http.get('http://localhost:8083/createreview?documentid='+documentid+'&approverid='+approverid+'&reviewdesc='+$scope.reviewtext)
          .success(function(data){
            console.log('created review from '+approverid+' review text: '+$scope.reviewtext);
            $http.get('http://localhost:8081/reject?documentid='+documentid)
              .success(function(data){
                console.log('successfully reject document: change from approve to reject');
                $window.location.href=('#/app/doclistforboss');
              })
              .error(function(data){
                console.log('cannot reach document-service port 8081')
              });
          })
          .error(function(data){
            console.log('cannot reach review-service port 8083')
          });

    }

})


.directive('showWhen', ['$window', function($window) {


 return {
    restrict: 'A',
    link: function($scope, $element, $attr) {

  function checkExpose() {
    var lg = $attr.showWhen == 'large' ? '(min-width:1024px)' : $attr.showWhen;
    var sm = $attr.showWhen == 'small' ? '(max-width:1024px)' : $attr.showWhen;
    if($window.matchMedia(lg).matches){
    $element.removeClass('ng-hide');
  } 
    else if($window.matchMedia(sm).matches){
    $element.removeClass('ng-hide');
  }

  else {
    $element.addClass('ng-hide');   
  }
  }

  function onResize() {
    debouncedCheck();
  }

  var debouncedCheck = ionic.debounce(function() {
    $scope.$apply(function(){
      checkExpose();
    });
  }, 300, false);

  checkExpose();

  ionic.on('resize', onResize, $window);

  $scope.$on('$destroy', function(){
    ionic.off('resize', onResize, $window);
  });

}
  };
}]);;
