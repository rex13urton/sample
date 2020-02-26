// MapBox Token loaded here
mapboxgl.accessToken = mbkey;
// Map is created, defined with loading parameters
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/rex13/cjwhx7qoa0ivy1dqxqho71m94',
    center: [ -98.357977,  60.093385 ],
    minZoom: 2.75,
    zoom: 2.75,
    pitch: 90,
    bearing: 0
   // maxBounds: bounds // Sets bounds as max
    });

// Zoom threshold is set 
var zoomThreshold1 = 3;
var zoomThreshold2 = 3.75;


// Load the map
map.on('load', function() {


    map.addSource('Province1', {
        'type': 'vector',
        'url': 'mapbox://rex13.3vv8pvaz'
    });
    map.addSource('Province2', {
        'type': 'vector',
        'url': 'mapbox://rex13.rex13.bus3odgy'
    });
    
    map.addLayer({
        // Defining the ID of the layer
        'id': 'Provinces1',
        // Linking to the map source, defined above in map.addSource
        'source': 'Province1',
        // Calling in the correct layer from the defined tileset
        'source-layer': 'pro11-1gaypl',
        // Setting the max zoom to zoom threshold

        //defining the effects to be applied to the polygons derived from tileset source
        'type': 'fill-extrusion',
        'paint': {
            // Defines the extruded polygons colour
            'fill-extrusion-color': [
                // Obtains data from attirbutes in tileset, creates smooth results between inputs
                'interpolate',
                // Obtains data from attirbutes in tileset, creates smooth results between inputs
                ['linear'],
                // Retrieving population from tileset attributes
                ['get', 'POP'],
                // Defining the intervals, assigns colour gradient to intervals
                0, '#F7D0D0',
                500000, '#F3B9B9',
                750000, '#EB8B8B',
                1000000, '#E35C5C',
                2500000, '#DB2E2E',
                5000000, '#D40000',
                7500000, '#AE0000',
                10000000, '#870000',
                25000000, '#610000'
            ],
            // Defines extruded polygon's opacity (transparency)    
            'fill-extrusion-opacity': 0.5,
            // Defines the extruded polygon's height, based off of the GDP control set in the attributes of the tileset
            'fill-extrusion-height': ['get', 'GDPcontrol'],
            // Defines the base of the extruded polygons, set to the top of the basemap
            'fill-extrusion-base': 0,
        },
        'filter': ['==',['number',['get','Yr']], 1]
    }, 'PROVINCE CAPITALS'
    );

    map.addLayer({
        // Defining the ID of the layer
        'id': 'Provinces2',
        // Linking to the map source, defined above in map.addSource
        'source': 'Province2',
        // Calling in the correct layer from the defined tileset
        'source-layer': 'pro35-8vnxai',
        // Setting the max zoom to zoom threshold

        //defining the effects to be applied to the polygons derived from tileset source
        'type': 'fill-extrusion',
        'paint': {
            // Defines the extruded polygons colour
            'fill-extrusion-color': [
                // Obtains data from attirbutes in tileset, creates smooth results between inputs
                'interpolate',
                // Obtains data from attirbutes in tileset, creates smooth results between inputs
                ['linear'],
                // Retrieving population from tileset attributes
                ['get', 'POP'],
                // Defining the intervals, assigns colour gradient to intervals
                0, '#F7D0D0',
                500000, '#F3B9B9',
                750000, '#EB8B8B',
                1000000, '#E35C5C',
                2500000, '#DB2E2E',
                5000000, '#D40000',
                7500000, '#AE0000',
                10000000, '#870000',
                25000000, '#610000'
            ],
            // Defines extruded polygon's opacity (transparency)    
            'fill-extrusion-opacity': 0.5,
            // Defines the extruded polygon's height, based off of the GDP control set in the attributes of the tileset
            'fill-extrusion-height': ['get', 'GDPcontrol'],
            // Defines the base of the extruded polygons, set to the top of the basemap
            'fill-extrusion-base': 0,
        },
        'filter': ['==',['number',['get','Yr']], 5]
    }, 'PROVINCE CAPITALS'
    );


    document.getElementById('slider').addEventListener('input', function(e) {
        var year = parseInt(e.target.value);
        map.setFilter('Provinces', ['==',['number',['get','Yr']], year]);
        document.getElementById('active-year').innerText = year + ' sup';
    });

}); // do not remove again
// if there is no end to map load above this point