angular.module('drawCircleModule', ['constantsModule', 'mapServiceModule'])

.service('drawCircleService', function(constants, mapService) {

	var bundle;
	var root;
	var flatNodes;
	
	this.draw = function(elt, map, node, depth){
		flatNodes = [];
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
		root = manageNode(undefined, bundle.center.x, bundle.center.y, constants.CIRCLE_DRAW.radius, bundle.node, 0);
		adjustNodePlacement();
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
		flatNodes.push({
			model : node,
			circle : slice.circle
		});
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

	function adjustNodePlacement(){
		do {
			var sorted = true;
			flatNodes.forEach(function(n1){
				flatNodes.forEach(function(n2){
					var bbox1 = n1.circle[0].getBBox();
					var bbox2 = n2.circle[0].getBBox();
					if(!(bbox1.x > bbox2.x2 || bbox1.x2 < bbox2.x || bbox1.y > bbox2.y2 || bbox1.y2 < bbox2.y) && n1.model.id !== n2.model.id){
						solveNodesOverlap(n1.model.id, n2.model.id);
						sorted = false;
					}
				});
			});
			sorted = true;
		} while (!sorted);
	}

	function solveNodesOverlap(id1, id2){
		var tn1 = getTreeNode(root, id1),
			tn2 = getTreeNode(root, id2),
			p1 = tn1, p2 = tn2, denominator;
		while(p1 && !denominator){
			p2 = tn2;
			while(p2 && !denominator){
				if(p1.parent && p2.parent && p1.parent.model.id === p2.parent.model.id){
					denominator = p2;
				}
				p2 = p2.parent;
			}
			p1 = p1.parent;
		}
		shiftBlockFromParent(denominator);
	}

	function shiftBlockFromParent(node){
		node.parent.children.forEach(function(childBundle){
			if(childBundle.node.model.id === node.model.id){
				var path = childBundle.line.attr('path'),
					dx = path[1][1] - path[0][1],
					dy = path[1][2] - path[0][2],
					a = dy / dx,
					dx2, dy2;
				if(dy == 0){
					dy2	= 0;
					dx2 = dx > 0 ? constants.CIRCLE_DRAW.radius : - constants.CIRCLE_DRAW.radius;
				} else if (dx == 0){
					dy2	= dy > 0 ? constants.CIRCLE_DRAW.radius : - constants.CIRCLE_DRAW.radius;
					dx2 = 0;
				} else {
					dy2 = Math.sqrt((a*a*constants.CIRCLE_DRAW.radius*constants.CIRCLE_DRAW.radius) / (1 + a * a));
					if(dy < 0){
						dy2 = -dy2;
					}
					dx2 = Math.sqrt(constants.CIRCLE_DRAW.radius*constants.CIRCLE_DRAW.radius - dy2*dy2);
					if(dx < 0){
						dx2 = -dx2;
					}
				}
				childBundle.line.attr('path', "M" + path[0][1] + "," + path[0][2] + " L" + (path[1][1] + dx2) + "," + (path[1][2] + dy2));
				shiftDescendants(node, dx2, dy2);
			}
		});
	}

	function shiftDescendants(node, x, y){
		node.circle.translate(x, y);
		node.children.forEach(function(childBundle){
			childBundle.line.translate(x, y);
			shiftDescendants(childBundle.node, x, y)
		});
	}

	function getTreeNode(node, id){
		if(node.model.id === id){
			return node;
		} else {
			var result = null;
			for(var i = 0; result == null && i < node.children.length; i++){
				result = getTreeNode(node.children[i].node, id);
			}
			return result;
		}
		return null;
	}

});