angular.module('loop.directives.loop', [])

	.directive('loopList', [function () {
		return {
			restrict: 'E',
			templateUrl: "views/loops/loopList.html",
			scope: {
				loops: "="
			}
		}
	}])