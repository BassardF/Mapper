app.controller('MapperController', function ($scope, mapService, drawCircleService) {
	
	init();
	
	function init(){
		$scope.maps = mapService.getMaps();
	}
	
	/* watch */
	
	$scope.$on('maps', function(event, maps){
		$scope.maps = maps;
	});
	
	/* Map section */

	$scope.selectMap = function(map){
		$scope.map = map;
	};
	
	$scope.addMap = function(name){
		$scope.newMapName = null;
		mapService.addMap(name);
		$scope.showNewMapBlock = false;
	};

	$scope.deleteMap = function(map){
		mapService.deleteMap(map.name);
		$scope.map = null;
	};

	/* Node section */

	$scope.selectNode = function(node){
		$scope.node = node;
		var el = document.getElementById('map');
		drawCircleService.draw(el, $scope.map, node, 3);
	};

	$scope.newNode = function(name, text){
		$scope.newNodeName = null;
		$scope.newNodeText = null;
		mapService.addNode($scope.map.name, $scope.node ? $scope.node.id : null , name, text);
	};

	$scope.isAncesterNode = function(givenNode, ancestor){
		return givenNode && ancestor ? mapService.isAncesterNode($scope.map.name, givenNode, ancestor) : false;
	};

	$scope.isLineageSibling = function(givenNode, sibling){
		return givenNode && sibling ? mapService.isLineageSibling($scope.map.name, givenNode, sibling) : false;
	}

	$scope.addAction = function(name){
		$scope.action = $scope.action === name ? null : name;
	}
	
	
});