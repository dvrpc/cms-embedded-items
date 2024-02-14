const url = "https://dvrpc.github.io/cms-embedded-items/ceds/regions.xlsx";
var file = await (await fetch(url)).arrayBuffer();
var workbook = XLSX.read(file);

var regionsMap = {
  ATL: "Atlanta",
  BAL: "Baltimore",
  BOS: "Boston",
  CHI: "Chicago",
  DAL: "Dallas",
  LAX: "Los Angeles",
  NYC: "New York",
  PIT: "Pittsburgh",
  WAS: "Washington",
};

var colors = {
  51: "#989A9B99",
  61: "#4B743699",
  54: "#74985F99",
  55: "#8CBC7399",
  52: "#F8952199",
  56: "#F36F3199",
  53: "#EA563799",
  62: "#27255E99",
  22: "#4D318999",
  31: "#9D83BC99",
  42: "#A8449999",
  81: "#66318C99",
  71: "#6566AE99",
  23: "#454DA199",
  48: "#D11F4599",
  44: "#D21C8B99",
  72: "#AA272599",
};

var geographySelect = document.getElementById("geography");
workbook.SheetNames.slice(2, -2).map((name) => {
  var option = document.createElement("option");
  option.value = name;
  option.innerHTML = regionsMap[name];
  geographySelect.appendChild(option);
});

var dvrpcWorksheet = workbook.Sheets["dvrpc"];
var dvrpc_data = XLSX.utils.sheet_to_json(dvrpcWorksheet, { header: 1 });
dvrpc_data = dvrpc_data.filter((row) => parseInt(row[4])).slice(0, -2);
var maxRadius = Math.max(...dvrpc_data.map((row) => row[4]));

var dvrpcChart = new Chart(document.getElementById("bubble-dvrpc"), {
  type: "bubble",
  data: {
    labels: dvrpc_data.map((row) => row[1]),
    datasets: [
      {
        label: "null",
        data: dvrpc_data.map((row) => ({
          x: (row[2] * 100).toFixed(1),
          y: (row[3] * 100).toFixed(1),
          r: Math.round((row[4] / maxRadius) * 55),
          category: row[0],
        })),
      },
    ],
  },
  options: {
    maintainAspectRatio: false,
    layout: {
      autoPadding: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const row = dvrpc_data.filter((row) => row[1] === context.label)[0];
            const total = `Employment: ${row[4].toLocaleString()}`;
            const lq = `LQ: ${row[5]}`;
            return [total, lq];
          },
        },
      },
    },
    backgroundColor: function (context) {
      return colors[context.raw.category];
    },
  },
});

var chart;
var prev;

function updateChart() {
  if (chart) chart.destroy();
  if (prev) prev.classList.toggle("geography");
  document.getElementById("geography-header").textContent =
    regionsMap[geographySelect.value];
  document.getElementById(geographySelect.value).classList.toggle("geography");
  prev = document.getElementById(geographySelect.value);

  var worksheet = workbook.Sheets[geographySelect.value];
  var raw_data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  raw_data = raw_data.filter((row) => parseInt(row[4]));

  chart = new Chart(document.getElementById("bubble"), {
    type: "bubble",
    data: {
      labels: raw_data.map((row) => row[1]),
      datasets: [
        {
          label: "null",
          data: raw_data.map((row) => ({
            x: (row[2] * 100).toFixed(1),
            y: (row[3] * 100).toFixed(1),
            r: Math.round((row[4] / maxRadius) * 55),
            category: row[0],
          })),
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      layout: {
        autoPadding: false,
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const row = raw_data.filter((row) => row[1] === context.label)[0];
              const total = `Employment: ${row[4].toLocaleString()}`;
              const lq = `LQ: ${row[5]}`;
              return [total, lq];
            },
          },
        },
      },
      backgroundColor: function (context) {
        return colors[context.raw.category];
      },
    },
  });
}

geographySelect.addEventListener("change", updateChart);
updateChart();
