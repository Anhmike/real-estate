(function(global) {

	if( typeof window !== 'undefined' && global === window ){
		window.realestate = {};
		global = window.realestate;
	}

	global.createShape = function( attributes ) {
		attributes = attributes || {};
		attributes.nodes = attributes.nodes || [];
		var shape = {};
		shape._id = attributes._id || 'undefined';


		shape.toSvgPath = function() {
			var size = attributes.nodes.length;
			var path = ' M ' + _.map(attributes.nodes, function(val){
					return val.x+' '+val.y
				}).join(' L');
			
			/*if( attributes.nodes[0].x !== attributes.nodes[size - 1].x && attributes.nodes[0].y !== attributes.nodes[size - 1].y ) {
				path += ' L ' + attributes.nodes[0].x +' '+attributes.nodes[0].y;
			}*/
			return path;
		}

		shape.toString = function() {
			var response = '_id : '+ attributes._id + ', name: ' + attributes.name + '\n',
				i;
			
			for( i = 0; i < attributes.nodes.length; i++ ) {
				response += attributes.nodes[i] + '\n';
			}
			return response;
			
		}

		return shape;

	}


	global.createBuilding = function( attributes ) {
		attributes = attributes || {};
		var building = global.createShape(attributes);
		var superToString = building.toString;

		(function() {
			var i, area = 0., size = attributes.nodes.length;
			if( size > 2 ) {
				for(i = 0; i < size - 1; i++) {
					area += ( attributes.nodes[i].x * attributes.nodes[i+1].y ) - ( attributes.nodes[i + 1].x * attributes.nodes[i].y);
				}
			}
			building.area = Math.abs(area / 2.);
		})();

		building.toString = function () {
			return '[ '+ superToString.apply(building) +', area : '+ building.area +' ]';
		}

		return building;
	}

	global.createRoad = function( attributes ) {
		attributes = attributes || {};
		var road = global.createShape(attributes);
		road.name = attributes.name || '';
		var superToString = road.toString;

		road.toString = function() {
			return '['+ superToString.apply(road) + ', class : '+ attributes.class +']';
		}

		return road;
	}

	global.createAmenity = function( attributes ) {
		attributes = attributes || {};
		var amenity = global.createShape(attributes);
		var superToString = amenity.toString;

		amenity.toString = function() {
			return '['+ superToString.apply(amenity) +', type: '+ attributes.type +']';
		}

		return amenity;
	}


	global.createNatural = function( attributes ) {
		attributes = attributes || {};
		var natural = global.createShape(attributes);
		var superToString = natural.toString;

		natural.toString = function() {
			return '['+ superToString.apply(natural) +', type: '+ attributes.type +']';
		}

		return natural;
	}


})(this);