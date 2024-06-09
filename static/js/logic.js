// Create a map centered on the USA
var map = L.map('map').setView([37.0902, -95.7129], 4);

// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

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

// Global dictionary to store population data
var populationData = {};

// Load population data from CSV
d3.csv("resources/US_demo_cleaned.csv").then(function(data) {
    data.forEach(function(d) {
        populationData[d.location_key] = d.population;
    });
});

// Function to populate the population data when a state is clicked
function populatePopulation(locationKey) {
    var populationElement = document.getElementById('population');

    if (populationData.hasOwnProperty(locationKey)) {
        populationElement.innerHTML = populationData[locationKey];
    } else {
        populationElement.innerHTML = "N/A";
    }
}

// Define a function to handle feature interactions
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: function(e) {
            showInfoAndZoom(e);
            fetchEpidemiologyData(feature.properties.location_key);
            populatePopulation(feature.properties.location_key);
        }
    });
}

// Define a function to highlight features on mouseover
function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

// Define a function to reset the highlight
function resetHighlight(e) {
    geojson.resetStyle(e.target);
}

// Define a function to show info and zoom on click
function showInfoAndZoom(e) {
    var layer = e.target;
    var stateName = layer.feature.properties.name;

    // Update the info panel header
    document.getElementById('info-panel-header').innerHTML = '<h2>' + stateName + '</h2>';

    // Fit the map to the clicked feature's bounds
    map.fitBounds(layer.getBounds());
}

// Load GeoJSON data for the US states
var geojson;
fetch('https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json')
    .then(response => response.json())
    .then(data => {
        geojson = L.geoJson(data, {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(map);
    });

// Function to fetch data from the API
function fetchEpidemiologyData(locationKey) {
    const url = `http://127.0.0.1:5000/api/v1.0/epidemiology_us?location_key=${locationKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                updateInfoPanel(data[0]);  // Update the info panel with the fetched data
            } else {
                console.error('No data available for:', locationKey);
            }
        })
        .catch(error => {
            console.error('Error fetching epidemiology data:', error);
        });
}

// Function to update the info panel
function updateInfoPanel(data) {
    document.getElementById('tested').textContent = data.cumulative_tested || "N/A";
    document.getElementById('covid-positive').textContent = data.cumulative_confirmed || "N/A";
    document.getElementById('covid-negative').textContent = data.new_tested - data.new_confirmed || "N/A";  // Example calculation
    document.getElementById('death').textContent = data.cumulative_deceased || "N/A";
    document.getElementById('recovered').textContent = data.cumulative_recovered || "N/A";
}
