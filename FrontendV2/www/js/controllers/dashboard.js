angular.module('starter.controllers')
.controller('DashboardCtrl', function($scope, $ionicModal, $timeout,
	LoginService,FolderFactory, DocumentFactory, UserFactory) {
	console.log(LoginService.credential)
  	console.log(LoginService.user)
  	var userId = LoginService.user.userId;
	$scope.statistic = {};
	$scope.statistic.draft = 0;
	$scope.statistic.waiting = 0;
	$scope.statistic.reject = 0;
	$scope.statistic.approved = 0;
	$scope.statistic.publish = 0;

	console.log($scope.statistic)

	
  	$scope.chart ={
  		"label" : ['Draft', 'Waiting for Approval', 'Reject', 'Approved', 'Publish'],
  		"data" : [$scope.statistic.draft,$scope.statistic.waiting,$scope.statistic.reject,$scope.statistic.approved,$scope.statistic.publish],
  		"colours" : ['#ffc900','#0a9dc7','#ef473a','#33cd5f','#A4A4A4']
  	}

	UserFactory.getUser(userId).then(function(resp){
		if(resp.status == 200){ 
			$scope.user = resp.data;
			$scope.showProfile = function(){
				return true;
			}
			$scope.showEditProfileForm = function(){
				$scope.showEditProfile = function(){
					return true;
				}
				$scope.close = function(){
					$scope.showEditProfile = function(){
						return false;
					}
				}
			}
		}
		else { 
			$scope.user = {};
		} 
	})

	FolderFactory.getFolderByCreatorId(userId).then(function(resp){
		if(resp.status == 200){
			var folders = resp.data;
			
			for (var i = 0; i < folders.length; i++){
				var index = folders[i].documentList.length - 1;
				var lastDocId = folders[i].documentList[index];
				DocumentFactory.getDocument(lastDocId).then(function(resp){
					if(resp.status == 200){
						if(resp.data.documentStatus == 'Draft'){
							$scope.statistic.draft +=1;
							$scope.chart.data[0] +=1;
						} else if (resp.data.documentStatus == 'Waiting for Approval'){
							$scope.statistic.waiting +=1;
							$scope.chart.data[1] +=1;
						} else if (resp.data.documentStatus == 'Reject'){
							$scope.statistic.reject +=1;
							$scope.chart.data[2] +=1;
						} else if (resp.data.documentStatus == 'Approved'){
							$scope.statistic.approved +=1;
							$scope.chart.data[3] +=1;
						} else if (resp.data.documentStatus == 'Publish'){
							$scope.statistic.publish +=1;
							$scope.chart.data[4] +=1;
						}
					}
					else{ }
				})

			}

			console.log($scope.statistic)
			service();
			
			
		}
		else { 
			noService();
		}
	})

	var noService = function(){
		$scope.notFound = function(){
			return true;
		}
		$scope.available = function(){
			return false;
		}
	}
	var service = function(){
		$scope.notFound = function(){
			return false;
		}
		$scope.available = function(){
			return true;
		}
	}
})

