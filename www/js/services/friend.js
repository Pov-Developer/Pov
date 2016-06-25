var App = angular.module('loop.services.friend', []);

App.service('Friend', function () {
	var friends = [
		{
			firstName: "Shaun",
			img: "http://uifaces.com/faces/_twitter/ShaunMoynihan_120.jpg"
		},
		{
			firstName: "Tim",
			img: "http://uifaces.com/faces/_twitter/TimPietrusky_120.jpg"
		},
		{
			firstName: "Ben",
			img: "http://uifaces.com/faces/_twitter/benhowdle_120.jpg"
		},
		{
			firstName: "Jon",
			img: "http://uifaces.com/faces/_twitter/jonsuh_120.jpg"
		},
		{
			firstName: "Blake",
			img: "http://uifaces.com/faces/_twitter/blakesimkins_120.jpg"
		},
		{
			firstName: "Nick",
			img: "http://uifaces.com/faces/_twitter/nckjrvs_120.jpg"
		},
		{
			firstName: "Cameron",
			img: "http://uifaces.com/faces/_twitter/cameronmoll_120.jpg"
		},
		{
			firstName: "Timothy",
			img: "http://uifaces.com/faces/_twitter/timothycd_120.jpg"
		},
		{
			firstName: "Jay",
			img: "http://uifaces.com/faces/_twitter/jayrobinson_120.jpg"
		},
		{
			firstName: "Damen",
			img: "http://uifaces.com/faces/_twitter/damenleeturks_120.jpg"
		},
		{
			firstName: "Daniel",
			img: "http://uifaces.com/faces/_twitter/danielhaim_120.jpg"
		},
		{
			firstName: "Futon",
			img: "http://uifaces.com/faces/_twitter/motherfuton_120.jpg"
		},
		{
			firstName: "Kolage",
			img: "http://uifaces.com/faces/_twitter/kolage_120.jpg"
		},
		{
			firstName: "Alagoon",
			img: "http://uifaces.com/faces/_twitter/alagoon_120.jpg"
		},
		{
			firstName: "Rogie",
			img: "http://uifaces.com/faces/_twitter/rogie_120.jpg"
		},
		{
			firstName: "Daryl",
			img: "http://uifaces.com/faces/_twitter/daryl_120.jpg"
		},
	];

	var topFriends = [
		{
			firstName: "Tim",
			img: "http://uifaces.com/faces/_twitter/TimPietrusky_120.jpg"
		},
		{
			firstName: "Ben",
			img: "http://uifaces.com/faces/_twitter/benhowdle_120.jpg"
		},
		{
			firstName: "Jon",
			img: "http://uifaces.com/faces/_twitter/jonsuh_120.jpg"
		}
	];

	return {
		getFriends: function(){
			return friends;
		},
		getTopFriends: function(){
			return topFriends;
		}
	};
});