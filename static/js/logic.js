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

// Define a function to handle feature interactions
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: showInfoAndZoom
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

function showInfoAndZoom(e) {
  var layer = e.target;
  var stateName = layer.feature.properties.name;

  // Update the info panel header
  document.getElementById('info-panel-header').innerHTML = '<h2>' + stateName + '</h2>';

  // Fit the map to the clicked feature's bounds
  map.fitBounds(layer.getBounds());
}

// Define a function to show info and zoom on click
/*
function showInfoAndZoom(e) {
    var layer = e.target;
    var stateName = layer.feature.properties.name;

    // Fit the map to the clicked feature's bounds
    map.fitBounds(layer.getBounds());

    // Update the info panel
    document.getElementById('info-panel').innerHTML = '<h2>' + stateName + '</h2>';
}
*/

// Add the GeoJSON data
var geojson;

// Load GeoJSON data for the US states
fetch('https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json')
    .then(response => response.json())
    .then(data => {
        geojson = L.geoJson(data, {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(map);
    });
