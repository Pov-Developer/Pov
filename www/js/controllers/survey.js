angular.module('loop.controllers.survey', [])
	.controller('surveyFlowController', ['$scope', '$stateParams', '$ionicHistory', 'PopupService', '$ionicLoading', '$timeout', '$state', '$ionicModal', '$ionicHistory', 'CreateSurveyService', 'Survey', 'SurveyTakingService', 'SharedSurvey', 'survey',
		function ($scope, $stateParams, $ionicHistory, PopupService, $ionicLoading, $timeout, $state, $ionicModal, $ionicHistory, CreateSurveyService, Survey, SurveyTakingService, SharedSurvey, survey) {
			var questions = survey.questions;
			$scope.currentIndex = 0;
			$scope.numOfQuestions = questions.length;
			$scope.question = questions[$scope.currentIndex];


			$scope.goRight = function () {
				var result = SurveyTakingService.validateAnswer($scope.question);
				if (result) {
					PopupService.alertCustom('Answer Invalid', result);
				}
				else {
					$scope.question = questions[++$scope.currentIndex];
				}
			};

			$scope.goLeft = function () {
				if ($scope.currentIndex > 0) {
					$scope.question = questions[--$scope.currentIndex];
				}
			};

			$scope.submitSurvey = function () {
				var result = SurveyTakingService.validateAnswer($scope.question);
				if (result) {
					PopupService.alertCustom('Answer Invalid', result);
				}
				else {
					$ionicLoading.show({
						template: '<ion-spinner icon="crescent"></ion-spinner>Submiting survey...'
					});
					console.log(questions);
					$timeout(function () {
							$ionicLoading.hide();
							PopupService.show('surveySubmitted');
						},
						2000);
				}
			};

			$scope.showSurveyInfo = function () {
				$ionicModal.fromTemplateUrl('views/survey/surveyInfoModal.html', {
					scope: $scope,
					animation: 'slide-in-up'
				}).then(function (modal) {
					$scope.surveyInfoModal = modal;
					$scope.surveyInfoModal.show();
				});
			};

			$scope.closeSurveyInfoModal = function () {
				$scope.surveyInfoModal.hide();
			};

			$scope.goBack = function () {
				$ionicHistory.goBack();
			};
		}])
	.controller('surveyStatsController', ['$scope',
		function ($scope) {
			$scope.answers = [
				{
					text: "What's your favorite sport?",
					questionType: "multipleChoice",
					choices: [
						{
							name: "Baseball",
							percentage: 22
						},
						{
							name: "Basketball",
							percentage: 50
						},
						{
							name: "Soccer",
							percentage: 28
						}
					]
				},
				{
					text: "Rank these sports?",
					questionType: "ranking",
					choices: [
						{
							name: "Golf",
							avg: 1.4
						},
						{
							name: "Soccer",
							avg: 2.4
						},
						{
							name: "Squash",
							avg: 4.5
						},
						{
							name: "Basketball",
							avg: 3.8
						}
					]
				},
				{
					text: "Describe your experience",
					questionType: "textBox"
				},
				{
					text: "How many kids do you have?",
					questionType: "numberBox",
					avg: 1.4
				},
				{
					text: "How happy are you?",
					questionType: "sliderScale",
					choices: [
						{
							name: "Sad",
							percentage: 42
						},
						{
							name: "Meh",
							percentage: 8
						},
						{
							name: "Somewhat Happy",
							percentage: 26
						},
						{
							name: "Happy",
							percentage: 24
						}
					]
				},
			];
		}])
	.controller('mySurveysController', ['$scope', '$ionicScrollDelegate', '$ionicPopover', '$state', 'SharedSurvey', 'CreateSurveyService', 'MySurvey', 'PopupService', function ($scope, $ionicScrollDelegate, $ionicPopover, $state, SharedSurvey, CreateSurveyService, MySurvey, PopupService) {
		$scope.surveyTypes = [
			{
				name: "Made",
				icon: "ion-arrow-right-c"
			},
			{
				name: "Taken",
				icon: "ion-arrow-left-c"
			}
		];
		$scope.surveyStatus = [
			{
				name: "All",
				icon: "ion-android-funnel"
			},
			{
				name: "Draft",
				icon: "ion-edit"
			},
			{
				name: "Open",
				icon: "ion-android-radio-button-off"
			},
			{
				name: "Completed",
				icon: "ion-android-done"
			}
		];
		$scope.typeIndex = 0;
		$scope.statusIndex = 0;

		$scope.surveys = [];
		// init Surveys
		getSurveys();

		$scope.editSurvey = function (survey) {
			survey = SharedSurvey.getSurvey();
			CreateSurveyService.saveSurvey(survey);
			$state.go("editMySurveys");
		};

		$ionicPopover.fromTemplateUrl('views/survey/mySurveys/surveyTypePopover.html', {
			scope: $scope
		}).then(function (popover) {
			$scope.typePopover = popover;
		});

		$ionicPopover.fromTemplateUrl('views/survey/mySurveys/surveyStatusPopover.html', {
			scope: $scope
		}).then(function (popover) {
			$scope.statusPopover = popover;
		});

		$scope.openTypePopover = function ($event) {
			$scope.typePopover.show($event);
		};

		$scope.openStatusPopover = function ($event) {
			$scope.statusPopover.show($event);
		};

		$scope.changeType = function (index) {
			$scope.typeIndex = index;
			getSurveys();
			$scope.typePopover.hide();
		};

		$scope.changeStatus = function (index) {
			$scope.statusIndex = index;
			getSurveys();
			$scope.statusPopover.hide();
		};

		$scope.doRefresh = function () {
			if (!MySurvey.isLoading) {
				var params = getQuery();
				MySurvey.refresh(params).then(function (res) {
					$scope.surveys = res;
					$scope.$broadcast('scroll.refreshComplete');
				}).catch(errorAlert);
			}
		};

		function getSurveys() {
			var params = getQuery();
			console.log("HEY");
			MySurvey.load(params).then(function (res) {
				$scope.surveys = res;
			}).catch(errorAlert)
		}

		function getQuery() {
			return {
				status: $scope.surveyStatus[$scope.statusIndex].name,
				type: $scope.surveyTypes[$scope.typeIndex].name
			};
		}

		function errorAlert(err) {
			$scope.hasMore = false;
			if (err.status != 401)
				PopupService.alert("genericError");
		}
	}]);