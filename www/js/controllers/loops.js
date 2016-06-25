var App = angular.module('loop.controllers.loops', []);

App.controller('myLoopsController', ['$scope', '$ionicScrollDelegate', 'Loop', 'loops', function ($scope, $ionicScrollDelegate, Loop, loops) {

	$scope.loops = loops;

	$scope.locationTabs = ['Public', 'Private'];

	$scope.currentTab = $scope.locationTabs[0];

	$scope.onClickTab = function (tab) {
		$scope.currentTab = tab;
		if ($scope.currentTab == $scope.locationTabs[0])
			$scope.loops = loops;
		else
			$scope.loops = loops;
		$ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();
	};

	$scope.isActiveTab = function (tab) {
		return tab == $scope.currentTab;
	}
}]);

App.controller('loopProfileController', ['$scope', 'Survey', 'Friend', function ($scope, Survey, Friend) {

	Survey.load().then(function (res) {
		$scope.tabs[0].content = res.data;
	});

	$scope.tabs = [{
		title: "Surveys",
		content: []
	}, {
		title: "Members",
		content: Friend.getTopFriends()
	}];

	$scope.currentTab = $scope.tabs[0];

}]);

App.controller('createLoopController', ['$scope', '$ionicModal', '$cordovaCamera', 'Friend', function ($scope, $ionicModal, $cordovaCamera, Friend) {

	$scope.friends = Friend.getFriends();
	$scope.imgURI = "";

	$ionicModal.fromTemplateUrl('views/loops/addMembers.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
	});

	$scope.openMembersModal = function () {
		$scope.modal.show();
	};

	$scope.closeMembersModal = function() {
		$scope.modal.hide();
	};

	$scope.choosePhoto = function () {
		var options = {
			quality: 75,
			destinationType: Camera.DestinationType.DATA_URL,
			sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
			allowEdit: true,
			encodingType: Camera.EncodingType.JPEG,
			targetWidth: 300,
			targetHeight: 300,
			popoverOptions: CameraPopoverOptions,
			saveToPhotoAlbum: false
		};

		$cordovaCamera.getPicture(options).then(function (imageData) {
			$scope.imgURI = "data:image/jpeg;base64," + imageData;
		}, function (err) {
			// An error occured. Show a message to the user
		});
	}

}]);