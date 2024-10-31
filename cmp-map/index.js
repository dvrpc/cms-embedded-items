const urlParams = new URLSearchParams(window.location.search);
const state = urlParams.get("state") && urlParams.get("state").toUpperCase();
const corridor = urlParams.get("corridor");
const subCorridor =
  urlParams.get("subcorridor") && urlParams.get("subcorridor").toUpperCase();

mapboxgl.accessToken =
  "pk.eyJ1IjoidGhhY2hhZG9yaWFuZHZycGMiLCJhIjoiY2x6Ymw5bjNoMDIxdTJscHJlbDMxMzM1ZyJ9.AZoU09L4abDOTWEUM5Uwdw";
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/crvanpollard/clmqidmqj04uh01ma2mkla3yz",
});

map.on("load", async () => {
  const reqString = `https://arcgis.dvrpc.org/portal/rest/services/Transportation/cmp2023_corridorareas/FeatureServer/0/query?where=state%3D%27${state}%27+and+corridor%3D%27${corridor + (subCorridor ? subCorridor : "A")}%27&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Foot&relationParam=&outFields=&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&havingClause=&gdbVersion=&historicMoment=&returnDistinctValues=false&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&multipatchOption=xyFootprint&resultOffset=&resultRecordCount=&returnTrueCurves=false&returnExceededLimitFeatures=false&quantizationParameters=&returnCentroid=false&timeReferenceUnknownClient=false&sqlFormat=none&resultType=&featureEncoding=esriDefault&datumTransformation=&f=geojson`;
  const req = await fetch(reqString);
  const res = await req.json();
  const feature = res.features[0];

  map.addSource("cmp", {
    type: "geojson",
    data: feature,
  });
  map.addLayer({
    id: "cmp",
    type: "line",
    source: "cmp",
    paint: {
      "line-width": 3,
      "line-color": "#0079ad",
    },
  });

  const featurebbox = turf.bbox(feature);
  const [minX, minY, maxX, maxY] = featurebbox;
  minX &&
    map.fitBounds(
      [
        [minX, minY],
        [maxX, maxY],
      ],
      {
        maxZoom: 12,
        padding: 5,
        duration: 0,
      },
    );
});
