angular.module('loop.controllers.login', [])
	.controller('loginController', ['$scope', '$state', '$ionicHistory', 'PopupService', 'AuthService', function ($scope, $state, $ionicHistory, PopupService, AuthService) {
		$scope.$on("$ionicView.enter", function () {
			$ionicHistory.clearCache();
			$ionicHistory.clearHistory();
		});
		
		$scope.user = {};
		var message = '';

		$scope.login = function (userForm) {
			if (!userForm.$valid)
				return;
			AuthService.login($scope.user)
				.then(function (res) {
					$state.go('app.home');
				}
			).catch(function (err) {
					if (err.status == 401)
						message = 'Username or password is incorrect';
					else
						message = 'Unexpected error, please try again';
					PopupService.alertCustom('Login Error', message);
				});
		}
	}])
	.controller('signupController', ['$scope', '$state', '$ionicViewSwitcher', '$ionicLoading', 'PopupService', 'AuthService', function ($scope, $state, $ionicViewSwitcher, $ionicLoading, PopupService, AuthService) {

		$scope.user = {};
		var message = '';
		$scope.passwordMatch = false;

		$scope.signUp = function (signUpForm) {
			$scope.passwordMatch = ($scope.user.password == $scope.user.confirmedPassword) && $scope.user.password.length != 0;

			if (!signUpForm.$valid)
				return;
			if (!$scope.passwordMatch)
				return;
			AuthService.signUp($scope.user)
				.then(function (res) {
					$ionicViewSwitcher.nextDirection('forward');
					$state.go('app.home');
				}
			).catch(function (err) {
					if (err.status == 400)
						message = 'Bad request please try again';
					else if (err.status == 409)
						message = 'Account already exists with the same email';
					else
						message = 'Unexpected Error, Please Try Again';
					PopupService.alertCustom('Sign Up Error', message);
				});
		};
	}]);