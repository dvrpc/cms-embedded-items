import * as layers from "./layers.js";
import {
  VisitorAttractions_All,
  VisitorAttractions_Bus,
  VisitorAttractions_Circuit,
  VisitorAttractions_Rail,
} from "./geoms.js";
////
// Tourism geojsons
////
const layerData = {
  VisitorAttractions_All,
  VisitorAttractions_Bus,
  VisitorAttractions_Rail,
  VisitorAttractions_Circuit,
};

////
// Functions to Create tourism layers, hover layers and rail layers
////
const addTourismLayer = (layer) => {
  // use e (value of the selected option) to pick the correct dataSource
  const data = layerData[layer];

  return {
    id: layer,
    type: "circle",
    source: {
      type: "geojson",
      data,
    },
    paint: {
      "circle-radius": 5,
      "circle-color": "#F7941D",
      "circle-opacity": 1,
      "circle-stroke-width": 1.25,
      "circle-stroke-color": "#643b83",
      "circle-stroke-opacity": 0.9,
    },
  };
};
const addTourismHover = (layer) => {
  const data = layerData[layer];

  return {
    id: layer + "-hover",
    type: "circle",
    source: {
      type: "geojson",
      data,
    },
    layout: {},
    paint: {
      "circle-radius": 6,
      "circle-color": "#643b83",
      "circle-opacity": 1,
      "circle-stroke-width": 1.25,
      "circle-stroke-color": "#643b83",
      "circle-stroke-opacity": 1,
    },
    filter: ["==", "OBJECTID_1", ""],
  };
};
const hoverLayer = (e, layer) => {
  const id = e.features[0].properties["OBJECTID_1"];

  map.getCanvas().style.cursor = "pointer";
  map.setFilter(layer, ["==", "OBJECTID_1", id]);
};
const unHoverLayer = (layer) => {
  map.getCanvas().style.cursor = "";
  map.setFilter(layer, ["==", "OBJECTID_1", ""]);
};
const addRailLayers = () => {
  map.addLayer(layers.railLayer);
  map.addLayer(layers.railLabelsLayer);
};
const addCircuitLayer = () => map.addLayer(layers.circuitExistingLayer);
const addBusLayer = () => map.addLayer(layers.busLayer);

////
// Mapboxgl popup functions
////
const handleExtraPopupContent = (type, properties) => {
  switch (type) {
    case "VisitorAttractions_Bus":
      const stop = properties["STOPNAME"];

      return `<p><strong>Nearby Bus Walkshed</strong>: ${stop}</p>`;
    case "VisitorAttractions_Rail":
      const station4 = properties["STATIONS_4"];
      const station5 = properties["STATIONS_5"];
      const station6 = properties["STATIONS_6"];

      return `
                <p><strong>Nearby Rail Walkshed:</strong></p>
                <ol class="rail-walkshed-list">
                    <li><strong>Station</strong>: ${station4}</li>
                    <li><strong>Line</strong>: ${station5}</li>
                    <li><strong>Operator</strong>: ${station6}</li>
                </ol>
            `;
    case "VisitorAttractions_Circuit":
      const name = properties["NAME"];
      return `<p><strong>Circuit Name</strong>: ${name}</p>`;
    default:
      return "";
  }
};
const addPopup = (e, type) => {
  const properties = e.features[0].properties;
  const name =
    properties["TRADENAME"].length > 1
      ? properties["TRADENAME"]
      : properties["COMPANY"];
  const address = properties["ADDRESS"];
  const lngLat = e.lngLat;
  let html = `
        <h3 class="popup-title">${name}</h3>
        <hr />
        <span class="address-wrapper"><strong>Address</strong>: <address class="popup-address"> ${address}</address></span>
    `;

  html += handleExtraPopupContent(type, properties);

  new mapboxgl.Popup({
    closebutton: true,
    closeOnClick: true,
  })
    .setLngLat(lngLat)
    .setHTML(html)
    .addTo(map);
};

////
// Maboxgl Config
////
mapboxgl.accessToken =
  "pk.eyJ1IjoiY3J2YW5wb2xsYXJkIiwiYSI6ImNseHVpZmprazI4bWoycXB2MTljMWF1YjUifQ.jLMaSXqIUV5N2IxYlk5ZiQ";

const map = new mapboxgl.Map({
  container: "map",
  style: {
    version: 8,
    glyphs: "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
    sources: {
      Boundaries: {
        type: "vector",
        url: "https://tiles.dvrpc.org/data/dvrpc-municipal.json",
      },
    },
    layers: [
      layers.countyFill,
      layers.countyOutline,
      layers.municipalityOutline,
    ],
  },
  attributionsControl: false,
  center: [-75.2273, 40.071],
  zoom: 3,
});

map.fitBounds([
  [-76.09405517578125, 39.49211914385648],
  [-74.32525634765625, 40.614734298694216],
]);

map.on("load", () => {
  // load VisitorAttractions_All by default
  const defaultLayer = addTourismLayer("VisitorAttractions_All");
  const defaultHoverLayer = addTourismHover("VisitorAttractions_All");

  map.addLayer(defaultLayer);
  map.addLayer(defaultHoverLayer);

  // listen for mouse events on default layer
  map.on("mousemove", "VisitorAttractions_All", (e) =>
    hoverLayer(e, "VisitorAttractions_All-hover"),
  );
  map.on("mouseleave", "VisitorAttractions_All", () =>
    unHoverLayer("VisitorAttractions_All-hover"),
  );
  map.on("click", "VisitorAttractions_All", (e) => addPopup(e, null));

  const layerOptions = document.getElementById("tourism-select");

  // listen to onchange events for the dropdown
  layerOptions.onchange = (e) => {
    let hasLayer = false;
    let isRailLayer = false;
    let isCircuitLayer = false;
    let isBusLayer = false;

    // get the selected layer
    const layer = e.target.value;

    // check if the selected layer is the rail layer
    if (layer === "VisitorAttractions_Rail") isRailLayer = true;
    if (layer === "VisitorAttractions_Circuit") isCircuitLayer = true;
    if (layer === "VisitorAttractions_Bus") isBusLayer = true;

    // get layers (ignore first 3 b/c those are the basemap)
    const layers = map.getStyle().layers.slice(3);

    // loop thru the existing layers to a) hide them and b) check if the selected layer already exists
    layers.forEach((loopedLayer) => {
      loopedLayer = loopedLayer.id;

      map.setLayoutProperty(loopedLayer, "visibility", "none");

      if (loopedLayer === layer) hasLayer = true;
    });

    // if the layer already exists on the map, toggle it's visibility
    if (hasLayer) {
      const hoverLayer = layer + "-hover";

      map.setLayoutProperty(layer, "visibility", "visible");
      map.setLayoutProperty(hoverLayer, "visibility", "visible");

      if (isRailLayer) {
        map.setLayoutProperty("rail-layer", "visibility", "visible");
        map.setLayoutProperty("rail-labels", "visibility", "visible");
      }

      if (isCircuitLayer) {
        map.setLayoutProperty(
          "circuit-trails-existing",
          "visibility",
          "visible",
        );
      }

      if (isBusLayer) {
        map.setLayoutProperty("bus-layer", "visibility", "visible");
      }

      // otherwise add it to the map
    } else {
      const tourismLayer = addTourismLayer(layer);
      const tourismHoverLayer = addTourismHover(layer);

      if (isRailLayer) addRailLayers();
      if (isCircuitLayer) addCircuitLayer();
      if (isBusLayer) addBusLayer();

      map.addLayer(tourismLayer);
      map.addLayer(tourismHoverLayer);

      // add mouse events
      map.on("mousemove", layer, (e) => hoverLayer(e, layer + "-hover"));
      map.on("mouseleave", layer, () => unHoverLayer(layer + "-hover"));
      map.on("click", layer, (e) => addPopup(e, layer));
    }
  };
});

// @NEW
// new circuit map:
// line strings for each trail name (copy rail labels jawn)
// possibly make this a fnc - parameters for field names
const mapC = new mapboxgl.Map({
  container: "map-2",
  style: {
    version: 8,
    glyphs: "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
    sources: {
      Boundaries: {
        type: "vector",
        url: "https://tiles.dvrpc.org/data/dvrpc-municipal.json",
      },
    },
    layers: [
      layers.countyFill,
      layers.countyOutline,
      layers.municipalityOutline,
    ],
  },
  attributionsControl: false,
  center: [-75.2273, 40.071],
  zoom: 3,
});

mapC.fitBounds([
  [-76.09405517578125, 39.49211914385648],
  [-74.32525634765625, 40.614734298694216],
]);

const layerOptionsC = document.getElementById("circuit-select");

const addCircuitPopup = (e) => {
  const properties = e.features[0].properties;
  const name = properties["NAME"];
  const mainTrail = properties["MainTrail"];
  const lngLat = e.lngLat;

  let html = `
        <h3 class="popup-title">${name}</h3>
        <hr />
        <span>Main Trail: ${mainTrail}</span>
    `;

  return new mapboxgl.Popup({
    closebutton: true,
    closeOnClick: true,
  })
    .setLngLat(lngLat)
    .setHTML(html);
};

// // add default with all circuit trails
mapC.on("load", () => {
  mapC.addLayer(layers.circuitAnalysisLayer);

  mapC.on("click", "circuit-trails", (e) => {
    const popup = addCircuitPopup(e);
    popup.addTo(mapC);
  });

  mapC.on(
    "mousemove",
    "circuit-trails",
    () => (mapC.getCanvas().style.cursor = "pointer"),
  );
  mapC.on(
    "mouseleave",
    "circuit-trails",
    () => (mapC.getCanvas().style.cursor = ""),
  );

  // listen to onchange events for the dropdown
  layerOptionsC.onchange = (e) => {
    // get the selected layer
    const layer = e.target.value;
    let filter;

    // get the correct filter based on the layer
    switch (layer) {
      case "All":
        filter = null;
        break;
      case "Connected":
        // this throws an error for some reason
        // filter = ['>', ['get', 'TTTrails'], 5]
        filter = ["==", ["get", "TTTrails"], 6];
        break;
      default:
        filter = ["==", ["get", layer], 1];
    }

    // apply map filter
    mapC.setFilter("circuit-trails", filter);
  };
});
