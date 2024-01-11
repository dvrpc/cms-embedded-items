var url = "https://dvrpc.github.io/cms-embedded-items/ceds/regions.xlsx";
var file = await (await fetch(url)).arrayBuffer();
var workbook = XLSX.read(file);
var autocolors = window["chartjs-plugin-autocolors"];
Chart.register(autocolors);

var worksheet = workbook.Sheets["summary"];
var raw_data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
raw_data = raw_data.slice(1);

var total = new Chart(document.getElementById("total"), {
  type: "bar",
  data: {
    labels: raw_data.map((row) => row[0]),
    datasets: [
      {
        label: "null",
        data: raw_data.map((row) => row[1] * 100),
      },
    ],
  },
  options: {
    maintainAspectRatio: false,
    layout: {
      autoPadding: false,
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          callback: function (value, index, ticks) {
            return value + "%";
          },
        },
      },
    },
    plugins: {
      autocolors: {
        mode: "label",
      },
      legend: {
        display: false,
      },

      tooltip: {
        callbacks: {
          label: function (context) {
            var row = raw_data.filter((row) => row[0] === context.label)[0];
            var val = `Competitive Employment: ${row[1].toLocaleString(
              undefined,
              {
                style: "percent",
                minimumFractionDigits: 1,
              }
            )}`;
            return [val];
          },
        },
      },
    },
  },
});

var automation = new Chart(document.getElementById("automation"), {
  type: "bar",
  data: {
    labels: raw_data.map((row) => row[0]),
    datasets: [
      {
        label: "High Automation",
        data: raw_data.map((row) => row[4] * 100),
        backgroundColor: "#662d91",
      },
      {
        label: "Medium Automation",
        data: raw_data.map((row) => row[3] * 100),
        backgroundColor: "#ed5537",
      },
      {
        label: "Low Automation",
        data: raw_data.map((row) => row[2] * 100),
        backgroundColor: "#cfb7e5",
      },
    ],
  },
  options: {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = (context.raw / 100).toLocaleString("en-GB", {
              style: "percent",
              minimumFractionDigits: 1,
            });
            return `${context.dataset.label}: ${value}`;
          },
        },
      },
    },
    tooltips: {
      enabled: true,
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        min: 0,
        max: 100,
        stacked: true,
        ticks: {
          callback: function (value, index, ticks) {
            return value + "%";
          },
        },
      },
    },
    maintainAspectRatio: false,
    layout: {
      autoPadding: false,
    },
  },
});

var telework = new Chart(document.getElementById("telework"), {
  type: "bar",
  data: {
    labels: raw_data.map((row) => row[0]),
    datasets: [
      {
        label: "High Telework",
        data: raw_data.map((row) => row[7] * 100),
        backgroundColor: "#662d91",
      },
      {
        label: "Medium Telework",
        data: raw_data.map((row) => row[6] * 100),
        backgroundColor: "#f7941d",
      },
      {
        label: "Low Telework",
        data: raw_data.map((row) => row[5] * 100),
        backgroundColor: "#cfb7e5",
      },
    ],
  },
  options: {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = (context.raw / 100).toLocaleString("en-GB", {
              style: "percent",
              minimumFractionDigits: 1,
            });
            return `${context.dataset.label}: ${value}`;
          },
        },
      },
    },
    tooltips: {
      enabled: true,
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        min: 0,
        max: 100,
        stacked: true,
        ticks: {
          callback: function (value, index, ticks) {
            return value + "%";
          },
        },
      },
    },
    maintainAspectRatio: false,
    layout: {
      autoPadding: false,
    },
  },
});
