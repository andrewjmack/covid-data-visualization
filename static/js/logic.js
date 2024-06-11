// Define colors based on positive rate
var colors = ['#FFEDA0', '#FED976', '#FEB24C', '#FD8D3C', '#FC4E2A', '#E31A1C', '#BD0026', '#800026'];

// Function to get color based on positive rate
function getColor(d) {
    return d > 40 ? colors[7] :
           d > 35 ? colors[6] :
           d > 30 ? colors[5] :
           d > 25 ? colors[4] :
           d > 20 ? colors[3] :
           d > 15 ? colors[2] :
           d > 10 ? colors[1] :
                    colors[0];
}

// Fetch epidemiology and demographic data to calculate positive rates for all states
function calculateStatePositiveRates() {
    Promise.all([
        d3.json('http://127.0.0.1:5000/api/v1.0/epidemiology_us'),
        d3.json('http://127.0.0.1:5000/api/v1.0/demographic_us'),
        d3.json('http://127.0.0.1:5000/api/v1.0/states')
    ]).then(([epidemiologyData, demographicData, statesData]) => {
        const stateRates = {};
        statesData.forEach(state => {
            const demoData = demographicData.find(d => d.location_key === state.location_key);
            if (demoData) {
                const stateEpidemiologyData = epidemiologyData.filter(item => item.location_key === state.location_key);
                let maxConfirmed = 0;
                stateEpidemiologyData.forEach(entry => {
                    if (entry.cumulative_confirmed > maxConfirmed) maxConfirmed = entry.cumulative_confirmed;
                });
                if (demoData.population && maxConfirmed) {
                    const positiveRate = ((maxConfirmed / demoData.population) * 100).toFixed(2);
                    stateRates[state.state] = positiveRate;
                }
            }
        });
        window.stateRates = stateRates;

        // Load GeoJSON data for the US states
        fetch('https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json')
            .then(response => response.json())
            .then(data => {
                geojson = L.geoJson(data, {
                    style: style,
                    onEachFeature: onEachFeature
                }).addTo(map);

                // Set initial state name
                document.getElementById('info-panel-header').innerHTML = '<h2>United States</h2>';
                document.getElementById('legend').innerHTML = 'Highlighted: None';
            });
    }).catch(error => console.error('Error calculating state positive rates:', error));
}

// Define a function to style the GeoJSON layer
function style(feature) {
    let statePositiveRate = window.stateRates ? window.stateRates[feature.properties.name] : 0;
    return {
        fillColor: getColor(statePositiveRate),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

// Fetch state data using the state name
function fetchStateData(stateName) {
    d3.json('http://127.0.0.1:5000/api/v1.0/states')
        .then(statesData => {
            var stateInfo = statesData.find(item => item.state === stateName);
            if (!stateInfo) throw new Error('State not found');
            return stateInfo.location_key;
        })
        .then(locationKey => {
            fetchDemographicData(locationKey);
            fetchEpidemiologyData(locationKey);
        })
        .catch(error => console.error('Error fetching state data:', error));
}

// Initialize the map and calculate state positive rates
var map = L.map('map').setView([37.0902, -95.7129], 4);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

calculateStatePositiveRates();

var currentZoomedLayer = null;

// Function to highlight feature and display state name in legend
function highlightFeature(e) {
    var layer = e.target;
    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });
    var stateName = layer.feature.properties.name;
    document.getElementById('legend').innerHTML = 'Highlighted: ' + stateName;
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

// Function to reset the highlight
function resetHighlight(e) {
    var layer = e.target;
    geojson.resetStyle(layer);
    document.getElementById('legend').innerHTML = 'Highlighted: None';
}

// Function to show info and zoom in or out on click
function showInfoAndZoom(e) {
    var layer = e.target;
    var state = layer.feature.properties.name;
    if (currentZoomedLayer === layer) {
        map.setView([37.0902, -95.7129], 4);
        document.getElementById('info-panel-header').innerHTML = '<h2>United States</h2>';
        resetTable();
        currentZoomedLayer = null;
        document.getElementById('legend').innerHTML = 'Highlighted: None';
    } else {
        map.fitBounds(layer.getBounds());
        document.getElementById('info-panel-header').innerHTML = '<h2>' + state + '</h2>';
        currentZoomedLayer = layer;
        fetchStateData(state);
    }
}

// Function to reset the table data
function resetTable() {
    document.getElementById('population').innerText = '';
    document.getElementById('tested').innerText = '';
    document.getElementById('covid-positive').innerText = '';
    document.getElementById('death').innerText = '';
    document.getElementById('recovered').innerText = '';
    document.getElementById('positive_rate').innerText = ''; // Reset positive rate
}

// Fetch demographic data and update the table
function fetchDemographicData(locationKey) {
    d3.json('http://127.0.0.1:5000/api/v1.0/demographic_us')
        .then(data => {
            var stateData = data.find(item => item.location_key === locationKey);
            if (stateData) {
                document.getElementById('population').innerText = stateData.population || '';
                // Save population data to be used for calculating positive rate
                window.currentPopulation = stateData.population;
            }
        })
        .catch(error => console.error('Error fetching demographic data:', error));
}

// Fetch epidemiology data and update the table
function fetchEpidemiologyData(locationKey) {
    d3.json('http://127.0.0.1:5000/api/v1.0/epidemiology_us')
        .then(data => {
            var stateData = data.filter(item => item.location_key === locationKey);
            let maxTested = 0, maxRecovered = 0, maxDeaths = 0, maxConfirmed = 0;
            stateData.forEach(entry => {
                if (entry.cumulative_tested > maxTested) maxTested = entry.cumulative_tested;
                if (entry.cumulative_recovered > maxRecovered) maxRecovered = entry.cumulative_recovered;
                if (entry.cumulative_deceased > maxDeaths) maxDeaths = entry.cumulative_deceased;
                if (entry.cumulative_confirmed > maxConfirmed) maxConfirmed = entry.cumulative_confirmed;
            });
            document.getElementById('tested').innerText = maxTested || '';
            document.getElementById('recovered').innerText = maxRecovered || '';
            document.getElementById('death').innerText = maxDeaths || '';
            document.getElementById('covid-positive').innerText = maxConfirmed || '';
            
            // Calculate positive rate
            let positiveRate = 'N/A';
            if (window.currentPopulation && maxConfirmed) {
                positiveRate = ((maxConfirmed / window.currentPopulation) * 100).toFixed(2);
                document.getElementById('positive_rate').innerText = `${positiveRate}%`;
            } else {
                document.getElementById('positive_rate').innerText = 'N/A';
            }

            // Update the map color based on positive rate
            if (currentZoomedLayer) {
                const color = getColor(positiveRate);
                currentZoomedLayer.setStyle({ fillColor: color });
            }
        })
        
        .catch(error => console.error('Error fetching epidemiology data:', error));
}

// Show information for the selected date
function showInfoForDate() {
    var selectedDate = document.getElementById('date-input').value;
    var stateName = document.getElementById('info-panel-header').innerText.replace('<h2>', '').replace('</h2>', '').trim();
    if (!selectedDate || !stateName || stateName === 'United States') {
        alert('Please select a date and a state.');
        return;
    }
    d3.json('http://127.0.0.1:5000/api/v1.0/states')
        .then(statesData => {
            var stateInfo = statesData.find(item => item.state === stateName);
            if (!stateInfo) throw new Error('State not found');
            var locationKey = stateInfo.location_key;
            return d3.json('http://127.0.0.1:5000/api/v1.0/epidemiology_us')
                .then(data => {
                    var stateData = data.find(item => item.location_key === locationKey && item.date === selectedDate);
                    if (!stateData) {
                        alert('No data available for the selected date.');
                        return;
                    }
                    document.getElementById('tested').innerText = stateData.new_tested || 'N/A';
                    document.getElementById('covid-positive').innerText = stateData.new_confirmed || 'N/A';
                    document.getElementById('death').innerText = stateData.new_deceased || 'N/A';
                    document.getElementById('recovered').innerText = stateData.new_recovered || 'N/A';
                });
        })
        .catch(error => console.error('Error fetching data:', error));
}
// Define a function to handle feature interactions
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: showInfoAndZoom
    });
}
