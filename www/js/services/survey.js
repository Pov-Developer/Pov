var App = angular.module('loop.services.survey', []);

App.service('Survey', function (RequestService) {

	var self = this;

	self.page = 0;
	self.isLoading = false;
	self.hasMore = true;
	self.query = {
		type: "All",
		location: "Global",
		popularity: "Hot"
	};

	self.refresh = function () {
		self.page = 0;
		self.isLoading = false;
		self.hasMore = true;
		return self.load();
	};

	self.next = function () {
		self.page += 1;
		return self.load();
	};

	self.load = function (query) {
		if (query) {
			self.query = query;
			self.page = 0;
		}
		self.isLoading = true;
		var params = {
			page: self.page,
			type: self.query.type,
			location: self.query.location,
			popularity: self.query.popularity
		};

		return RequestService.get('surveys', params)
			.success(function (data) {
				self.isLoading = false;
				if (data.length == 0)
					self.hasMore = false;
				return data;
			})
			.error(function (data, status, headers, config) {
				self.isLoading = false;
				return data;
			});
	};
});

App.service('MySurvey', function (Session, RequestService) {
	var self = this;
	// store all surveyTypes (like a cache)
	var surveys = {};
	// used to check if survey cache is stale
	var lastUser = Session.getId();
	self.isLoading = false;

	this.load = function (query) {
		if(lastUser != Session.getId())
			surveys = {};
		if(surveys[query.status + '' + query.type])
			return Promise.resolve(surveys[query.status + '' + query.type]);
		else{
			return getSurveys(query);
		}
	};

	this.refresh = function (query) {
		return getSurveys(query);
	};

	function getSurveys(query){
		self.isLoading = true;
		return RequestService.get('users/' + Session.getId() + '/surveys', query, true).then(function (res) {
				res.data = res.data.map(function (survey) {
					survey.status = 'draft';
					return survey;
				});
				surveys[query.status + '' + query.type] = res.data;
				return res.data;
			})
			.catch(function (data, status, headers, config) {
				// return empty array
				return [];
			}).finally(function () {
				self.isLoading = false;
			});
	}
});

App.service('CreateSurveyService', function ($ionicActionSheet, $state) {
	var _questions = [];
	var _name = "";
	var _description = "";
	var _loops = [];
	var _attributes = [];

	this.newQuestionType = "";

	this.getSurveyInfo = function () {
		return {
			name: _name,
			description: _description,
			loops: _loops,
			attributes: _attributes
		}
	};

	this.setSurveyInfo = function (surveyInfo) {
		_name = surveyInfo.name;
		_description = surveyInfo.description;
		_loops = surveyInfo.loops;
		_attributes = surveyInfo.attributes;
	};

	this.getSurvey = function () {
		return {
			name: _name,
			description: _description,
			loops: _loops,
			attributes: _attributes,
			questions: _questions
		}
	};

	this.getQuestion = function (index) {
		if (index >= _questions.length || index < 0)
			return -1;
		return _questions[index];
	};

	this.addQuestion = function (question) {
		_questions.push(question);
	};

	this.editQuestion = function (question, index) {
		_questions[index] = question;
	};

	this.deleteQuestion = function (index) {
		_questions.splice(index, 1);
	};

	this.popQuestion = function () {
		return _questions.pop();
	};

	this.getQuestionsLength = function () {
		return _questions.length;
	};

	this.countCheckedChoices = countCheckedChoices;

	this.saveSurveyInfo = function (surveyInfo) {
		surveyInfo.loops = getCheckedItems(surveyInfo.loops);
		surveyInfo.attributes = getCheckedItems(surveyInfo.attributes);
		this.setSurveyInfo(surveyInfo);
	};

	this.saveSurvey = function (survey) {
		_name = survey.name;
		_description = survey.description;
		_loops = survey.loops;
		_attributes = survey.attributes;
		_questions = survey.questions;
	};

	this.resetSurvey = resetSurvey;

	this.exitSurveyPopup = function () {
		$ionicActionSheet.show({
			buttons: [
				{text: 'Save'},
			],
			cancelText: 'Cancel',
			cancel: function () {
				return true;
			},
			titleText: 'Exiting Survey',
			destructiveText: 'Delete',
			destructiveButtonClicked: function () {
				resetSurvey();
				$state.go("app.home");
				return true;
			},
			buttonClicked: function (index) {
				switch (index) {
					case 0:
						resetSurvey();
						$state.go('app.mySurveys');
				}
			}
		});
	};

	function resetSurvey() {
		_questions = [];
		_name = "";
		_description = "";
		_loops = [];
		_attributes = [];

		this.newQuestionType = "";
	}

	function getCheckedItems(items) {
		var result = [];
		angular.forEach(items, function (item, key) {
			if (item.checked)
				result.push(item);
		});
		return result;
	}
});

App.factory('QuestionFactory', function () {

	var QuestionFactory = function (questionType) {
		if (questionType == "ranking") {
			return new Ranking();
		}
		else if (questionType == "multipleChoice") {
			return new MultipleChoice();
		}
		else if (questionType == "textBox") {
			return new TextBox();
		}
		else if (questionType == "numberBox") {
			return new NumberBox();
		}
		else if (questionType == "sliderScale") {
			return new SliderScale();
		}
	};

	var Ranking = function () {
		this.questionType = "ranking";
		this.title = "";
		this.choices = [];
		this.required = true;
		this.randomize = false;

		this.validateQuestion = function () {
			if (!this.title)
				return "Please fill out the question field";
			if (this.choices.length <= 1)
				return "Must have 2 or more choices";
			if (!validTextChoices(this.choices))
				return "Choices can't be blank";
		}
	};

	var MultipleChoice = function () {
		this.questionType = "multipleChoice";
		this.title = "";
		this.choices = [];
		this.required = true;
		this.randomize = false;
		this.multipleSelections = false;

		this.validateQuestion = function () {
			if (!this.title)
				return "Please fill out the question field";
			if (this.choices.length <= 1)
				return "Must have 2 or more choices";
			if (!validTextChoices(this.choices))
				return "Choices can't be blank";
		}
	};

	var TextBox = function () {
		this.questionType = "textBox";
		this.title = "";
		this.text = "";
		this.minChars = 0;
		this.maxChars = 140;
		this.required = true;

		this.validateQuestion = function () {
			if (!this.title)
				return "Please fill out the question field";
			if (!isInt(this.minChars) || !isInt(this.maxChars))
				return "Please enter valid integers in the fields";

			this.minChars = parseInt(this.minChars);
			this.maxChars = parseInt(this.maxChars);

			if (this.minChars < 0) {
				return "Minimum characters can't be negative"
			}
			if (this.maxChars <= 0) {
				return "Max characters can't be less than or equal to zero"
			}
			if (this.minChars >= this.maxChars) {
				return "Minimum characters must be less than max characters"
			}
		}
	};

	var NumberBox = function () {
		this.questionType = "numberBox";
		this.title = "";
		this.number = null;
		this.minNumber = 0;
		this.maxNumber = 256;
		this.required = true;

		this.validateQuestion = function () {
			if (!this.title)
				return "Please fill out the question field";
			if (!isInt(this.minNumber) || !isInt(this.maxNumber))
				return "Please enter valid integers in the fields";

			this.minNumber = parseInt(this.minNumber);
			this.maxNumber = parseInt(this.maxNumber);

			if (this.minNumber >= this.maxNumber) {
				return "Minimum number cannot be larger or equal to maximum number";
			}
		}
	};

	var SliderScale = function () {
		this.questionType = "sliderScale";
		this.title = "";
		this.scale = {};
		this.required = true;

		this.validateQuestion = function () {
			if (!this.title)
				return "Please fill out the question field";
			if (!this.scale.name) {
				return "Please select a scale";
			}
		}
	};

	function validTextChoices(choices) {
		for (var i = 0; i < choices.length; i++) {
			if (!choices[i].text)
				return false
		}
		return true;
	}

	return {
		Question: QuestionFactory
	};
});

App.service('SurveyTakingService', function () {

	this.validateAnswer = function (question) {
		switch (question.questionType) {
			case "ranking":
				break;
			case "multipleChoice":
				var checkedCounter = countCheckedChoices(question.choices);
				if (checkedCounter == 0 && question.required)
					return "Question is required";
				if (checkedCounter > 1 && !question.multipleSelections)
					return "Please select only one choice";
				break;
			case "textBox":
				if (!question.text && question.required)
					return "Question is required";
				if (question.text.length > question.maxChars)
					return "Answer's length must be less than or equal to " + question.maxChars + " characters";
				if (question.text.length < question.minChars)
					return "Answer must be at least " + question.minChars + " characters long";
				break;
			case "numberBox":
				if (!question.number && question.required)
					return "Question is required";
				if (!isInt(question.number))
					return "Please enter a valid integer";
				question.number = parseInt(question.number);
				if (question.number < question.minNumber)
					return "Answer must be larger than or equal to " + question.minNumber;
				if (question.number > question.maxNumber)
					return "Answer must be less than or equal to " + question.maxNumber;
				break;
			case "scale":
				break;

		}
	}
});

App.service('SharedSurvey', function () {
	var survey = null;

	resetSurvey();

	function resetSurvey() {
		survey = {
			questions: [
				{
					"questionType": "ranking",
					"title": "How would you rate your overall satisfaction with us?",
					"required": true,
					"randomize": true,
					"choices": [
						{
							"text": "1"
						},
						{
							"text": "2"
						},
						{
							"text": "3"
						}
					]
				},
				{
					"questionType": "numberBox",
					"title": "How many times have you fallen out of your bed?",
					"required": true,
					"minNumber": 0,
					"maxNumber": 140
				},
				{
					"questionType": "textBox",
					"title": "How likely is it that you would recommend us to a friend/colleague?",
					"required": true,
					"minChars": 0,
					"maxChars": 140
				},
				{
					"questionType": "sliderScale",
					"title": "Would you go again sky diving?",
					"required": true,
					"scale": {
						"name": "Agreement",
						"steps": [
							"Strongly Disagree",
							"Disagree",
							"Neither Agree or Disagree",
							"Agree",
							"Strongly Agree"
						]
					}
				},
				{
					"questionType": "multipleChoice",
					"title": "What's your favorite pet?",
					"required": true,
					"multipleSelections": false,
					"randomize": true,
					"choices": [
						{
							"text": "1"
						},
						{
							"text": "2"
						},
						{
							"text": "3"
						}
					]
				}
			],
			name: "Survey 1",
			description: "Big description",
			loops: [{name: "Public"}],
			attributes: []
		};
	}

	return {
		getSurvey: function () {
			return survey;
		},
		setSurvey: function (value) {
			survey = value;
		},
		resetSurvey: resetSurvey
	};
});

function countCheckedChoices(array) {
	var checkedCounter = 0;
	angular.forEach(array, function (value, key) {
		if (value.checked)
			checkedCounter++;
	});
	return checkedCounter;
}

function isInt(value) {
	return !isNaN(value) &&
		parseInt(Number(value)) == value && !isNaN(parseInt(value, 10));
}