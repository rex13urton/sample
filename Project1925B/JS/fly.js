mapboxgl.accessToken = mbkey;
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/rex13/cjwhx7qoa0ivy1dqxqho71m94',
    center: [-98.357977,  60.093385],
    maxZoom: 16,
    minZoom: 1,
    zoom: 3.5
});

var year = 1;
    var scenario =1;
    var filterYear = ['==', ['number', ['get', 'Yr']], 1];
    var filterScenario = ['==', ['number', ['get', 'Sc']], 1];


var ProvinceArray = allinfo.filter(function (Provs) {
    return Provs.Sc == scenario &&
    Provs.Yr == year &&
    Provs.Type === 'Province'
});

// Master check of information drawn from json file
// console.log(ProvinceArray[0].NAME, ProvinceArray[1].NAME)

// Creates an array of just province names and GDP, stops when all provinces are included
var NameArr =[];
var GDPArr = [];
for (i = 0; i < ProvinceArray.length; i++){
    NameArr[i] = ProvinceArray[i].NAME;
    GDPArr[i] = parseInt(ProvinceArray[i].GDP);
};

// Master check of province name array and province GDP array drawn from json.
console.log(NameArr);
console.log(GDPArr);

// Begin to make the doughnut chart from chart.js library
var chartMaker1 = function (l) {
    new Chart(document.getElementById("pie-chart-can"), {
        type: 'doughnut',
        data: {
            labels: NameArr,
            datasets: [
            {
                backgroundColor: ["#D40000", "#54B247", "#008CCC","#BECD2B",
                                  "#AE0000","#45923B","#0073A7","#9CA824",
                                  "#BC2E2E","#73C068","#2EA0D5","#C9D6517",
                                  "#CCCCCC"],
                data: GDPArr
            }
            ]
        },
        options: {
            legend: { 
                display: false
            },
            title: {
                display: true,
                text: 'GDP'
            }
        }
    });
};







function rotateCamera(timestamp) {
// clamp the rotation between 0 -360 degrees
// Divide timestamp by 100 to slow rotation to ~10 degrees / sec
map.rotateTo((timestamp / 100) % 1000, {duration: 0});
// Request the next frame of the animation.
requestAnimationFrame(rotateCamera);
}
// rotateCamera(0);

var title = document.getElementById('location-title');
var description = document.getElementById('location-description');

var locations = [{
    "id": "2",
    "title": "Canada",
    "description": '<canvas id="pie-chart-can" width="500" height="500"></canvas>' + 
    
    "This is where hip-hop was born, where the Yankees became a dynasty and where you can find New York City's leading zoo and botanical garden.",
    "camera": {
        center: [-98.357977,  60.093385 ],
        zoom: 3,
        pitch: 50
    }
}, {
    "id": "3",
    "title": "Provinces",
    "description": "No matter how hip it looks on TV, NYC's most populous borough is best experienced in person. Read on to find out about live music, Prospect Park, Nets basketball and more.",
    "camera": {
        center: [-98.357977,  60.093385 ],
        bearing: -8.9,
        zoom: 3.5
    }
}, {
    "id": "1",
    "title": "Southern Ontario",
    "description": "Even if you think you know Manhattan—its world-class museums, fine dining and unforgettable views—the borough always has something new and exciting in store.",
    "camera": {
        center: [-79.26, 43.506],
        bearing: 25.3,
        zoom: 5
    }
}, {
    "id": "4",
    "title": "Queens",
    "description": "Taste food from around the globe, watch Mets baseball and US Open tennis, see cutting-edge art and more in one of the world's most diverse places.",
    "camera": {
        center: [-73.8432, 40.6923],
        bearing: 36,
        zoom: 2
    }
}, {
    "id": "5",
    "title": "Staten Island",
    "description": "Take a free ferry ride to an island getaway filled with historic architecture, stunning views, gardens and many family-friendly attractions.",
    "camera": {
        center: [-74.1991, 40.5441],
        bearing: 28.4,
        zoom: 3
    }
}, {
    "title": "Canada is doomed",
    "description": "rex was here",
    "camera": {
        center: [-98.357977,  60.093385 ],
        zoom: 9.68,
        bearing: 0,
        pitch: 0
    }
}];

function highlightBorough(code) {
    // Only show the polygon feature that cooresponds to `borocode` in the data
    map.setFilter('highlight', ["==", "borocode", code]);
}

function playback(index) {
    title.textContent = locations[index].title;
    description.textContent = locations[index].description;

    highlightBorough(locations[index].id ? locations[index].id : '');

    // Animate the map position based on camera properties
    map.flyTo(locations[index].camera);

    map.once('moveend', function() {
        // Duration the slide is on screen after interaction
        window.setTimeout(function() {
            // Increment index
            index = (index + 1 === locations.length) ? 0 : index + 1;
            playback(index);
        }, 3000); // After callback, show the location for 3 seconds.
    });
}

// Display the last title/description first
title.textContent = locations[locations.length - 1].title;
description.textContent = locations[locations.length - 1].description;
// Zoom threshold is set 
var zoomThreshold1 = 3.5;
var zoomThreshold2 = 4;

map.on('load', function() {



    map.addSource('CanCountry', {
        'type': 'vector',
        'url': 'mapbox://rex13.735gz6l4'
    });

    map.addSource('Province', {
        'type': 'vector',
        'url': 'mapbox://rex13.bqapiacs'
    });
    
    // Deining the map source, linking to tileset
    map.addSource('City', {
        'type': 'vector',
        'url': 'mapbox://rex13.9ja1pwne'
    });

    // Adding Country layer from tileset
    map.addLayer({
        // Defining the ID of the layer
        'id': 'Country',
        // Linking to the map source, defined above in map.addSource
        'source': 'CanCountry',
        // Calling in the correct layer from the defined tileset
        'source-layer': 'Canada',
        // Setting the max zoom to zoom threshold
        'maxzoom': zoomThreshold1,
        //defining the effects to be applied to the polygons derived from tileset source
        'type': 'fill-extrusion',
        // Applying the paint to the function to the visible polygons
        'paint': {
            // Defines the extruded polygons colour
            'fill-extrusion-color': [
                // Obtains data from attirbutes in tileset, creates smooth results between inputs
                'interpolate',
                // Interpolates between defined stops below, stops below and starts above defined intervals
                ['linear'],
                // Retrieving population from tileset attributes
                ['get', 'POP'],
                // Defining the intervals, assigns colour gradient to intervals
                18867000, '#F7D0D0',
                29017000, '#F3B9B9',
                39167000, '#EB8B8B',
                49317000, '#E35C5C',
                59467000, '#DB2E2E',
                69617000, '#D40000',
                79767000, '#AE0000',
                89917000, '#870000',
                100067000, '#610000'
                ],
            // Defines extruded polygon's opacity (transparency)    
            'fill-extrusion-opacity': 0.5,
            // Defines the extruded polygon's height, based off of the GDP control set in the attributes of the tileset
            'fill-extrusion-height': ['get', 'GDPcontrol'],
            // Defines the base of the extruded polygons, set to the top of the basemap
            'fill-extrusion-base': 0,
        },
        'filter': ['all', filterYear, filterScenario]
    }, 'PROV-SM-LABELS');


    // Start the playback animation for each borough
    map.addLayer({
        // Defining the ID of the layer
        'id': 'Provinces',
        // Linking to the map source, defined above in map.addSource
        'source': 'Province',
        // Calling in the correct layer from the defined tileset
        'source-layer': 'Provinces',
        // Setting the max zoom to zoom threshold
        'maxzoom': zoomThreshold2,
        'minzoom': zoomThreshold1,
        //defining the effects to be applied to the polygons derived from tileset source
        'type': 'fill-extrusion',
        // Filter visualization of polygon by zoomed layer visibility
        // 'filter': ['==', 'isProvinces', true],
        // Applying the paint to the function to the visible polygons
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
                19000, '#F7D0D0',
                50000, '#F3B9B9',
                100000, '#EB8B8B',
                500000, '#E35C5C',
                1000000, '#DB2E2E',
                5000000, '#D40000',
                10000000, '#AE0000',
                20000000, '#870000',
                39000000, '#610000'
            ],
            // Defines extruded polygon's opacity (transparency)    
            'fill-extrusion-opacity': 0.5,
            // Defines the extruded polygon's height, based off of the GDP control set in the attributes of the tileset
            'fill-extrusion-height': ['get', 'GDPcontrol'],
            // Defines the base of the extruded polygons, set to the top of the basemap
            'fill-extrusion-base': 0,
        },
        // Filters the visibile polygons by the year and scenario drawn from the attributes of the tileset
        'filter': ['all', filterYear, filterScenario]
    }, 'PROVINCE CAPITALS'
    );
    map.addLayer({

        // Defining the ID of the layer
        'id': 'Cities',
        // Linking to the map source, defined above in map.addSource
        'source': 'City',
        // Calling in the correct layer from the defined tileset
        'source-layer': 'Cities',
        // Setting the max zoom to zoom threshold
        'minzoom': zoomThreshold2,
        //defining the effects to be applied to the polygons derived from tileset source
        'type': 'fill-extrusion',
        // Applying the paint to the function to the visible polygons
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
                65000, '#F7D0D0',
                267675, '#F3B9B9',
                4703500, '#EB8B8B',
                6730250, '#E35C5C',
                8757000, '#DB2E2E',
                10783750, '#D40000',
                12810500, '#AE0000',
                14837250, '#870000',
                16864000, '#610000'
            ],
            // Defines extruded polygon's opacity (transparency)    
            'fill-extrusion-opacity': 0.5,
            // Defines the extruded polygon's height, based off of the GDP control set in the attributes of the tileset
            'fill-extrusion-height': ['get', 'GDPcontrol'],
            // Defines the base of the extruded polygons, set to the top of the basemap
            'fill-extrusion-base': 0,
        },
        // Filters the visibile polygons by the year and scenario drawn from the attributes of the tileset
        'filter': ['all', filterYear, filterScenario]
    }, 'OTHER CITIES'
    );

    playback(0);

});
