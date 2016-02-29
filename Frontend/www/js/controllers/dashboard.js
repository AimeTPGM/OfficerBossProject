angular.module('starter.controllers')
.controller('DashboardCtrl', function($scope, $ionicModal, $timeout,
	FolderFactory, DocumentFactory, UserFactory) {
	
	$scope.statistic = {};
	$scope.statistic.draft = 0;
	$scope.statistic.waiting = 0;
	$scope.statistic.reject = 0;
	$scope.statistic.approved = 0;
	$scope.statistic.publish = 0;

	console.log($scope.statistic)

	UserFactory.getUser(1).then(function(resp){
		if(resp.status == 200){ 
			$scope.user = resp.data;
		}
		else { 
			$scope.user = {};
			$scope.user.lastname = "This service is not available"
		} 
	})

	FolderFactory.getFolderByCreatorId(1).then(function(resp){
		if(resp.status == 200){
			var folders = resp.data;
			for (var i = 0; i < folders.length; i++){
				var index = folders[i].documentList.length - 1;
				var lastDocId = folders[i].documentList[index];
				DocumentFactory.getDocument(lastDocId).then(function(resp){
					if(resp.status == 200){
						if(resp.data.documentStatus == 'Draft'){
							$scope.statistic.draft +=1;
							
						} else if (resp.data.documentStatus == 'Waiting for Approval'){
							$scope.statistic.waiting +=1;
							
						} else if (resp.data.documentStatus == 'Reject'){
							$scope.statistic.reject +=1;
						} else if (resp.data.documentStatus == 'Approved'){
							$scope.statistic.approved +=1;
						} else if (resp.data.documentStatus == 'Publish'){
							$scope.statistic.publish +=1;
						}
					}
					else{ }
				})

			}

			
			
		}
		else { console.log(resp)}
	})
})

