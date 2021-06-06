var earthquakeurl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
});

var earthquakes = L.layerGroup();

// Create our map, giving it the streetmap and earthquakes layers to display on load
var myMap = L.map("mapid", {
  center: [37.09, -95.71],
  zoom: 3,
  layers: [streetmap, earthquakes]
});

d3.json(earthquakeurl).then(data=>{
  console.log(data.features);
  data.features.forEach(feature => {
    var lat = feature.geometry.coordinates[1];
    var lon = feature.geometry.coordinates[0];
    var depth = feature.geometry.coordinates[2];
    var mag = feature.properties.mag;
    var place = feature.properties.place;

    L.circle([lat,lon],{radius: mag * 50000, color: chooseColor(depth)}).bindPopup(`${place}<br> Magnitude: ${mag}`).addTo(myMap);
  });
})

  function chooseColor(depth) {
    switch (true) {
      case depth > 90:
        return "red";
      case depth > 70:
        return "pink";
      case depth > 50:
        return "orange";
      case depth > 30:
        return "yellow";
      case depth > 10:
        return "lime";
      default:
        return "lightgreen";
  }  
}

// Create a legend to display the info about our map
var legend = L.control({
  position: "bottomleft"
}); 

// Add Legend to Map
legend.onAdd = function(map) {
  var div = L.DomUtil.create("div", "info legend");
  var depth = [-10, 10, 30, 50, 70, 90];
  
    div.innerHTML += "<h2>Earthquake Depth</h2>"
    for (var i =0; i < depth.length; i++) {
      div.innerHTML += 
      '<i style="background:' + chooseColor(depth[i] + 1) + '"></i> ' +
          depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
        }
      return div;
};

//   var legendInfo = "<h1>Earthquakes</h1>" +
//   "<div class=\"labels\">" +
//     "<div class=\"min\">" + depth + "</div>" +
//     // "<div class=\"max\">" + depth[depth.length - 1] + "</div>" +
//     "</div>";

//   div.innerHTML = legendInfo;

//   depth.forEach(function(depth, index) {
//     labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
//   });

//   div.innerHTML += "<ul>" + labels.join("") + "</ul>";
//   return div;
// };

  // for (var i = 0; i < depth.length; i++) {
  //   div.innerHTML +=
  //   '<i style="background:' + chooseColor(depth[i] + 1) + '"></i> ' +
  //       depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
  //     }
    
    // div.innerHTML = "<div style = 'background: red; ' > >90 </div><div style = 'background: pink; ' > >70 </div>"

legend.addTo(myMap);



// Create a Geojson Layer containing the features array
// d3.json(earthquakeurl).then(function(data) {
//   L.geoJson(data, {
//     // Style each feature
//     pointToLayer: function(feature, latlng) {
//       return L.circleMarker(latlng,
//         {
//         radius: markerSize(feature.prperties.mag),
//         fillColor: chooseColor(feature.geometry.coordinates[2]),
//         fillOpacity: 0.5,
//         weight: 1.5,
//         color: "black",
//         })
//     }
//   });
// })