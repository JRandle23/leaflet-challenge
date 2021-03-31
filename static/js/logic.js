// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Define earthquake layer
var earthquakes = L.layerGroup ();

// Define lightmap layer
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution:  "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  tileSize: 500,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
});

// Define satelite map layer
var satelitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 500,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/satellite-v9",
  accessToken: API_KEY
});

// Define darkmap layer
var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  tileSize: 500,
  maxZoom: 18,
  zoomOffset: -1,
  id: "dark-v10",
  accessToken: API_KEY
});

// Define a baseMaps object to hold our base layers
var baseMaps = {
  "Satelite Map": satelitemap,
  "Dark Map": darkmap,
  "Light Map": lightmap
};

// Define overlay maps
var overlayMaps = {
  Earthquakes: earthquakes
};

// Define myMap
var myMap = L.map("mapid", {
  center: [
    0, 0
  ],
  zoom: 2,
  layers: [satelitemap, earthquakes]
  });

// Add all layers to myMap
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);


// Perform a GET request to the query URL
d3.json(queryUrl, function(earthquakeData) {
    console.log(earthquakeData);

    function markerSize(magnitude) {
      return magnitude * 3;
    };

      // Determine the marker color by depth
    function chooseColor(depth) {
      switch(true) {
        case depth > 90:
          return "red";
        case depth > 70:
          return "orangered";
        case depth > 50:
          return "orange";
        case depth > 30:
          return "gold";
        case depth > 10:
          return "yellow";
        default:
          return "lightgreen";
      }
    }
    // Create a GeoJSON layer containing the features array
    L.geoJSON(earthquakeData, {
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, 
          // Set the style of the markers based on properties.mag
          {
            radius: markerSize(feature.properties.mag),
            fillColor: chooseColor(feature.geometry.coordinates[2]),
            fillOpacity: 1,
            color: "black",
            stroke: true,
            weight: 0.5
          }
        );
      },
      
      // Each feature a popup describing the place and time of the earthquake
      onEachFeature: function(feature, layer) {
        layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Date: ${new Date(feature.properties.time)}</p><hr><p>Magnitude: ${feature.properties.mag}</p></p><hr><p>Depth (km): ${feature.geometry.coordinates[2]}</p>`);
      }
    }).addTo(earthquakes);

    // Sending our earthquakes layer to myMap
    earthquakes.addTo(myMap);

      // Add legend
    var legend = L.control({position: "bottomright"});
    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend"),
      depth = [-10, 10, 30, 50, 70, 90];
      
      div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"
    for (var i =0; i < depth.length; i++) {
      div.innerHTML += 
      '<i style="background:' + chooseColor(depth[i] + 1) + '"></i> ' +
          depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
        }
      return div;
    };
    legend.addTo(myMap);
});


























// // Store our API endpoint inside queryUrl
// var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// // Perform a GET request to the query URL
// d3.json(queryUrl, function(data) {
//     console.log(data);
//   // Once we get a response, send the data.features object to the createFeatures function
//   createFeatures(data.features);
// });

// function createFeatures(earthquakeData) {

//   function onEachLayer(feature){
//     return new L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
//       radius: circleSize(feature.properties.mag), 
//       fillOpacity: 0.8, 
//       color: getColor(feature.geometry.coordinates[2]),
//       fillColor: getColor(feature.geometry.coordinates[2])
//     });
//   };

//   // Define a function we want to run once for each feature in the features array
//   // Give each feature a popup describing the magnitude and time of the earthquake
//   function onEachFeature(feature, layer) {
//     layer.bindPopup("<h3>Magnitude: " + feature.properties.mag +
//       "</h3><h3>Location: " + feature.properties.place +
//       "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
//   };

//   var earthquakes = L.geoJSON(earthquakeData, {
//     onEachFeature: onEachFeature,
//     pointToLayer: onEachLayer
//   });
// };

// function createMap(earthquakes) {

//   // Define light map layer
//   var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     attribution:  "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//     tileSize: 500,
//     maxZoom: 2,
//     id: "mapbox/light-v10",
//     accessToken: API_KEY
//   });
  
//   // Define satelite map layer
//   var satelitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
//     tileSize: 500,
//     maxZoom: 2,
//     zoomOffset: -1,
//     id: "mapbox/satellite-v9",
//     accessToken: API_KEY
//   });

//   // Define dark map layer
//   var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//     tileSize: 500,
//     maxZoom: 2,
//     id: "dark-v10",
//     accessToken: API_KEY
//   });

//   // Define a baseMaps object to hold our base layers
//   var baseMaps = {
//     "Satelite Map": satelitemap,
//     "Dark Map": darkmap,
//     "Light Map": lightmap
//   };

//   // Create overlay object to hold our overlay layer
//   var overlayMaps = {
//     Earthquakes: earthquakes
//   };

//   // Create our map, giving it the streetmap and earthquakes layers to display on load
//   var myMap = L.map("mapid", {
//     center: [0, 0],
//     zoom: 2,
//     layers: [satelitemap, earthquakes]
//   });

//   L.control.layers(baseMaps, overlayMaps, {
//     collapsed: true
//   }).addTo(myMap);

//   var info = L.control({position: "bottomright"});

//   legend.onAdd = function() {
//     var div = L.DomUtil.create('div', 'legend');
//         labels = [0-10, 10-30, 30-50, 50-70, 70-90, 90];
    
//     for (var i = 0; i < labels.length; i++) {
//       div.innerHTML += '<i style="background: "' + getcolor(i) + '"></i>' + labels[i] + '<br>' ;
//     }
//     return div;
//   };

//   info.addTo(myMap);

// };

// function getColor(magnitude) {

//   if (magnitude >= 5) {
//     return "red";
//   }
//   else if (magnitude >= 4) {
//     return "peru";
//   }
//   else if (magnitude >= 3) {
//     return "darkorange";
//   }
//   else if (magnitude >= 1) {
//     return "yellowgreen";
//   }
//   else {
//     return "green";
//   }
// };

// function circleSize(magnitude) {
//   return magnitude ** 2;
// };