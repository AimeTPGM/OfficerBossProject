angular.module('starter.controllers')
.controller('PublishDocumentCtrl', function($scope, $ionicModal, $timeout, $http, BackendPath) {
	$http.get(BackendPath.publishDocumentServicePath+'/publishDocuments')
        .success(function(data){
          if(data.length == 0){
          	showNoDocument();
          } else {
          	$scope.publishDocumentList = data;
          	showNoSelect();
          	$scope.detail = function(docId, publishDate){
          		$http.get(BackendPath.documentServicePath+'/getDocument?documentId='+docId)
			        .success(function(data){
			          $scope.doc = data;
			          $scope.doc.publishDate = publishDate;
			          console.log($scope.doc);
			          
			        })
			        .error(function(data){
			          console.log('cannot reach '+BackendPath.documentServicePath)
			          showNotFound();
			        });
          	}
          }
            
        })
        .error(function(data){
          console.log('cannot reach '+BackendPath.publishDocumentServicePath)
          showNoService();
        });



	var showNotFound = function(){
		$scope.notFound = function(){
			return true;
		}
		$scope.noSelect = function(){
			return false;
		}
		$scope.noService = function(){
			return false;
		}
		$scope.detailShow = function(){
			return false;
		}
		$scope.noDocument = function(){
			return false;
		}
		$scope.showList = function(){
			return true;
		}
	}

	var showNoSelect = function(){
		$scope.notFound = function(){
			return false;
		}
		$scope.noSelect = function(){
			return true;
		}
		$scope.noService = function(){
			return false;
		}
		$scope.detailShow = function(){
			return false;
		}
		$scope.noDocument = function(){
			return false;
		}
		$scope.showList = function(){
			return true;
		}
	}

	var showNoService = function(){
		$scope.notFound = function(){
			return false;
		}
		$scope.noSelect = function(){
			return false;
		}
		$scope.noService = function(){
			return true;
		}
		$scope.detailShow = function(){
			return false;
		}
		$scope.noDocument = function(){
			return false;
		}
		$scope.showList = function(){
			return false;
		}
	}

	var showDetail = function(){
		$scope.notFound = function(){
			return false;
		}
		$scope.noSelect = function(){
			return false;
		}
		$scope.noService = function(){
			return false;
		}
		$scope.detailShow = function(){
			return true;
		}
		$scope.noDocument = function(){
			return false;
		}
		$scope.showList = function(){
			return true;
		}
	}

	var showNoDocument = function(){
		$scope.notFound = function(){
			return false;
		}
		$scope.noSelect = function(){
			return false;
		}
		$scope.noService = function(){
			return false;
		}
		$scope.detailShow = function(){
			return false;
		}
		$scope.noDocument = function(){
			return true;
		}
		$scope.showList = function(){
			return false;
		}
	}


})

