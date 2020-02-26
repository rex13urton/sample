// MapBox Token loaded here
mapboxgl.accessToken = mbkey;

// Sets the written year value to apear in the slider upon interaction
var WrittenYear =1;
//Creating a function to determine written year
var SliderYear = function(year){
    var year1 = year
    if (year1 == 1) { 
        WrittenYear = 2016;
    } else if (year1 == 2) {
        WrittenYear = 2025;
    } else if (year1 == 3){
        WrittenYear = 2050;
    } else if (year1 == 4) {
        WrittenYear = 2075;
    } else{
        WrittenYear = 2100;
    };
    return WrittenYear;
};

// Sets the boundary of the map to prevent srolling past study area
var bounds = [
    [-170,41], // Southwest coordinates
    [-30, 90]  // Northeast coordinates
    ];

// Map is created, defined with loaded parameters
var map = new mapboxgl.Map({
    //Map container named 'map'
    container: 'map',
    //Custom style imported from Mapbox Studio customized basemap
    style: 'mapbox://styles/rex13/cjwhx7qoa0ivy1dqxqho71m94',
    //Sets the map to appear at the approximate center of Canada
    center: [ -98.357977,  60.093385 ],
    //Sets zoom, pitch, bearing and implements the bounding frame
    minZoom: 1,
    zoom: 1,
    pitch: 90,
    bearing: 0,
    maxBounds: bounds // Sets bounds as max
    });

// Zoom threshold is set to be called later
var zoomThreshold1 = 3.5;
var zoomThreshold2 = 4;

// Load the map
map.on('load', function() {
    //Sets the initial year to baseyear 2016
    var year = 1;
    //Sets the initial scenario to baseyear 2016
    var scenario =1;
    //Assigns the filter[VARIABLE] expression used to set filters
    var filterYear = ['==', ['number', ['get', 'Yr']], 1];
    var filterScenario = ['==', ['number', ['get', 'Sc']], 1];
    //Adds Canada source from Mapbox Studio custom Tileset
    map.addSource('CanCountry', {
        'type': 'vector',
        'url': 'mapbox://rex13.735gz6l4'
    });
    //Adds Provinces source from Mapbox Studio custom Tileset
    map.addSource('Province', {
        'type': 'vector',
        'url': 'mapbox://rex13.bqapiacs'
    });
    //Adds City source from Mapbox Studio custom Tileset
    map.addSource('City', {
        'type': 'vector',
        'url': 'mapbox://rex13.9ja1pwne'
    });

    // Adding Country layer from Tileset
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
        //Feature filtered to reflect the filter[VARIABLE] defined above on load, or by user upon interaction
        'filter': ['all', filterYear, filterScenario]
        //Sets what labels are visible above the represented features
    }, 'PROV-SM-LABELS');

    //Creates listener event for the slider (year) in HTML doc
    document.getElementById('slider').addEventListener('input', function(e) {
        //Obtains year value as an integer
        year = parseInt(e.target.value);
        //Updates the filtered year based on obtained year value
        filterYear = ['==', ['number', ['get', 'Yr']], year];
        //Sets the filter in accordance with the layer loaded above
        map.setFilter('Country', ['all', filterYear, filterScenario]);
        // update text in the UI
        SliderYear(year);
        //Master check of written year
        // console.log(WrittenYear);
        //Relays written year to HTML for UI
        document.getElementById('active-year').innerText = WrittenYear;
        //removes popup on interaction
        if (clickPopup == null){
        } else {
        clickPopup.remove();
        };
    });

    //Creates change event for buttons (scenarios) in HTML doc
    document.getElementById('buttons').addEventListener('change', function(f) {
        //Obtains scenario value as integer
        scenario = parseInt(f.target.value);
        //Updates the filtered scenario based on obtained scenario value
        filterScenario = ['==', ['number', ['get', 'Sc']], scenario];
        //Sets filter in accordance with the layer loaded above
        map.setFilter('Country', ['all', filterYear, filterScenario]);
        //Removes popup on interaction
        if (clickPopup == null){
        } else {
        clickPopup.remove();
        };
    });

    //Creates popup on click, closes on click
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
            //Ensures GDP is an integer for graph representation
            GDPArr[i] = parseInt(ProvinceArray[i].GDP);
        };

        // Master check of province name array and province GDP array drawn from json.
        // console.log(NameArr);
        // console.log(GDPArr);

        // Begin to make the doughnut chart from chart.js library
        var chartMaker1 = function (l) {
            new Chart(document.getElementById("pie-chart-can"), {
                type: 'doughnut',
                data: {
                    labels: NameArr,
                    datasets: [
                    {
                        backgroundColor: ["#A4036F", "#048BA8", "#16DB93","#3A3042",
                                          "#DB9D47","#FF784F","#19381F","#4B3B47",
                                          "#9BC4CB","#E5446D","#45923B","#E2C044",
                                          "#3A0842"],
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
                .setHTML ('<p>'+ g.features[0].properties.NAME + "'s estimated population: " 
                + '<b>'+ g.features[0].properties.POP + '</b>' + '<br>' +  " with an estimated GDP of: <b> $" 
                + g.features[0].properties.GDP_Tril.toFixed(3) + '</b>' + ' trillion under the ' 
                + g.features[0].properties.Scenario  + ' scenario in year ' + g.features[0].properties.Year + '. </p>' +
                '<canvas id="pie-chart-can" width="500" height="500"></canvas>')
                .addTo(map);
                chartMaker1();

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
        //Feature filtered to reflect the filter[VARIABLE] defined above on load, or by user upon interaction
        'filter': ['all', filterYear, filterScenario]
        //Sets what labels are visible above the represented features
    }, 'PROVINCE CAPITALS'
    );

        //Creates listener event for the slider (year) in HTML doc
    document.getElementById('slider').addEventListener('input', function(e) {
        //Obtains year value as an intege
        var year = parseInt(e.target.value);
        //Updates the filtered year based on obtained year value
        filterYear = ['==', ['number', ['get', 'Yr']], year];
        //Sets the filter in accordance with the layer loaded above
        map.setFilter('Provinces', ['all', filterYear, filterScenario]);
        // update text in the UI
        SliderYear(year);
        //Master check of written year
        // console.log(WrittenYear);
        //Relays written year to HTML for UI
        document.getElementById('active-year').innerText = WrittenYear;
        //removes popup on interaction
        if (clickPopup == null){
        } else {
        clickPopup.remove();
        };
    });

        //Creates change event for buttons (scenarios) in HTML doc
    document.getElementById('buttons').addEventListener('change', function(f) {
        //Obtains scenario value as integer
        var scenario = parseInt(f.target.value);
        //Updates the filtered scenario based on obtained scenario value
        filterScenario = ['==', ['number', ['get', 'Sc']], scenario];
        //Sets filter in accordance with the layer loaded above
        map.setFilter('Provinces', ['all', filterYear, filterScenario]);
        //Removes popup on interaction
        if (clickPopup == null){
        } else {
        clickPopup.remove();
        };
    });

    //Creates popup on click, closes on click
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
    // console.log(CountryArray);
    // console.log(NameArr);
    // console.log(GDPArr);
    // console.log(ProName);
    // console.log(ModGDP);

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
            .setHTML ('<p>'+ e.features[0].properties.NAME +"'s estimated population: " 
            + '<b>'+ e.features[0].properties.POP + '</b>' + '<br>' + " with an estimated GDP of: <b>$" 
            + e.features[0].properties.GDP_Bil.toFixed(1) + '</b>' + ' billion under the ' 
            + e.features[0].properties.Scenario  + ' scenario in year ' + e.features[0].properties.Year + '. </p>' + 
            +'<canvas id="pie-chart-pro" width="500" height="500"></canvas>')
            .addTo(map);
            chartMaker2();
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

    document.getElementById('slider').addEventListener('input', function(e) {
        var year = parseInt(e.target.value);
        // update the map
        filterYear = ['==', ['number', ['get', 'Yr']], year];
        map.setFilter('Cities', ['all', filterYear, filterScenario]);
        // update text in the UI
        SliderYear(year);
        // console.log(WrittenYear);
        document.getElementById('active-year').innerText = WrittenYear;
        if (clickPopup == null){
        } else {
        clickPopup.remove();
        };
    });


    document.getElementById('buttons').addEventListener('change', function(f) {
        var scenario = parseInt(f.target.value);
        filterScenario = ['==', ['number', ['get', 'Sc']], scenario];
        map.setFilter('Cities', ['all', filterYear, filterScenario]);
        if (clickPopup == null){
        } else {
        clickPopup.remove();
        };
    });

    // Create popup on when user clicks on map
    var clickPopup = new mapboxgl.Popup({
    closeButton: true,
    closeOnClick: true
    });

    // When a click event occurs on a feature in the states layer, open a popup at the
    // location of the click, with description HTML from its properties.
    map.on('click', 'Cities', function (e) {
        var CitNam = e.features[0].properties.NAME;
        var CitGDP = e.features[0].properties.GDP;

        var ProvArray = allinfo.filter(function (Pro2){
            return Pro2.Sc ==  scenario &&
            Pro2.Yr == year &&
            Pro2.Type === 'Province' &&
            Pro2.NAME === e.features[0].properties.FeatureLoc
        });
        console.log(ProvArray);

        var ProName = []
        var ProGDP = []
        for (i = 0; i < ProvArray.length; i++){
            ProName[i] = ProvArray[i].NAME;
            ProGDP[i] = parseInt(ProvArray[i].GDP);
        };



    var Mod1GDP = ProGDP[0] - CitGDP;
    var chartMaker3 = function () {
        new Chart(document.getElementById("pie-chart-cit"), {
            type: 'doughnut',
            data: {
                labels: [ProName, CitNam],
                datasets: [
                {
                    label: "Population (millions)",
                    backgroundColor: ["#45923B","#BECD2B"],
                    data: [Mod1GDP, CitGDP]
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
            .setHTML (e.features[0].properties.NAME + "'s estimated population will be " 
            + e.features[0].properties.POP + " and has an estimated GDP of $" 
            + e.features[0].properties.GDP_Bil.toFixed(2) + ' billion under the ' 
            + e.features[0].properties.Scenario  + ' scenario in year ' + e.features[0].properties.Year + '.' 
            + '<canvas id="pie-chart-cit" width="500" height="500"></canvas>')
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
    var citiesLegendEl = document.getElementById('Cities-legend');

    map.on('zoom', function() {
        var ZoomLevel = map.getZoom();
        if (ZoomLevel < zoomThreshold1) {
            countryLegendEl.style.display = 'block';
            provincesLegendEl.style.display = 'none';
            citiesLegendEl.style.display = 'none';
        } else if (ZoomLevel > zoomThreshold1 && ZoomLevel < zoomThreshold2) {
            countryLegendEl.style.display = 'none';
            provincesLegendEl.style.display = 'block';
            citiesLegendEl.style.display = 'none';
        } else {
            countryLegendEl.style.display = 'none';
            provincesLegendEl.style.display = 'none';
            citiesLegendEl.style.display = 'block';
        }

    });
    
}); // do not remove again
// if there is no end to map load above this point..