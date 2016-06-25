angular.module('loop.directives.utils', [])

	.directive('autoListDivider', function ($timeout) {
		var lastDivideKey = "";

		return {
			link: function (scope, element, attrs) {
				var key = attrs.autoListDividerValue;

				var defaultDivideFunction = function (k) {
					return k.slice(0, 1).toUpperCase();
				}

				var doDivide = function () {
					var divideFunction = scope.$apply(attrs.autoListDividerFunction) || defaultDivideFunction;
					var divideKey = divideFunction(key);

					if (divideKey != lastDivideKey) {
						var contentTr = angular.element("<div class='item item-divider'>" + divideKey + "</div>");
						element[0].parentNode.insertBefore(contentTr[0], element[0]);
					}

					lastDivideKey = divideKey;
				}

				$timeout(doDivide, 0)
			}
		}
	})
	.directive('nextButton', [function () {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				title: '@title'
			},
			template: '<button class="button back-button button-clear icon-right">{{title}} <i class="icon"></i></button>',

			compile: function (element, attrs) {
				var icon = ionic.Platform.isIOS() ? 'ion-ios-arrow-forward' : 'ion-android-arrow-forward';
				angular.element(element[0]).children().addClass(icon);
			}
		};
	}])
	.directive('tabs', [function () {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				tabs: '=tabs',
				currentTab: "=currentTab"
			},
			templateUrl: 'views/utils/tabs.html',
			controller: function ($scope, $ionicScrollDelegate) {
				$scope.onClickTab = function (index) {
					$scope.currentTab = $scope.tabs[index];
					$ionicScrollDelegate.$getByHandle('mainScroll').scrollTop(true);
				};

				$scope.isActiveTab = function (title) {
					return $scope.currentTab.title == title;
				}
			}

		};
	}])
	.directive('elastic', [
		'$timeout',
		function ($timeout) {
			return {
				restrict: 'A',
				link: function ($scope, element) {
					$scope.initialHeight = $scope.initialHeight || element[0].style.height;
					var resize = function () {
						element[0].style.height = $scope.initialHeight;
						element[0].style.height = "" + element[0].scrollHeight + "px";
					};
					element.on("input change", resize);
					$timeout(resize, 0);
				}
			};
		}
	]).directive('noResults', function() {
	return {
		scope: {
			message: '@message'
		},
		template: '<p class="sidebar-result-message text-center"><i class="icon ion-sad-outline"></i> <br>{{message}}</p>'
	};
});