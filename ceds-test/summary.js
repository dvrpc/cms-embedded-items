import { workbook } from "./globals.js";
import { geographySelect, regionsMap } from "./index.js";

var worksheet = workbook.Sheets["summary"];
var raw_data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
raw_data = raw_data.slice(1);

var total;
var prevTotal;

function updateTotal() {
  if (total) total.destroy();

  prevTotal = document.getElementById(geographySelect.value);

  total = new Chart(document.getElementById("total-chart"), {
    type: "bar",
    data: {
      labels: raw_data.map((row) => row[0]),
      datasets: [
        {
          data: raw_data.map((row) => row[1] * 100),
          backgroundColor: function (context) {
            return regionsMap[Object.keys(regionsMap)[context.dataIndex]] ===
              regionsMap[geographySelect.value] || context.dataIndex === 0
              ? "#662D91"
              : "#662D9170";
          },
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
}

var automation;
var prevAutomation;

function updateAutomation() {
  if (automation) automation.destroy();

  prevAutomation = document.getElementById(geographySelect.value);

  automation = new Chart(document.getElementById("automation-chart"), {
    type: "bar",
    data: {
      labels: raw_data.map((row) => row[0]),
      datasets: [
        {
          label: "High Automation",
          data: raw_data.map((row) => row[4] * 100),
          backgroundColor: function (context) {
            return regionsMap[Object.keys(regionsMap)[context.dataIndex]] ===
              regionsMap[geographySelect.value] || context.dataIndex === 0
              ? "#ED5565"
              : "#ED556570";
          },
        },
        {
          label: "Medium Automation",
          data: raw_data.map((row) => row[3] * 100),
          backgroundColor: function (context) {
            return regionsMap[Object.keys(regionsMap)[context.dataIndex]] ===
              regionsMap[geographySelect.value] || context.dataIndex === 0
              ? "#F7941D"
              : "#F7941D70";
          },
        },
        {
          label: "Low Automation",
          data: raw_data.map((row) => row[2] * 100),
          backgroundColor: function (context) {
            return regionsMap[Object.keys(regionsMap)[context.dataIndex]] ===
              regionsMap[geographySelect.value] || context.dataIndex === 0
              ? "#2B1956"
              : "#2B195670";
          },
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
}

var telework;
var prevTelework;

function updateTelework() {
  if (telework) telework.destroy();

  prevTelework = document.getElementById(geographySelect.value);

  telework = new Chart(document.getElementById("telework-chart"), {
    type: "bar",
    data: {
      labels: raw_data.map((row) => row[0]),
      datasets: [
        {
          label: "High Telework",
          data: raw_data.map((row) => row[7] * 100),
          backgroundColor: function (context) {
            return regionsMap[Object.keys(regionsMap)[context.dataIndex]] ===
              regionsMap[geographySelect.value] || context.dataIndex === 0
              ? "#ED5565"
              : "#ED556570";
          },
        },
        {
          label: "Medium Telework",
          data: raw_data.map((row) => row[6] * 100),
          backgroundColor: function (context) {
            return regionsMap[Object.keys(regionsMap)[context.dataIndex]] ===
              regionsMap[geographySelect.value] || context.dataIndex === 0
              ? "#F7941D"
              : "#F7941D70";
          },
        },
        {
          label: "Low Telework",
          data: raw_data.map((row) => row[5] * 100),
          backgroundColor: function (context) {
            return regionsMap[Object.keys(regionsMap)[context.dataIndex]] ===
              regionsMap[geographySelect.value] || context.dataIndex === 0
              ? "#2B1956"
              : "#2B195670";
          },
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
}

export { updateTotal, updateTelework, updateAutomation };
