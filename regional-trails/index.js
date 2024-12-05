// START Map Functions
mapboxgl.accessToken =
  "pk.eyJ1IjoibW1vbHRhIiwiYSI6ImNqZDBkMDZhYjJ6YzczNHJ4cno5eTcydnMifQ.RJNJ7s7hBfrJITOBZBdcOA";

const stylesheet = {
  version: 8,
  sources: {
    boundaries: {
      type: "vector",
      url: "https://tiles.dvrpc.org/data/dvrpc-municipal.json",
    },
  },
  layers: [
    {
      id: "county-fill",
      type: "fill",
      source: "boundaries",
      "source-layer": "county",
      layout: {},
      paint: {
        "fill-color": "#B6C1C6",
        "fill-opacity": 1,
      },
      filter: ["==", "dvrpc", "Yes"],
    },
    {
      id: "dvrpcnt",
      type: "fill",
      source: "boundaries",
      "source-layer": "county",
      layout: {},
      paint: {
        "fill-color": "#B6C1C6",
        "fill-opacity": 0.2,
      },
      filter: ["!=", "dvrpc", "Yes"],
    },
    {
      id: "municipality-outline",
      type: "line",
      source: "boundaries",
      "source-layer": "municipalities",
      paint: {
        "line-width": 0.5,
        "line-color": "#efefef",
      },
    },
    {
      id: "county-outline",
      type: "line",
      source: "boundaries",
      "source-layer": "county",
      paint: {
        "line-width": 2.5,
        "line-color": "#fff",
      },
    },
  ],
};

const map = new mapboxgl.Map({
  container: "map",
  style: stylesheet,
  attributionControl: false,
  center: [-75.2273, 40.071],
  zoom: 3,
});

map.fitBounds([
  [-76.09405517578125, 39.49211914385648],
  [-74.32525634765625, 40.614734298694216],
]);

const generatePopup = function (e) {
  const props = e.features[0].properties;
  const award = props.award.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  new mapboxgl.Popup({
    closebutton: true,
    closeOnClick: true,
  })

    .setLngLat(e.lngLat)

    .setHTML(
      `
        <h3 class="popup-header">${props.name}</h3>
        <ul class="popup-list">
            <li><span class="popup-prop">Award:</span> ${award}</li>
            <li><span class="popup-prop">Phase:</span> ${props.phase}</li>
            <li><span class="popup-prop">Type:</span> ${props.type}</li>
            <li><span class="popup-prop">Length:</span> ${props.length.toFixed(2)} miles</li>
            <li><span class="popup-prop">Sponsor:</span> ${props.sponsor}</li>
            <li><span class="popup-prop">Municipality:</span> ${props.municipality}</li>
            <li><span class="popup-prop">County:</span> ${props.county}</li>
        </ul>
    `,
    )
    .addTo(map);
};

map.on("load", function () {
  map.addSource("trails", {
    type: "geojson",
    data: "https://arcgis.dvrpc.org/portal/rest/services/Transportation/RegionalTrailsProgram/FeatureServer/0/query?where=1=1&outfields=*&outsr=4326&f=geojson",
  });
  map.addLayer({
    id: "trail-lines",
    type: "line",
    source: "trails",
    layout: {},
    paint: {
      "line-color": "#82be37",
      "line-width": 4,
    },
  });

  map.on("mousemove", "trail-lines", function () {
    map.getCanvas().style.cursor = "pointer";
  });
  map.on("mouseleave", "trail-lines", function () {
    map.getCanvas().style.cursor = "";
  });

  map.on("click", "trail-lines", function (e) {
    generatePopup(e);
  });
});
// END Map functions

// START sortable list
const tableWrapper = document.getElementById("trailsTableWrapper");

// content creation fncs
const makeTableHeaderContent = (jawns) => {
  const frag = document.createDocumentFragment();

  jawns.forEach((jawn, index) => {
    const th = document.createElement("th");
    th.classList.add("table-header");
    th.textContent = jawn;

    th.onclick = () => sortTable(index);
    frag.appendChild(th);
  });

  return frag;
};
const makeTableBodyContent = (jawns) => {
  const frag = document.createDocumentFragment();

  jawns.forEach((jawn) => {
    const tr = document.createElement("tr");

    for (key in jawn) {
      const td = document.createElement("td");
      td.textContent =
        key === "award"
          ? jawn[key].toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            })
          : jawn[key];
      tr.appendChild(td);
    }

    frag.appendChild(tr);
  });

  return frag;
};
const makeTable = (data) => {
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  table.classList.add("table");

  table.id = "trailsTable";

  const headerData = Object.keys(data[0]);
  const theadContent = makeTableHeaderContent(headerData);
  const tbodyContent = makeTableBodyContent(data);

  thead.appendChild(theadContent);
  tbody.appendChild(tbodyContent);

  table.appendChild(thead);
  table.appendChild(tbody);

  return table;
};

// table sort adapted from: https://www.w3schools.com/howto/howto_js_sort_table.asp
const sortTable = (n) => {
  let rows,
    i,
    x,
    y,
    shouldSwitch,
    switchcount = 0;
  let switching = true;
  let dir = "asc";
  const table = document.getElementById("trailsTable");

  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    for (i = 0; i < rows.length - 1; i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      if (dir == "asc") {
        // brittle solution for currency amounts. **ONLY WORKS IF AMOUNT IS 3RD INDEX**
        if (n === 2) {
          const newX = parseInt(x.textContent.substring(1));
          const newY = parseInt(y.textContent.substring(1));

          if (newX > newY) {
            shouldSwitch = true;
            break;
          }
        } else {
          if (x.textContent.toLowerCase() > y.textContent.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
      } else if (dir == "desc") {
        // brittle solution for currency amounts. **ONLY WORKS IF AMOUNT IS 3RD INDEX**
        if (n === 2) {
          const newX = parseInt(x.textContent.substring(1));
          const newY = parseInt(y.textContent.substring(1));

          if (newX < newY) {
            shouldSwitch = true;
            break;
          }
        } else {
          // @TODO: account for awards
          if (x.textContent.toLowerCase() < y.textContent.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount++;
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
};

try {
  fetch(
    'https://arcgis.dvrpc.org/portal/rest/services/Transportation/RegionalTrailsProgram/FeatureServer/0/query?where=1=1&outfields="county,sponsor,award,name,year"&outsr=4326&returnGeometry=false&f=pjson',
  )
    .then((response) => response.json())
    .then((result) => {
      // extract features
      const features = result.features.map((feature) => feature.attributes);
      const table = makeTable(features);

      tableWrapper.appendChild(table);
    })
    .then(() => {
      const waitInterval = setInterval(function () {
        console.log("parentIframe" in window);
        if (window.parentIFrame) {
          parentIframe.resize();
          clearInterval(waitInterval);
        }
      }, 100);
    });
} catch (error) {
  console.log(error);
  const p = document.createElement("p");
  p.textContent =
    "Sorry, the trails table data could not be fetched. Please refresh or try again later.";
  tableWrapper.appendChild(p);
}
