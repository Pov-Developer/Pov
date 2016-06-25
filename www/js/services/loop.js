var App = angular.module('loop.services.loop', []);

App.service('Loop', function () {
	var self = {
		privateLoops: [
			{
				"name": "Chem 101",
				"description": "Loop for all students in CH 101 Section",
				"img": "img/chem.jpg",
				"numberOfMembers": 47
			},
			{
				"name": "Friends from work",
				"description": "All of my friends",
				"img": "img/work.jpg",
				"numberOfMembers": 1
			},
			{
				"name": "Football crew",
				"description": "Place to record your attendance for Tu/Th football",
				"img": "img/blueOnWhiteLogo.png",
				"numberOfMembers": 12
			}
		],
		publicLoops: [
			{
				"name": "Chem 101",
				"description": "Loop for all students in CH 101 Section",
				"img": "img/chem.jpg",
				"numberOfMembers": 47
			},
			{
				"name": "Friends from work",
				"description": "All of my friends",
				"img": "img/work.jpg",
				"numberOfMembers": 1
			},
			{
				"name": "McDonalds",
				"description": "We are the official McDonalds handle, subscribe to receive surveys and you can win free food",
				"img": "img/mcdonalds.jpg",
				"numberOfMembers": 1203
			}
		]
	}

	return self;
});