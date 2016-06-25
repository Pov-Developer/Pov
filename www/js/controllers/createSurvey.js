//Controllers for create survey section
angular.module('loop.controllers.createSurvey', [])

	.controller('createSurveyController', ['$scope', 'PopupService', '$state', '$ionicActionSheet', 'CreateSurveyService', 'loops', 'attributes',
		function ($scope, PopupService, $state, $ionicActionSheet, CreateSurveyService, loops, attributes) {

			CreateSurveyService.resetSurvey();

			$scope.surveyInfo = {
				name: "",
				description: "",
				loops: [],
				attributes: []
			};

			$scope.surveyInfo.loops = loops;
			$scope.surveyInfo.loops.unshift({name: "Public", loopId: 1, checked: true});
			$scope.surveyInfo.attributes = attributes;

			$scope.startSurvey = function () {
				if ($scope.surveyInfo.name == "") {
					PopupService.alertCustom('Field Invalid', "Please fill out the survey name");
					return;
				}
				showActionSheet($ionicActionSheet, clickActionButtonConfig);
			};

			function clickActionButtonConfig(index) {
				setQuestionType(index, CreateSurveyService);
				// Save general info, loops, and attributes
				CreateSurveyService.saveSurveyInfo($scope.surveyInfo);
				$state.go("createSurveyFlow");
				return true;
			}
		}])

	.controller('createSurveyFlowController', ['$scope', '$state', '$ionicActionSheet', '$timeout', 'PopupService', '$ionicPlatform', 'CreateSurveyService', 'QuestionFactory',
		function ($scope, $state, $ionicActionSheet, $timeout, PopupService, $ionicPlatform, CreateSurveyService, QuestionFactory) {

			// Create a new question
			$scope.question = new QuestionFactory.Question(CreateSurveyService.newQuestionType);

			CreateSurveyService.addQuestion($scope.question);
			$scope.questionNumber = CreateSurveyService.getQuestionsLength();

			// For animation
			$scope.next = false;
			$scope.back = false;

			$scope.exitSurvey = function () {
				CreateSurveyService.exitSurveyPopup();
			};

			$scope.addQuestion = function () {
				// Validate question
				if (!testQuestion())
					showActionSheet($ionicActionSheet, clickActionButtonConfig);
			};

			$scope.deleteQuestion = function () {
				$scope.back = true;
				// Simulate animation
				$timeout(function () {
					CreateSurveyService.popQuestion();
					$scope.questionNumber = CreateSurveyService.getQuestionsLength();
					$scope.question = CreateSurveyService.getQuestion($scope.questionNumber - 1);
				}, 375);
				$timeout(function () {
					$scope.back = false;
				}, 750);
			};

			$scope.done = function () {
				if (!testQuestion())
					$state.go("reviewSurvey");
			};

			function testQuestion() {
				var result = $scope.question.validateQuestion();
				if (result)
					PopupService.alertCustom('Question Invalid', result);
				return result;
			}

			function clickActionButtonConfig(index) {
				setQuestionType(index, CreateSurveyService);
				$scope.next = true;
				$timeout(function () {
					$scope.question = new QuestionFactory.Question(CreateSurveyService.newQuestionType);
					CreateSurveyService.addQuestion($scope.question);
					$scope.questionNumber = CreateSurveyService.getQuestionsLength();
				}, 375);
				$timeout(function () {
					$scope.next = false;
				}, 750);
				return true;
			}

			$ionicPlatform.registerBackButtonAction(function (event) {
				CreateSurveyService.exitSurveyPopup();
			}, 100);
		}])

	.controller('reviewSurveyController', ['$scope', '$state', '$ionicActionSheet', '$ionicPlatform', '$timeout', 'PopupService', 'CreateSurveyService', 'Session', 'RequestService',
		function ($scope, $state, $ionicActionSheet, $ionicPlatform, $timeout, PopupService, CreateSurveyService, Session, RequestService) {

			$scope.survey = CreateSurveyService.getSurvey();

			$scope.exitSurvey = function () {
				CreateSurveyService.exitSurveyPopup();
			};

			$scope.addQuestion = function () {
				showActionSheet($ionicActionSheet, clickActionButtonConfig);
			};

			$scope.createSurvey = function () {
				RequestService.post('surveys', CreateSurveyService.getSurvey(), true)
					.then(function (res) {
						PopupService.show("surveyCreated");
						CreateSurveyService.resetSurvey();
					})
					.catch(function (res, status, headers, config) {
						PopupService.alert("genericError");
					});
			};

			function clickActionButtonConfig(index) {
				setQuestionType(index, CreateSurveyService);
				$state.go("addQuestion");
				return true;
			}

			$ionicPlatform.registerBackButtonAction(function (event) {
				CreateSurveyService.exitSurveyPopup();
			}, 100);
		}])

	.controller('editSurveyInfoController', ['$scope', '$ionicHistory', 'CreateSurveyService',
		function ($scope, $ionicHistory, CreateSurveyService) {
			$scope.surveyInfo = {};
			angular.copy(CreateSurveyService.getSurveyInfo(), $scope.surveyInfo);

			$scope.surveyInfo.loops = mergeLoops();
			$scope.surveyInfo.attributes = mergeAttributes();


			$scope.saveSurveyInfo = function () {
				CreateSurveyService.saveSurveyInfo($scope.surveyInfo);
				$ionicHistory.goBack();
			};

			function mergeLoops() {
				var loops = getLoops();
				angular.forEach(loops, function (item, key) {

						angular.forEach($scope.surveyInfo.loops, function (checkedItem, key) {
							if (checkedItem.name == item.name)
								item.checked = true;
						});

					}
				);
				return loops;
			}

			function mergeAttributes() {
				var attributes = getAttributes();
				angular.forEach(attributes, function (item, key) {

						angular.forEach($scope.surveyInfo.attributes, function (checkedItem, key) {
							if (checkedItem.name == item.name) {
								item.checked = true;
								item.required = checkedItem.required;
							}
						});

					}
				);
				return attributes;
			}
		}])

	.controller('addQuestionController', ['$scope', '$ionicHistory', 'PopupService', 'CreateSurveyService', 'QuestionFactory',
		function ($scope, $ionicHistory, PopupService, CreateSurveyService, QuestionFactory) {
			$scope.question = new QuestionFactory.Question(CreateSurveyService.newQuestionType);

			$scope.questionNumber = CreateSurveyService.getQuestionsLength();

			$scope.addQuestion = function () {
				var result = $scope.question.validateQuestion();
				if (result)
					PopupService.alertCustom('Question Invalid', result);
				else {
					CreateSurveyService.addQuestion($scope.question);
					$ionicHistory.goBack();
				}
			};
		}])

	.controller('editQuestionController', ['$scope', '$ionicHistory', 'PopupService', '$stateParams', 'CreateSurveyService', 'QuestionFactory',
		function ($scope, $ionicHistory, PopupService, $stateParams, CreateSurveyService) {

			$scope.questionNumber = parseInt($stateParams.questionNumber);

			$scope.question = {};

			angular.copy(CreateSurveyService.getQuestion($scope.questionNumber), $scope.question);

			$scope.saveQuestion = function () {
				var result = $scope.question.validateQuestion();
				if (result)
					PopupService.alertCustom('Question Invalid', result);
				else {
					CreateSurveyService.editQuestion($scope.question, $scope.questionNumber);
					$ionicHistory.goBack();
				}
			};
		}])

	.controller('mySurveysEditController', ['$scope', '$state', '$ionicActionSheet', 'CreateSurveyService', function ($scope, $state, $ionicActionSheet, CreateSurveyService) {
		$scope.survey = CreateSurveyService.getSurvey();

		$scope.addQuestion = function () {
			showActionSheet($ionicActionSheet, clickActionButtonConfig);
		};

		function clickActionButtonConfig(index) {
			setQuestionType(index, CreateSurveyService);
			$state.go("addQuestion");
			return true;
		}
	}]);

function getLoops() {
	return [
		{
			name: "Public",
			checked: false
		},
		{
			name: "Fight Club",
			checked: false
		},
		{
			name: "Poker Society",
			checked: false
		},
		{
			name: "Neighbors",
			checked: false
		}
	];
}

function getAttributes() {
	return [
		{
			name: "Gender",
			checked: false,
			required: false
		},
		{
			name: "Age",
			checked: false,
			required: false
		}
	];
}

function showActionSheet($ionicActionSheet, click) {
	$ionicActionSheet.show({
		buttons: [
			{text: 'Multiple Choice'},
			{text: 'Text Box'},
			{text: 'Slider Scale'},
			{text: 'Ranking'},
			{text: 'Number Box'}
		],
		titleText: 'Choose Question',
		destructiveText: 'Cancel',
		destructiveButtonClicked: function () {
			return true;
		},
		buttonClicked: click
	});
}

function setQuestionType(index, CreateSurveyService) {
	switch (index) {
		case 0:
			CreateSurveyService.newQuestionType = "multipleChoice";
			break;
		case 1:
			CreateSurveyService.newQuestionType = "textBox";
			break;
		case 2:
			CreateSurveyService.newQuestionType = "sliderScale";
			break;
		case 3:
			CreateSurveyService.newQuestionType = "ranking";
			break;
		case 4:
			CreateSurveyService.newQuestionType = "numberBox";
			break;
	}
}