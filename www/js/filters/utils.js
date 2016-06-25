angular.module('loop.filters.utils', [])
	.filter('capitalize', function () {
		return function (input) {
			return input.charAt(0).toUpperCase() + input.slice(1, input.length);
		};
	})

	.filter('splitCamelCase', function () {
		return function (input) {
			// insert a space before all caps
			var res = input.replace(/([A-Z])/g, ' $1');
			// uppercase the first character
			return res.replace(/^./, function(str){ return str.toUpperCase(); });
		};
	})