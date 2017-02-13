angular.module('starter.controllers')
.controller('PreferencesCtrl', function($scope, $ionicModal, $timeout,
	LoginService,FolderFactory, DocumentFactory, UserFactory, $http) {
	console.log(LoginService.credential)
  	console.log(LoginService.user.userId)
 	var userId = LoginService.user.userId;
	console.log(userId)
	$http.get("http://localhost:5001/user/"+userId+"/relationships")
	.then(function(resp){
		if(resp.status == 200){
			$scope.directBossList = resp.data;
			console.log(resp.data)
		}
	})

	$http.get("http://localhost:5001/users")
	.then(function(resp){
		if(resp.status == 200){
			$scope.allUserList = resp.data;
			console.log(resp.data)
			$scope.select = {
		        availableOptions: resp.data,
		        selectedOption: {id: '0', name: 'Please Select ...'}
		    };
		    $scope.addBoss = function(){
		        $http({
			        method: 'POST',
			        url: 'http://localhost:5001/newRelationship',
			        headers: {'Content-Type': 'application/json'},
			        data: {
			        	"bossId" : $scope.select.selectedOption.userId,
			        	"subordinateId" : userId
			        }
		      	})
				.then(function(resp){
					if(resp.status == 200){
						$scope.directBossList = $scope.directBossList.concat([$scope.select.selectedOption]);
						console.log(resp.data)
					}
				})
		      }

		}
	})

	$scope.removeRelationship = function(bossId, index){
		$http({
	        method: 'POST',
	        url: 'http://localhost:5001/removeRelationship',
	        headers: {'Content-Type': 'application/json'},
	        data: {
	        	"bossId" : bossId,
	        	"subordinateId" : userId
	        }
      	})
		.then(function(resp){
			if(resp.status == 200){
				$scope.directBossList.splice(index, 1)
				console.log(resp.data)
			}
		})
	}

	$scope.showUsertoAdd = function(){
		$scope.showUser = function(){
			return true;
		}
		$scope.close = function(){
			$scope.showUser = function(){
				return false;
			}
		}
	}
})

