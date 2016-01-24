angular.module('starter.controllers', [])

.service('pathService', function() {

})

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
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
          console.log('cannot reach document-service port 8082')
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
    $http.get('http://localhost:8081/newdraft?documentName='+$scope.doc.name+'&description='+$scope.doc.desc+'&creator=1')
        .success(function(data){
          $scope.savedoc = data;
          console.log('successfully create new draft');
          $window.location.href=('#/app/doclist');

        })
        .error(function(data){
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

  $http.get('http://localhost:8081/getdocument?documentid='+$stateParams.docId)
    .success(function(data){
      $scope.doc = data;
      $http.get('http://localhost:8082/getuser?userid='+$scope.doc.creator)
        .success(function(data){
          $scope.creator = data;
            
        })
        .error(function(data){
          console.log('cannot reach document-service port 8082')
        });
      $http.get('http://localhost:8082/getuser?userid='+$scope.doc.approver)
        .success(function(data){
          $scope.approver = data;
            
        })
        .error(function(data){
          console.log('cannot reach document-service port 8082')
        });

        $scope.docname = $scope.doc.documentName;
        $scope.docdesc = $scope.doc.description;

        $scope.save = function(documentid){
          $http.get('http://localhost:8081/save?docId='+documentid+'&documentName='+$scope.docname+'&description='+$scope.docdesc)
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

  $http.get('http://localhost:8081/getdocument?documentid='+$stateParams.docId)
    .success(function(data){
      $scope.doc = data;
      
      $http.get('http://localhost:8082/getuser?userid='+$scope.doc.creator)
        .success(function(data){
          $scope.creator = data;
            
        })
        .error(function(data){
          console.log('cannot reach document-service port 8082')
        });
      $http.get('http://localhost:8082/getuser?userid='+$scope.doc.approver)
        .success(function(data){
          $scope.approver = data;
            
        })
        .error(function(data){
          console.log('cannot reach document-service port 8082')
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
  $http.get('http://localhost:8081/getdocument?documentid='+$stateParams.docId)
    .success(function(data){
      $scope.doc = data;
      
      $http.get('http://localhost:8082/getuser?userid='+$scope.doc.creator)
        .success(function(data){
          $scope.creator = data;
            
        })
        .error(function(data){
          console.log('cannot reach document-service port 8082')
        });
      $http.get('http://localhost:8082/getuser?userid='+$scope.doc.approver)
        .success(function(data){
          $scope.approver = data;
            
        })
        .error(function(data){
          console.log('cannot reach document-service port 8082')
        });
        
        

    })
    .error(function(data){
      console.log('cannot reach document-service port 8081')
    });

    $scope.approve = function(docid){
      $http.get('http://localhost:8081/approve?documentid='+docid)
        .success(function(data){
          $scope.savedoc = data;
          console.log('successfully approve document: change from waiting for approval to aprove');
          $window.location.href=('#/app/doclistforboss');

        })
        .error(function(data){
          console.log('cannot reach document-service port 8081')
        });

    }
    $scope.reject = function(docid,approverid,reviewtext){
      
        $http.get('http://localhost:8081/reject?documentid='+docid)
          .success(function(data){
            
            $scope.savedoc = data;
            console.log('successfully reject document: change from aprove to reject');
            $http.get('http://localhost:8083/createreview?documentid='+docid+'&approverid='+approverid+'&reviewdesc='+reviewtext)
              .success(function(data){
                
                $scope.savedoc = data;
                console.log('successfully reject document: change from aprove to reject');
                
                
                $window.location.href=('#/app/doclistforboss');

              })
              .error(function(data){
                console.log('cannot reach document-service port 8081')
              });

            $window.location.href=('#/app/doclistforboss');

          })
          .error(function(data){
            console.log('cannot reach document-service port 8081')
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
