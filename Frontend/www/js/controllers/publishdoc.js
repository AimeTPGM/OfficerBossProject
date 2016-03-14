angular.module('starter.controllers')
.controller('PublishDocumentCtrl', function($scope, $ionicModal, $timeout, $http, 
	BackendPath, FileService,
	PublishDocumentFactory, UserFactory, FileFactory) {
	$http.get(BackendPath.publishDocumentServicePath+'/publishDocuments')
        .success(function(data){
          if(data.length == 0){
          	showNoDocument();
          } else {
          	$scope.publishDocumentList = data;
          	showNoSelect();
          	$scope.detail = function(docId, publishDate){
          		$scope.doc = {};
			    PublishDocumentFactory.getDocument(docId).then(function(resp){
			        if(resp.status == 200){
			        	console.log('200')
			        	$scope.doc = resp.data;
			        	$scope.doc.publishDate = publishDate;
					    UserFactory.getUser($scope.doc.creator).then(function(resp){
					    	if(resp.status == 200){ $scope.doc.creator = resp.data.lastname+" "+resp.data.firstname; }
					    	else{ $scope.doc.creator = "Service is not available"; }
					        
					    });
					    UserFactory.getUser($scope.doc.approver).then(function(resp){
					        if(resp.status == 200){ $scope.doc.approver = resp.data.lastname+" "+resp.data.firstname; }
					    	else{ $scope.doc.approver = "Service is not available"; }
					    });
					    FileFactory.allFileDetail(docId).then(function(resp){
				            if(resp.status == 200){               
				            $scope.files = resp.data; 
				            $scope.numberOfFiles = $scope.files.length; 
				            $scope.showNone = function(){
				              return false;
				            }
				            $scope.haveFiles = function(){
				              return true;
				            }
				            $scope.showUploadedFiles = function(){
							  	$scope.showUploadedFileList = function(){
									return true;
								}
							}
							$scope.closeUploadedFiles = function(){
								$scope.showUploadedFileList = function(){
								      return false;
							    }
							}
							$scope.download = function(fileId){
							    FileService.download(fileId);
							  }
				            }
				            else{
				              $scope.showNone = function(){
				                return true;
				              }
				            }
				            
				          })
			        	showDetail();
			        }
			        else{
			        	console.log(resp)
			        	showNotFound();
			        }
			        
			        
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

