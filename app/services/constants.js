angular.module('constantsModule', [])

	.service('constants', function($cookieStore) {

		this.CIRCLE_DRAW = {
			radius : 50
		}

		this.COLORS = {
			darkGrey : '#2B3A42',
			midGrey : '#3F5765',
			lightGrey : '#BDD4DE',
			nearWhite : '#EFEFEF',
			orange : '#FF530D'
		}

    })
;