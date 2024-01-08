const url = "https://dvrpc.github.io/cms-embedded-items/ceds/regions.xlsx";
var file = await (await fetch(url)).arrayBuffer();
var workbook = XLSX.read(file);

var regionsMap = {
  dvrpc: "DVRPC",
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

var geographySelect = document.getElementById("geography");
workbook.SheetNames.slice(1).map((name) => {
  var option = document.createElement("option");
  option.value = name;
  option.innerHTML = regionsMap[name];
  geographySelect.appendChild(option);
});

var chart;

function updateChart() {
  if (chart) chart.destroy();
  document.getElementById("geography-header").textContent =
    regionsMap[geographySelect.value];
  var worksheet = workbook.Sheets[geographySelect.value];
  var raw_data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  raw_data = raw_data.filter((row) => parseInt(row[3]));
  var maxRadius = Math.max(...raw_data.map((row) => row[3]));

  chart = new Chart(document.getElementById("bubble"), {
    type: "bubble",
    data: {
      labels: raw_data.map((row) => row[0]),
      datasets: [
        {
          label: "null",
          data: raw_data.map((row) => ({
            x: (row[1] * 100).toFixed(1),
            y: (row[2] * 100).toFixed(1),
            r: Math.round((row[3] / maxRadius) * 650),
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
              const row = raw_data.filter((row) => row[0] === context.label)[0];
              const total = `Employment: ${row[3].toLocaleString()}`;
              const lq = `LQ: ${row[4]}`;
              return [total, lq];
            },
          },
        },
      },
    },
  });
}

geographySelect.addEventListener("change", updateChart);
updateChart();
