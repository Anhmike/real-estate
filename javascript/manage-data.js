(function (){

	$.getJSON('data/eure.json', function( data ) {
		var shapes = [];

		$.each(data, function( key, val ) {
			shapes.push(val);
		});

		var buildings = _.where(shapes, {'building': true}).map(realestate.createBuilding);
		var naturals = _.where(shapes, 'natural').map(realestate.createNatural);
		var amenities = _.where(shapes, 'amenity').map(realestate.createAmenity);
		var roads = _.where(shapes, 'highway').map(realestate.createRoad);
		var shop = _.where(shapes, 'shop').map(realestate.createBuilding);


		$('#my_map').append('<svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="600" width="800"> </svg>');

		var path = d3.select('svg').selectAll('path');


		var drawElements = function ( table, color ) {
			if(table === roads) {
				path.data(table).enter()
				.append('path')
				.attr('d', function(d) { return d.toSvgPath();} )
				.attr('fill', 'none')
				.attr('stroke', color)
				.attr('stroke-linejoin', 'round')
				.attr('stroke-width', '3')
				.on('mouseover', over)
				.on('mouseout', out);
			}
			else {
				path.data(table).enter()
				.append('path')
				.attr('d', function(d) { return d.toSvgPath();} )
				.attr('fill', color)
				.attr('stroke', 'white')
				.on('click', clicked)
				.on('mouseover', over)
				.on('mouseout', out);
			}
			
		}

		var over = function( d ) {
			$('.infos').remove();
			var infos = $('<div class="infos"></div>');
			var text = d.name || d._id;
			$(infos).append(text);
			$('body').append(infos);
			$(infos).css('top', event.clientY);
			$(infos).css('left', event.clientX);

			$('.infos').on('click', function( event ) {
				$('.infos').remove();
			});
		}

		var out = function( d ) {
			$('.infos').remove();
		}

		var clicked = function( d ) {
			window.location = '/advert/id/'+d._id;
		}

		drawElements(buildings, '#64FE2E');
		drawElements(shop, '#FF4000');
		drawElements(naturals, '#58ACFA');
		drawElements(amenities, '#F781F3');
		drawElements(roads, '#848484');
	});

})();