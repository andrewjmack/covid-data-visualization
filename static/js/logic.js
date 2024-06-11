// Create a map centered on the USA
var map = L.map('map').setView([37.0902, -95.7129], 4);

// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var currentZoomedLayer = null;  // Variable to track the currently zoomed layer

// Function to highlight feature and display state name and density in legend each time the mouse hovers over
function highlightFeature(e) {
    var layer = e.target;

    // Change the style
    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    // Calculate population density
    var area = layer.feature.properties.area; // Assuming 'area' is in square kilometers
    var stateName = layer.feature.properties.name;
    var population = layer.feature.properties.population; // Assuming population is available here

    var density = population && area ? (population / area).toFixed(2) : 'N/A';

    // Display the state name and density in the legend
    document.getElementById('legend').innerHTML = 'Highlighted: ' + stateName + ' (Density: ' + density + ')';

    // Bring the layer to the front
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

// Function to reset the highlight
function resetHighlight(e) {
    var layer = e.target;
    geojson.resetStyle(layer);

    // Clear the legend
    document.getElementById('legend').innerHTML = 'Highlighted: None';
}

// Function to show info and zoom in or out on click
function showInfoAndZoom(e) {
    var layer = e.target;
    var state = layer.feature.properties.name;
    var area = layer.feature.properties.area; // Assuming 'area' is in square kilometers

    console.log("Clicked state:", state); // Debugging log

    // If the clicked layer is already zoomed in, zoom out and reset header
    if (currentZoomedLayer === layer) {
        map.setView([37.0902, -95.7129], 4);  // Zoom out to the initial view
        document.getElementById('info-panel-header').innerHTML = '<h2>United States</h2>';  // Reset header
        resetTable();  // Reset table data
        currentZoomedLayer = null;  // Reset the currently zoomed layer
        document.getElementById('legend').innerHTML = 'Highlighted: None'; // Reset legend
    } else {
        // Zoom in to the clicked layer
        map.fitBounds(layer.getBounds());
        document.getElementById('info-panel-header').innerHTML = '<h2>' + state + '</h2>';
        currentZoomedLayer = layer;  // Update the currently zoomed layer

        // Fetch and display demographic and epidemiology data
        fetchStateData(state, area);
    }
}

// Function to reset the table data
function resetTable() {
    document.getElementById('population').innerText = '';
    document.getElementById('tested').innerText = '';
    document.getElementById('covid-positive').innerText = '';
    document.getElementById('death').innerText = '';
    document.getElementById('recovered').innerText = '';
    document.getElementById('density').innerText = ''; // Add density reset
}

// Fetch location key, demographic data, and epidemiology data, then update the table
function fetchStateData(stateName, area) {
    // Fetch location key
    d3.json('http://127.0.0.1:5000/api/v1.0/states')
        .then(statesData => {
            console.log("States API response data:", statesData); // Debugging log
            var stateInfo = statesData.find(item => item.state === stateName);
            if (!stateInfo) throw new Error('State not found');

            return stateInfo.location_key;
        })
        .then(locationKey => {
            // Fetch demographic data using the location key
            fetchDemographicData(locationKey, area);
            // Fetch epidemiology data using the location key
            fetchEpidemiologyData(locationKey);
        })
        .catch(error => console.error('Error fetching state data:', error));
}

// Fetch demographic data and update the table
function fetchDemographicData(locationKey, area) {
    d3.json('http://127.0.0.1:5000/api/v1.0/demographic_us')
        .then(data => {
            console.log("Demographic API response data:", data); // Debugging log

            var stateData = data.find(item => item.location_key === locationKey);
            console.log("State data found:", stateData); // Debugging log

            if (stateData) {
                document.getElementById('population').innerText = stateData.population || '';
                // Calculate and display population density
                if (area && stateData.population) {
                    var density = stateData.population / area;
                    document.getElementById('density').innerText = density.toFixed(2) || '';
                    document.getElementById('legend').innerHTML = 'Highlighted: ' + stateData.state + ' (Density: ' + density.toFixed(2) + ')'; // Update legend
                } else {
                    document.getElementById('density').innerText = '';
                }
            }
        })
        .catch(error => console.error('Error fetching demographic data:', error));
}

// Fetch epidemiology data and update the table
function fetchEpidemiologyData(locationKey) {
    d3.json('http://127.0.0.1:5000/api/v1.0/epidemiology_us')
        .then(data => {
            console.log("Epidemiology API response data:", data); // Debugging log

            // Filter the data for the specific state
            var stateData = data.filter(item => item.location_key === locationKey);
            console.log("State epidemiology data found:", stateData); // Debugging log

            // Find the maximum values
            let maxTested = 0;
            let maxRecovered = 0;
            let maxDeaths = 0;

            stateData.forEach(entry => {
                if (entry.cumulative_tested > maxTested) maxTested = entry.cumulative_tested;
                if (entry.cumulative_recovered > maxRecovered) maxRecovered = entry.cumulative_recovered;
                if (entry.cumulative_deceased > maxDeaths) maxDeaths = entry.cumulative_deceased;
            });

            // Update the table with the maximum values
            document.getElementById('tested').innerText = maxTested || '';
            document.getElementById('recovered').innerText = maxRecovered || '';
            document.getElementById('death').innerText = maxDeaths || '';
            document.getElementById('covid-positive').innerText = stateData.length > 0 ? stateData[stateData.length - 1].cumulative_confirmed || '' : '';
        })
        .catch(error => console.error('Error fetching epidemiology data:', error));
}

// Add the GeoJSON data
var geojson;

// Load GeoJSON data for the US states
fetch('https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json')
    .then(response => response.json())
    .then(data => {
        console.log("GeoJSON data:", data); // Debugging log - Check GeoJSON data structure
        geojson = L.geoJson(data, {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(map);

        // Set initial state name
        document.getElementById('info-panel-header').innerHTML = '<h2>United States</h2>';
        document.getElementById('legend').innerHTML = 'Highlighted: None';
    });

// Define a function to style the GeoJSON layer
function style(feature) {
    return {
        fillColor: '#FFEDA0',
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

// Define a function to handle feature interactions
function onEachFeature(feature, layer) {
    // Store population in properties if available
    if (feature.properties.population) {
        layer.feature.properties.population = feature.properties.population;
    }

    // Store area in properties if available
    if (feature.properties.area) {
        layer.feature.properties.area = feature.properties.area;
    }

    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: showInfoAndZoom
    });
}
