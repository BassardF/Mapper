angular.module('drawCircleModule', ['constantsModule', 'mapServiceModule'])

.service('drawCircleService', function(constants, mapService) {

	var bundle;
	var root;
	
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
		root = manageNode(root, bundle.center.x, bundle.center.y, constants.CIRCLE_DRAW.radius, bundle.node, 0);
		console.log(root);
	};

	function manageNode(parent, x, y, radius, node, theta){
		// Master node
		var slice = {
			model : node,
			parent : parent,
			circle : bundle.paper.set(),
			children : []
		};
		drawNode(slice.circle, x, y, radius, node.name, node.text);
		// Children
		var children = mapService.getChildren(bundle.map.name, node),
			count = node.id === bundle.node.id ? children.length : children.length + 1,
			r = 3*radius,
			baseTheta = (Math.PI + theta) % (2*Math.PI);
		for (var i = 0; i < children.length; i++) {
			var innerTheta = (baseTheta + ((i+1) * 2*Math.PI/count)) % (2*Math.PI),
				x2 = x + r*Math.cos(innerTheta),
				y2 = y + r*Math.sin(innerTheta);
			slice.children.push({
				node : manageNode(slice, x2, y2, radius - 10, children[i], innerTheta),
				line : bundle.paper.path( "M" + x + "," + y + " L" + x2 + "," + y2).attr({"stroke" : constants.COLORS.midGrey}).toBack()
			});
		}
		return slice;
	}

	function drawNode(set, x, y, radius, name, text){
		set.push(bundle.paper.circle(x, y, radius).attr({'fill' : constants.COLORS.lightGrey, "stroke" : constants.COLORS.midGrey}));
		set.push(bundle.paper.text(x, y - 7, name).attr({'font-size' : '18', 'fill' : constants.COLORS.darkGrey}));
		set.push(bundle.paper.text(x, y + 10, text).attr({'fill' : constants.COLORS.darkGrey}));
	}

});