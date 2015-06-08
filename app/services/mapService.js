angular.module('mapServiceModule', ['storageServiceModule'])

.service('mapService', function($rootScope, storage) {

	var maps, id;
	
	function init(){
		if(!maps){
			fetch();
		}
		if(!maps){
			maps = [];
			save();
		}
		if(!id){
			setId();
		}
	}
	
	function fetch(){
		maps = storage.getObject('maps');
	}
	
	function save(){
		storage.saveObject('maps', maps);
		broadcast();
	}
	
	function broadcast(){
		$rootScope.$broadcast('maps', maps);
	}
	
	function setId(){
		id = 0;
		maps.forEach(function(map){
			map.nodes.forEach(function(node){
				id = Math.max(node.id, id);
			});
		});
		id++;
	}
	
	this.getMaps = function(){
		init();
		return maps;
	};
	
	this.addMap = function(name){
		init();
		var map = _.find(maps, {'name': name});
		if(!map && name){
			maps.push({
				name : name,
				nodes : []
			});
			save();
		}
	};
	
	this.deleteMap = function(name){
		init();
		_.remove(maps, function(map) {
			return map.name === name;
		});
		save();
	};
	
	this.addNode = function(mapName, parentId, name, text){
		init();
		var map = _.find(maps, {'name': mapName});

		var pid = parentId,
			depth = 1,
			position = 0;
		while(pid){
			map.nodes.forEach(function(node, index){
				position = node.id === parentId ? index : position;	
				if(node.id === pid){
					depth++;
					pid = node.parent;
				}
			});
		}

		map.nodes.splice(position + 1, 0, {
			id : id,
			parent : parentId ? parentId : null,
			name : name,
			text : text,
			depth: depth
		});

		id++;
		save();
	};
	
	this.deleteNode = function(mapName, id){
		init();
		var map = _.find(maps, {'name': mapName});
		_.remove(map, function(node) {
			return node.id === id;
		});
		save();
	};

	this.getChildren = function(mapName, node){
		init();
		var children = [];
		var map = _.find(maps, {'name': mapName});
		map.nodes.forEach(function(node_){
			if(node_.parent == node.id){
				children.push(node_);
			}
		});
		return children;
	};

	this.isAncesterNode = function(mapName, givenNode, ancestor){
		init();
		var map = _.find(maps, {'name': mapName}),
			pid = givenNode.parent,
			found = false;
		while(pid){
			map.nodes.forEach(function(node){
				if(node.id === pid){
					if(pid == ancestor.id){
						found = true;
					}
					pid = node.parent;
				}
			});
		}
		return found;
	};

	this.isLineageSibling = function(mapName, givenNode, sibling){
		init();
		var map = _.find(maps, {'name': mapName}),
			pid = givenNode.parent,
			found = false;
		while(pid){
			var node = _.find(map.nodes, {'id': pid});
			found = found || node.id == sibling.parent;
			pid = node.parent;
		}
		return found;
	};

});