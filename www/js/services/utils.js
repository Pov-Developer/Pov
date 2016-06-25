angular.module('loop.services.util', [])
	.service('RequestService', function ($http, Session, constants) {
		this.get = function(url, params, showLoading){
			params = params || {};
			showLoading = showLoading || false;
			return $http.get(constants.url + url, {params: params, showLoading: showLoading})
		};
		this.post = function(url, body, showLoading){
			showLoading = showLoading || false;
			return $http.post(constants.url + url, body, {showLoading: showLoading})
		}
	})
.factory('PopupService', function($ionicPopup, $state){
		var ALERT_MESSAGES = {
			genericError: {
				title: "Unexpected Error",
				template: "Please try again later"
			}
		};

		var POPUP_MESSAGES = {
			surveyCreated: {
				template: '<div class="survey-created"><i class="icon ion-checkmark-circled"></i></div>',
				title: 'Survey Created',
				buttons: [
					{
						text: 'Share',
						type: 'button-energized',
						onTap: function (e) {
							e.preventDefault()
						}
					},
					{
						text: 'My Surveys',
						type: 'button-calm',
						onTap: function (e) {
							$state.go('app.mySurveys');
						}
					}
					]
			},
			surveySubmitted: {
				template: '<div class="survey-created"><h3>Thank you!</h3></div>',
				title: 'Survey Submitted',
				buttons: [
					{
						text: 'Share',
						type: 'button-energized',
						onTap: function (e) {
							e.preventDefault()
						}
					},
					{
						text: 'Home',
						type: 'button-calm',
						onTap: function (e) {
							$state.go('app.home');
						}
					}
				]
			}
		};

		return{
			alert: function(type){
				$ionicPopup.alert(ALERT_MESSAGES[type]);
			},
			show: function(type){
				$ionicPopup.show(POPUP_MESSAGES[type]);
			},
			alertCustom: function(title, message){
				$ionicPopup.alert({
					title: title,
					template: message
				});
			}
		};
	});
