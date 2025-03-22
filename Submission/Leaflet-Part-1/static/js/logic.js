// Create the 'basemap' tile layer that will be the background of our map.

// Next 12 lines from in class activity 15.1.10
// Step 1: CREATE THE BASE LAYERS
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});


let queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';
d3.json(queryUrl).then(function (data) {
  // Step 2: CREATE THE DATA/OVERLAY LAYERS
  // Next 10 lines from Prof Booth example
  console.log(data);

  // Loop Through Earthqaukes
  let markers = [];
  for (let i = 0; i < data.features.length; i++) {
    let row = data.features[i];
    let location = row.geometry.coordinates;
    if (location) {
      let longitude = location[0];
      let latitude = location[1];
      let depth = location [2];
      let magnitude = row.properties.mag;

      // Next lines from in class activity 15.1.7
      // Choose color
      let dcolor = "green";
      if (depth > 2) {
        dcolor = "yellow";
      } else if (depth > 4) {
        dcolor = "orange";
      } else if (depth > 6) {
        dcolor = "red";
      } else if (depth > 8) {
        dcolor = "violet";
      } else {
        dcolor = "green";
      }
      
      // Create Marker
      circle = L.circleMarker([latitude, longitude], {
        fillOpacity: 0.75,
        color: dcolor,
        radius: (3*magnitude)
      }).bindPopup(`<h1>${row.properties.title}</h1><hr><h2>Depth: ${depth}m</h2>`); // This line taken from Booth's example

      markers.push(circle);
    }

  }

  // Create Layer groups
  let markerLayer = L.layerGroup(markers)

  // Step 3: CREATE THE LAYER CONTROL
  let baseMaps = {
    Street: street,
    Topography: topo
  };

  let overlayMaps = {
    Earthquakes: markerLayer
  };


  // Step 4: INITIALIZE THE MAP
  let myMap = L.map("map", {
    center: [30, -130],
    zoom: 4,
    layers: [street, markerLayer]
  });

  // Step 5: Add the Layer Control, Legend, Annotations as needed
  L.control.layers(baseMaps, overlayMaps).addTo(myMap);

        // Remaining code modified slightly from Booth's example
        // // Set up the legend.
        let legend = L.control({ position: "bottomright" });
        legend.onAdd = function () {
          let div = L.DomUtil.create("div", "info legend");
  
          let legendInfo = `<h3>Earthquake <br> Depth</h3>
          <i style="background:#98ee00"></i>-10-10 - Green<br>
          <i style="background:#d4ee00"></i>10-30 - Yellow<br>
          <i style="background:#eecc00"></i>30-50 - Orange<br>
          <i style="background:#ee9c00"></i>50-70 - Red<br>
          <i style="background:#ea822c"></i>70-90 - Violet<br>
          <i style="background:#ea2c2c"></i>90+`;
  
          div.innerHTML = legendInfo;
  
          return div;
        };
  
        // Adding the legend to the map
        legend.addTo(myMap);
      });
