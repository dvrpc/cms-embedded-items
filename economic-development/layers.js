import { circuitTourism } from "./geoms.js";
////
// Basemap layers
////

export {
  countyOutline,
  countyFill,
  municipalityOutline,
  railLayer,
  railLabelsLayer,
  circuitAnalysisLayer,
  circuitExistingLayer,
  busLayer,
};

const countyOutline = {
  id: "county-outline",
  type: "line",
  source: "Boundaries",
  "source-layer": "county",
  paint: {
    "line-width": 2.5,
    "line-color": "#fff",
  },
  filter: ["==", "dvrpc", "Yes"],
};
const countyFill = {
  id: "county-fill",
  type: "fill",
  source: "Boundaries",
  "source-layer": "county",
  layout: {},
  paint: {
    "fill-color": "rgb(136, 137, 140)",
    "fill-opacity": 1,
  },
  filter: ["==", "dvrpc", "Yes"],
};
const municipalityOutline = {
  id: "municipality-outline",
  type: "line",
  source: "Boundaries",
  "source-layer": "municipalities",
  paint: {
    "line-width": 0.5,
    "line-color": "#f7f7f7",
  },
};

////
// Transit layers
////
const railSource = {
  type: "geojson",
  data: "https://arcgis.dvrpc.org/portal/rest/services/Transportation/PassengerRail/FeatureServer/0/query?where=1=1&outFields=type,line_name&returnGeometry=true&outSR=4326&f=geojson",
};
const railLayer = {
  id: "rail-layer",
  type: "line",
  // using the same geojson and passenger origins cause the tile layer has way too much going on / might be buses?
  source: railSource,
  paint: {
    "line-color": [
      "match",
      ["get", "type"],
      "AMTRAK",
      "#004d6e",
      "NJ Transit",
      "#f18541",
      "NJ Transit Light Rail",
      "#ffc424",
      "PATCO",
      "#ed164b",
      "Rapid Transit",
      "#9e3e97",
      "Regional Rail",
      "#487997",
      "Subway",
      "#f58221",
      "Subway - Elevated",
      "#067dc1",
      "Surface Trolley",
      "#529442",
      "#323232",
    ],
    "line-width": ["interpolate", ["linear"], ["zoom"], 8, 3, 12, 8],
    "line-opacity": 0.85,
  },
};
const railLabelsLayer = {
  id: "rail-labels",
  type: "symbol",
  source: railSource,
  layout: {
    "text-field": "{line_name}",
    "text-font": ["Montserrat SemiBold", "Open Sans Semibold"],
    "text-size": ["interpolate", ["linear"], ["zoom"], 3, 12, 12, 10],
    "symbol-placement": "line",
  },
  paint: {
    "text-color": "#fff",
    "text-halo-color": [
      "match",
      ["get", "type"],
      "AMTRAK",
      "#004d6e",
      "NJ Transit",
      "#f18541",
      "NJ Transit Light Rail",
      "#ffc424",
      "PATCO",
      "#ed164b",
      "Rapid Transit",
      "#9e3e97",
      "Regional Rail",
      "#487997",
      "Subway",
      "#f58221",
      "Subway - Elevated",
      "#067dc1",
      "Surface Trolley",
      "#529442",
      "#323232",
    ],
    "text-halo-width": 2,
    "text-halo-blur": 3,
  },
};
const busSource = {
  type: "vector",
  url: "https://tiles.dvrpc.org/data/dvrpc-tim-transit.json",
};
const busLayer = {
  id: "bus-layer",
  type: "line",
  source: busSource,
  "source-layer": "transit_lines",
  paint: {
    "line-width": ["interpolate", ["linear"], ["zoom"], 9, 0.75, 12, 3],
    "line-color": "#F3F9D2",
  },
};

////
// Circuit Analysis Layers
////
const circuitSource = {
  type: "geojson",
  data: circuitTourism,
};
const circuitAnalysisLayer = {
  id: "circuit-trails",
  type: "line",
  source: circuitSource,
  paint: {
    "line-width": 2.5,
    "line-color": [
      "match",
      ["get", "CIRCUIT"],
      "Existing",
      "#8ec73d",
      "In Progress",
      "#fdae61",
      "Planned",
      "#2e9ba8",
      "Pipeline",
      "#b144a5",
      "#fff",
    ],
  },
};
const circuitExistingLayer = {
  id: "circuit-trails-existing",
  type: "line",
  source: circuitSource,
  paint: {
    "line-width": 2.5,
    "line-color": [
      "match",
      ["get", "CIRCUIT"],
      "Existing",
      "#8ec73d",
      "In Progress",
      "#fdae61",
      "Planned",
      "#2e9ba8",
      "rgb(136, 137, 140)",
    ],
  },
};
