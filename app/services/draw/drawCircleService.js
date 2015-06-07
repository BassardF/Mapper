angular.module('drawCircleModule', ['constantsModule'])

.service('drawCircleService', function(constants) {

	var bundle;
	
	this.draw = function(elt, map, node, depth){
		bundle = {
			map : map,
			node : node,
			width : elt.offsetWidth,
			height : elt.offsetHeight
		}
		bundle.center = {
			x : bundle.width / 2,
			y : bundle.height / 2
		}
		bundle.paper = Raphael(elt, bundle.width, bundle.height);
		drawMainNode();
	};

	function drawMainNode(){
		console.log(bundle);
		bundle.paper.circle(bundle.center.x, bundle.center.y, constants.CIRCLE_DRAW.radius);
	}

});