// MapBox Token loaded here
mapboxgl.accessToken = mbkey;

//var bounds = [
    // [150.610895, 40], // Southwest coordinates
    // [-50, 85]  // Northeast coordinates
    // ];

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
    // var year = 1;
    // var scenario = 1;            
    var filterYear = ['==', ['number', ['get', 'Yr']], 1];
    var filterScenario = ['==', ['number', ['get', 'Sc']], 1];

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
        'filter': ['all', filterYear, filterScenario]
    }, 'PROV-SM-LABELS');

    document.getElementById('slider').addEventListener('input', function(e) {
        year = parseInt(e.target.value);
        // update the map
        map.setFilter('Country', ['==', ['number', ['get', 'Yr']], year]);
        // update text in the UI
        document.getElementById('active-year').innerText = year + 'word';
    });

    document.getElementById('buttons').addEventListener('input', function(f) {
        scenario = parseInt(f.target.value);
        map.setFilter('Country', ['==', ['number', ['get', 'Sc']], scenario]);
    });

    var clickPopup = new mapboxgl.Popup({
    closeButton: true,
    closeOnClick: true
    });

    // Clicking on the Country layer drawn from Mapbox Tileset creates these events
    map.on('click', 'Country', function (g) {


        // Starts an array of the Provinces' attributes drawn from json, filters all the objects for matching object
        // filters by scenario, set by user
        // filters by year, set by user
        // filters by Feature type, must be a province (or territory).
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

            // When a click event occurs on a feature in the states layer, open a popup at the
            // location of the click, with description HTML from its properties.
            clickPopup.setLngLat(g.lngLat)
                .setHTML (g.features[0].properties.NAME + '<canvas id="pie-chart-can" width="500" height="500"></canvas>')
                .addTo(map);
                chartMaker1();

    });


    document.getElementById('slider').addEventListener('input', function(e) {
        year = parseInt(e.target.value);
        // update the map
        filterYear = ['==', ['number', ['get', 'Yr']], year];
        map.setFilter('Country', ['==', ['number', ['get', 'Yr']], year]);
        // update text in the UI
        document.getElementById('active-year').innerText = year + 'word';
        if (clickPopup == null){

        } else {
        clickPopup.remove();
        };
    });


    document.getElementById('buttons').addEventListener('change', function(f) {
        scenario = parseInt(f.target.value);
        if (scenario == 1){
            filterScenario = ['==',['number', ['get', 'Sc']],true];
        } else if (scenario == 2) {
            filterScenario = ['==',['number', ['get', 'Sc']], true];
        } else if (scenario == 3){
            filterScenario = ['==',['number', ['get', 'Sc']], true];
        }
        else {
            console.log('Error')
        }
        filterScenario = ['==', ['number', ['get', 'Sc']], scenario];
        map.setFilter('Country', ['==', ['number', ['get', 'Sc']], scenario]);
        if (clickPopup == null){

        } else {
        clickPopup.remove();
        };
    });


    // Change the cursor to a pointer when the mouse is over the states layer.
    map.on('mouseenter', 'Country', function () {
        map.getCanvas().style.cursor = 'pointer';
    });
    
    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'Country', function () {
        map.getCanvas().style.cursor = '';
    });
// country end
// country end
// country end

    // Adding Provinces layer from tileset
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
        // Filters the visibile polygons by the year and scenario drawn from the attributes of the tileset
        'filter': ['all', filterYear, filterScenario]
    }, 'PROVINCE CAPITALS'
    );

    // document.getElementById('slider').addEventListener('input', function(e) {
    //     year = parseInt(e.target.value);
    //     // update the map
    //     map.setFilter('Provinces', ['==', ['number', ['get', 'Yr']], year]);
    //     // update text in the UI
    //     document.getElementById('active-year').innerText = year + 'word';
    // });

    // document.getElementById('buttons').addEventListener('input', function(f) {
    //     scenario = parseInt(f.target.value);
    //     map.setFilter('Provinces', ['==', ['number', ['get', 'Sc']], scenario]);
    // });



//     document.getElementById('slider').addEventListener('input', function(e) {
//         year = parseInt(e.target.value);
// // update the map
//         filterYear = ['==', ['number', ['get', 'Yr']], year];
//         map.setFilter('Provinces', ['==', ['number', ['get', 'Yr']], year]);
// // update text in the UI
//         document.getElementById('active-year').innerText = year + 'word';
//         if (clickPopup == null){

//         } else {
//         clickPopup.remove();
//         };
//     });

//     document.getElementById('buttons').addEventListener('change', function(f) {
//         scenario = parseInt(f.target.value);
//         if (scenario == 1){
//             filterScenario = ['==',['number', ['get', 'Sc']], true, false];
//         } else if (scenario == 2) {
//             filterScenario = ['==',['number', ['get', 'Sc']], true,false];
//         } else if (scenario == 3){
//             filterScenario = ['==',['number', ['get', 'Sc']], true,false];
//         }
//         else {
//             console.log('Error')
//         }
//         filterScenario = ['==', ['number', ['get', 'Sc']], scenario];
//         map.setFilter('Provinces', ['==', ['number', ['get', 'Sc']], scenario]);
//         if (clickPopup == null){

//         } else {
//         clickPopup.remove();
//         };
//     });

    var clickPopup = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: true
    });

    // Clicking on the Province layer drawn from Mapbox Tileset creates these events
    map.on('click', 'Provinces', function (e) {
        // Get Province's name and GDP from geojson clicked feature
        var ProName = e.features[0].properties.NAME;
        var ProGDP = e.features[0].properties.GDP;

    // Starts an array of the Canada's attributes drawn from json, filters all the objects for matching object
    // filters by scenario, set by user
    // filters by year, set by user
    // filters by Feature type, must be a Country.
    var CountryArray = allinfo.filter(function (Coun) {
        return Coun.Sc == scenario &&
        Coun.Yr == year &&
        Coun.Type === 'Country'
    });
    
    // Master check of information drawn from json file
    // console.log(newArray[0].NAME, newArray[1].NAME)

    // Creates an array of just Canada's name and GDP, stops when all criteria is met
    var NameArr =[];
    var GDPArr = [];
    for (i = 0; i < CountryArray.length; i++){
        NameArr[i] = CountryArray[i].NAME;
        GDPArr[i] = CountryArray[i].GDP;
    };

    // creates a variable that holds Canada's GDP subtracting the Provinces GDP 
    // to illustrate how much of Canada's total GDP the province selected contributes to
    var ModGDP = GDPArr[0] - ProGDP;

    // Master check of Canada array and province GDP array drawn from json.
    console.log(NameArr);
    console.log(GDPArr);
    console.log(ProName);
    console.log(ModGDP);

    // Begin to make the doughnut chart from chart.js library
    var chartMaker2 = function (e) {
        new Chart(document.getElementById("pie-chart-pro"), {
            type: 'doughnut',
            data: {
                labels: [NameArr[0], ProName],
                datasets: [
                {
                    backgroundColor: ["#45923B","#BECD2B"],
                    data: [ModGDP, ProGDP]
                }
                ]
            },
            options: {
                title: {
                    display: true,
                    text: 'GDP'
                }
            }
        });
    };

        // When a click event occurs on a feature in the states layer, open a popup at the
        // location of the click, with description HTML from its properties.
        clickPopup.setLngLat(e.lngLat)
            .setHTML (e.features[0].properties.NAME + '<canvas id="pie-chart-pro" width="500" height="500"></canvas>')
            .addTo(map);
            chartMaker2();
    });

    document.getElementById('slider').addEventListener('input', function(e) {
        var year = parseInt(e.target.value);
        // update the map
        filterYear = ['==', ['number', ['get', 'Yr']], year];
        map.setFilter('Provinces', ['all', filterYear, filterScenario]);
        // update text in the UI
        document.getElementById('active-year').innerText = year + 'word';
        if (clickPopup == null){

        } else {
        clickPopup.remove();
        };
    });


    document.getElementById('buttons').addEventListener('change', function(f) {
        var scenario = parseInt(f.target.value);
        // if (scenario == 1){
        //     filterScenario = ['==',['number', ['get', 'Sc']],1];
        // } else if (scenario == 2) {
        //     filterScenario = ['==',['number', ['get', 'Sc']], 2];
        // } else if (scenario == 3){
        //     filterScenario = ['==',['number', ['get', 'Sc']], 3];
        // }
        // else {
        //     console.log('Error')
        // }
        filterScenario = ['==', ['number', ['get', 'Sc']], scenario];
        map.setFilter('Provinces', ['all', filterYear, filterScenario]);
        if (clickPopup == null){

        } else {
        clickPopup.remove();
        };
    });







    // Change the cursor to a pointer when the mouse is over the states layer.
    map.on('mouseenter', 'Provinces', function () {
    map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'Provinces', function () {
    map.getCanvas().style.cursor = '';
    });
// end of provinces
//end of provinces
//end of provinces

    // Adding Cities layer from tileset
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
        // Filter visualization of polygon by zoomed layer visibility
        'filter': ['==', 'isCities', true],
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
                0, '#F2F12D',
                500000, '#EED322',
                750000, '#E6B71E',
                1000000, '#DA9C20',
                2500000, '#CA8323',
                5000000, '#B86B25',
                7500000, '#A25626',
                10000000, '#8B4225',
                25000000, '#723122'
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


    document.getElementById('slider').addEventListener('input', function(e) {
        var year = parseInt(e.target.value);
    // update the map
    map.setFilter('Cities', ['==', ['number', ['get', 'Yr']], year]);
    // update text in the UI
    document.getElementById('active-year').innerText = year + 'word';
    });

    document.getElementById('buttons').addEventListener('input', function(f) {

    var scenario = parseInt(f.target.value);
    map.setFilter('Cities', ['==', ['number', ['get', 'Sc']], scenario]);
    });

    // Create popup on when user clicks on map
    var clickPopup = new mapboxgl.Popup({
    closeButton: true,
    closeOnClick: true
    });

    // When a click event occurs on a feature in the states layer, open a popup at the
    // location of the click, with description HTML from its properties.
    map.on('click', 'Cities', function (e) {
        var ProvArray = allinfo.filter(function (Pro2){
            return Pro2.Sc ==  scenario &&
            Pro2.Yr == year &&
            Pro2.Type === 'Province' &&
            Pro2.NAME === e.features[0].properties.FeatureLoc
        });
        console.log(ProvArray);
        // map.on('click', 'InvisPro'), function (ee) {
        //     var InvProName = ee.features[0].property.NAME
        //     var InvProGDP = ee.properties[0].property.GDPtrue
        var ProName = []
        var ProGDP = []
        for (i = 0; i < ProvArray.length; i++){
            ProName[i] = ProvArray[i].NAME;
            ProGDP[i] = parseInt(ProvArray[i].GDP);
        };


    var CitNam = e.features[0].properties.NAME;
    var CitGDP = e.features[0].properties.GDP;
    var Mod1GDP = ProGDP[0] - CitGDP;
    var chartMaker3 = function () {
        new Chart(document.getElementById("pie-chart-cit"), {
            type: 'doughnut',
            data: {
                labels: [CitNam, ProName],
                datasets: [
                {
                    label: "Population (millions)",
                    backgroundColor: ["#3e95cd"],
                    data: [CitGDP,Mod1GDP]
                }
                ]
            },
            options: {
                title: {
                    display: true,
                    text: 'GDP'
                }
            }
        });
    };
        
        clickPopup.setLngLat(e.lngLat)
            .setHTML (e.features[0].properties.NAME + '<canvas id="pie-chart-cit" width="500" height="500"></canvas>')
            .addTo(map);
            chartMaker3();
        // };
    });

    // Change the cursor to a pointer when the mouse is over the Cities layer where you can click.
    map.on('mouseenter', 'Cities', function () {
    map.getCanvas().style.cursor = 'pointer';
    });

    // Change the cursor back to a pointer when it leaves cities layer.
    map.on('mouseleave', 'Cities', function () {
    map.getCanvas().style.cursor = '';
    });

    // REVIEW
    var countryLegendEl = document.getElementById('Country-legend');
    var provincesLegendEl = document.getElementById('Provinces-legend');
    map.on('zoom', function() {
        if (map.getZoom() > zoomThreshold1) {
            countryLegendEl.style.display = 'none';
            provincesLegendEl.style.display = 'block';
        } else {
            countryLegendEl.style.display = 'block';
            provincesLegendEl.style.display = 'none';
        }
    });
    
}); // do not remove again
// if there is no end to map load above this point..