angular.module('loop.services.auth', [])
	.service('AuthService', function (RequestService, Session) {
		var protectedRoutes = ['app.createSurvey'];

		this.login = function (credentials) {
			return RequestService
				.post('users/login', credentials, true)
				.then(function (res) {
					Session.create(res.data.id, res.data.token, res.data.firstName, res.data.lastName);
					return res;
				});
		};

		this.signUp = function (credentials) {
			return RequestService
				.post('users/signup', credentials, true)
				.then(function (res) {
					Session.create(res.data.id, res.data.token, res.data.firstName, res.data.lastName);
					return res;
				});
		};

		this.isAuthenticated = function () {
			return !!Session.getToken();
		};

		this.isProtected = function (stateName){
			return protectedRoutes.indexOf(stateName) > -1;
		}

	})
	.service('Session', function () {
		this.create = function (id, token, firstName, lastName) {
			localStorage.setItem("id", id);
			localStorage.setItem("token", token);
			localStorage.setItem("firstName", firstName);
			localStorage.setItem("lastName", lastName);
		};
		this.destroy = function () {
			localStorage.clear();
		};

		this.getToken = function(){
			return localStorage.getItem("token");
		};

		this.getId = function(){
			return localStorage.getItem("id");
		};

		this.getFirstName = function(){
			return localStorage.getItem("firstName");
		};

		this.getLastName = function(){
			return localStorage.getItem("lastName");
		};
	})
	.factory('sessionInjector', function (Session, $q, $rootScope) {
		return {
			request: function (config) {

				if(Session.getToken()) {
					config.headers['Authorization'] = 'Bearer ' + Session.getToken();
				}

				return config;
			},
			response: function(response){
				if (response.status === 401) {
					$rootScope.$broadcast('auth.unauthorized');
				}
				return response || $q.when(response);
			},
			responseError: function(rejection) {
				if (rejection.status === 401) {
					$rootScope.$broadcast('auth.unauthorized');
				}
				return $q.reject(rejection);
			}
		};
	});