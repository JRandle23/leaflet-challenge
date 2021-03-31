// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
    console.log(data);
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

// function createFeature(earthquakeData)  {

// function createMarkers(feature) {
// //   earthquakeMarkers = earthquakeData.map((feature) =>
//     L.circleMarker([feature.geometry.coordinates[0], feature.geometry.coordinates[1]], {
//       radius: magSize(feature.properties.mag),
//       stroke: true, 
//       color: "black", 
//       opacity: 1,
//       weight: 0.5, 
//       fill: true,
//       fillColor: magColor(feature.geometry.coordinates[2]),
//       fillOpacity: 0.9
//     })
//     ((feature, layer) => {
//       layer.bindPopUp("<h3>Magnitude: " + feature.properties.mag +
//         "</h3><h3>Location: " + feature.properties.place +
//         "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
//     })
//   )
  


//   var earthquakes = L.geoJSON(earthquakeMarkers);

//   var mags = earthquakeData.map((d) => magSize(+d.properties.mag));

  

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the magnitude and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>Magnitude: " + feature.properties.mag +
      "</h3><h3>Location: " + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }


  function createMarkers(feature) {

    var earthquakeMarkers = []
    var marker = L.circleMarker([feature.geometry.coordinates[0], feature.geometry.coordinates[1]], {
      radius: feature.properties.mag,
      stroke: true, 
      color: "black", 
      opacity: 1,
      weight: 0.5, 
      fill: false,
      fillColor: magColor(feature.geometry.coordinates[2]),
      fillOpacity: 0.9
    });
    earthquakeMarkers.push(marker);
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  
  // function create(earthquakeMarker) {
  //   markers = earthquakeMarker
  // }
  // var geojsonMarkerOptions = {
  //   radius: 8, 
  //   fillColor: "orange", 
  //   color: "yellow", 
  //   weight: 1, 
  //   opacity: 1, 
  //   fillOpacity: 0.8
  // };

  


//   var earthquakes = L.geoJSON(earthquakeData, {
//     onEachFeature: onEachFeature 
//   });

//   // Sending our earthquakes layer to the createMap function
//   createMap(L.layerGroup(earthquakeMarkers, earthquakes));
// }

function createMap(earthquakes) {

  // Define satelite layer
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution:  "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    tileSize: 500,
    maxZoom: 2,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  });
  
  
  var satelitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 500,
    maxZoom: 2,
    zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    tileSize: 500,
    maxZoom: 2,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Satelite Map": satelitemap,
    "Dark Map": darkmap,
    "Light Map": lightmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("mapid", {
    center: [0, 0],
    zoom: 5,
    layers: [satelitemap, earthquakes]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var legend = L.control({position: "bottomright"});

  legend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'ingo legend');
    var magnitudes = [4.75, 5.0, 5.25, 5.5, 5.75];
    
    magnitudes.forEach(m => {
      var range = `${m} - ${m+0.25}`;
      if (m >= 5.75) {range = `${m}+`}
      var html = `<div class = "legend-item">
            <div style = "height: 25px; width: 25px; backgoround-color: ${markerColor(m)}"></div>
            <div class = legend-text>Magnitude: - <strong>${range}</strong></div>
          </div>`
          div.innerHTML += html
    });
    return div;
  };
  legend.addTo(myMap);
}


//   function magColor(mag) {
//     var color = "";
//     if (mag <= 2) {color = "#ffffb2"; }
//     else if (mag <= 3) {color = "#fecc5c"; }
//     else if (mag <= 4) {color = "#fd8d3c"; }
//     else if (mag <= 5) {color = "#f03b20"; }
//     else {color = "#bd0026"; }
  
//   return color;
//   };


//   function magSize(mag){
//     if (mag <= 1){
//       return 8
//     }
//     return mag * 8;
//   }
// }

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
//   L.control.layers(baseMaps, overlayMaps, {
//     collapsed: false
//   }).addTo(myMap);
// }


