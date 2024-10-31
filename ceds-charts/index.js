// config
const addTooltipPercent = (context) =>
  `${context.dataset.label}: ${context.parsed.y}%`;
const addTooltipCommas = (context) =>
  `${context.dataset.label}: ${context.parsed.y.toLocaleString()}`;

// avoid Date obj month indexing shenanigans + easy shorthand
const dateLookup = {
  "01": "Jan",
  "02": "Feb",
  "03": "Mar",
  "04": "Apr",
  "05": "May",
  "06": "June",
  "07": "July",
  "08": "Aug",
  "09": "Sept",
  10: "Oct",
  11: "Nov",
  12: "Dec",
};

const formatDate = (value) => {
  const valArr = value.split("-");
  const month = dateLookup[valArr[1]];
  const year = valArr[0];

  return `${month} ${year}`;
};

const chartMeta = {
  inflation: {
    type: "line",
    endpoint: "cpi-recent?years=2",
    options: {
      plugins: {
        tooltip: {
          callbacks: {
            label: (context) => addTooltipPercent(context),
            title: (context) => formatDate(context[0].label),
          },
        },
      },
      scales: {
        y: {
          ticks: {
            callback: (value) => value + "%",
          },
        },
        x: {
          ticks: {
            callback: function (value) {
              const val = this.getLabelForValue(value);
              return formatDate(val);
            },
          },
        },
      },
    },
  },
  unemployment: {
    type: "line",
    endpoint: "unemployment-recent?years=2",
    options: {
      plugins: {
        tooltip: {
          callbacks: {
            label: (context) => addTooltipPercent(context),
            title: (context) => formatDate(context[0].label),
          },
        },
      },
      scales: {
        y: {
          ticks: {
            callback: (value) => value + "%",
          },
        },
        x: {
          ticks: {
            callback: function (value) {
              const val = this.getLabelForValue(value);
              return formatDate(val);
            },
          },
        },
      },
    },
  },
  housing: {
    type: "line",
    endpoint: "housing",
    options: {
      plugins: {
        tooltip: {
          callbacks: {
            label: (context) => addTooltipCommas(context),
            title: (context) => formatDate(context[0].label),
          },
        },
      },
      scales: {
        x: {
          ticks: {
            callback: function (value) {
              const val = this.getLabelForValue(value);
              return formatDate(val);
            },
          },
        },
      },
    },
  },
  employmentYear: {
    type: "bar",
    endpoint: "employment-by-industry",
    options: {
      indexAxis: "y",
    },
    responsive: true,
  },
  employmentTwoYear: {
    type: "bar",
    endpoint: "employment-by-industry",
    options: {
      indexAxis: "y",
    },
    responsive: true,
  },
};

// color palette:
// purple: #673091
// orange: #f8a440
// greenish: #69A297
// pink: #D56AA0

// charting functions
const makeInflationChart = (response) => {
  let phillyLabel = "";
  let usLabel = "";
  const phillyData = [];
  const usData = [];
  const labels = [];

  // convoluted sort script because Chrome can't hang
  response
    .sort((a, b) => +new Date(a.period) - +new Date(b.period))
    .forEach((data) => {
      switch (data.area) {
        case "Philadelphia MSA":
          phillyData.push(data.rate);
          phillyLabel = data.area;
          break;

        default:
          usData.push(data.rate);
          usLabel = data.area;
          labels.push(data.period);
      }
    });

  return {
    labels,
    datasets: [
      {
        label: phillyLabel,
        data: phillyData,
        fill: false,
        tension: 0.2,
        borderColor: "#673091",
      },
      {
        label: usLabel,
        data: usData,
        fill: false,
        tension: 0.2,
        borderColor: "#f8a440",
      },
    ],
  };
};

const makeUnemploymentChart = (response) => {
  let phillyLabel = "";
  let usLabel = "";
  let trentonLabel = "";
  const phillyData = [];
  const usData = [];
  const trentonData = [];
  const labels = [];

  // convoluted sort script because Chrome can't hang
  response
    .sort((a, b) => +new Date(a.period) - +new Date(b.period))
    .forEach((data) => {
      switch (data.area) {
        case "Philadelphia MSA":
          phillyData.push(data.rate);
          phillyLabel = data.area;
          break;

        case "United States":
          usData.push(data.rate);
          usLabel = data.area;
          break;

        default:
          trentonData.push(data.rate);
          trentonLabel = data.area;
          labels.push(data.period);
      }
    });

  return {
    labels,
    datasets: [
      {
        label: phillyLabel,
        data: phillyData,
        fill: false,
        tension: 0.2,
        borderColor: "#673091",
      },
      {
        label: usLabel,
        data: usData,
        fill: false,
        tension: 0.2,
        borderColor: "#f8a440",
      },
      {
        label: trentonLabel,
        data: trentonData,
        fill: false,
        tension: 0.2,
        borderColor: "#69A297",
      },
    ],
  };
};

const makeHousingChart = (response) => {
  const labels = [];
  const units = [];
  const length = response.length;
  const lastTwelve = length - 12;
  const responseYear = response.slice(lastTwelve, length);

  responseYear.forEach((data) => {
    labels.push(data.period);
    units.push(data.units);
  });

  return {
    labels,
    datasets: [
      {
        label: "Housing Units",
        data: units,
        tension: 0.2,
        fill: false,
        borderColor: "#D56AA0",
      },
    ],
  };
};

// @NOTE: special return here to include dynamic dates
const makeEmploymentYearChart = (response, changeYears) => {
  const current = Object.keys(response)[0];
  const labels = Object.keys(response[current]);

  let phillyLabel = "Philadelphia MSA";
  let trentonLabel = "Trenton MSA";
  const phillyData = [];
  const trentonData = [];

  Object.entries(response[current]).forEach((data) => {
    const vals = data[1];

    phillyData.push(vals[phillyLabel][changeYears]);
    trentonData.push(vals[trentonLabel][changeYears]);
  });

  // remove total nonfarm from each
  labels.pop();
  phillyData.pop();
  trentonData.pop();

  const data = {
    labels,
    datasets: [
      {
        label: phillyLabel,
        data: phillyData,
        backgroundColor: "#673091",
      },
      {
        label: trentonLabel,
        data: trentonData,
        backgroundColor: "#69A297",
      },
    ],
  };

  return { data, current };
};

const chartObjs = {
  chartMeta,
  makeInflationChart,
  makeUnemploymentChart,
  makeHousingChart,
  makeEmploymentYearChart,
};

const makeTableTopRow = (month) => {
  const tr = document.createElement("tr");

  tr.insertAdjacentHTML(
    "afterbegin",
    `
            <td class="first-row industry-cell">Industry Group</td>
            <td colspan="2" class="centered">${month}</td>
            <td colspan="2" class="centered">Change</td>
            <td colspan="2" class="centered">${month}</td>
            <td colspan="2" class="centered">Change</td>
        `,
  );

  return tr;
};

const makeTableSecondRow = () => {
  const tr = document.createElement("tr");

  tr.insertAdjacentHTML(
    "afterbegin",
    `
            <tr>
                <td></td>
                <td>Number</td>
                <td>Share</td>
                <td>Number</td>
                <td>Percent</td>
                <td>Number</td>
                <td>Share</td>
                <td>Number</td>
                <td>Percent</td>
            </tr>
        `,
  );

  return tr;
};

const makeContentRows = (month, response) => {
  const frag = document.createDocumentFragment();
  const phillyLabel = "Philadelphia MSA";
  const trentonLabel = "Trenton MSA";

  Object.entries(response[month]).forEach((data) => {
    const vals = data[1];

    const tr = document.createElement("tr");
    const title = document.createElement("td");
    const numOne = document.createElement("td");
    const shareOne = document.createElement("td");
    const numTwo = document.createElement("td");
    const percOne = document.createElement("td");
    const numThree = document.createElement("td");
    const shareTwo = document.createElement("td");
    const numFour = document.createElement("td");
    const percTwo = document.createElement("td");

    title.classList.add("first-row");

    title.textContent = data[0];

    //philly
    numOne.textContent = vals[phillyLabel].employment;
    shareOne.textContent = vals[phillyLabel]["share of total"] + "%";
    numTwo.textContent = vals[phillyLabel]["one-year change (number)"];
    percOne.textContent = vals[phillyLabel]["one-year change (percent)"] + "%";

    // trenton
    numThree.textContent = vals[trentonLabel].employment;
    shareTwo.textContent = vals[trentonLabel]["share of total"] + "%";
    numFour.textContent = vals[trentonLabel]["one-year change (number)"];
    percTwo.textContent = vals[trentonLabel]["one-year change (percent)"] + "%";

    tr.appendChild(title);
    tr.appendChild(numOne);
    tr.appendChild(shareOne);
    tr.appendChild(numTwo);
    tr.appendChild(percOne);
    tr.appendChild(numThree);
    tr.appendChild(shareTwo);
    tr.appendChild(numFour);
    tr.appendChild(percTwo);

    frag.appendChild(tr);
  });

  return frag;
};

const makeTable = (response) => {
  const tBody = document.getElementById("employment-table-body");
  const sectionSubheader =
    tBody.parentElement.parentElement.parentElement.firstElementChild;

  const month = Object.keys(response)[0];

  const topRow = makeTableTopRow(month);
  const secondRow = makeTableSecondRow();
  const contentRows = makeContentRows(month, response);

  // add table content
  tBody.appendChild(topRow);
  tBody.appendChild(secondRow);
  tBody.appendChild(contentRows);

  // update section area header
  sectionSubheader.insertAdjacentHTML(
    "beforeend",
    `<br>${month} <small>(1,000s of jobs)</small>`,
  );
};

const getData = async (endpoint) => {
  try {
    const stream = await fetch(
      `https://cloud.dvrpc.org/api/econ-data/v1/${endpoint}`,
    );
    return stream.json();
  } catch {
    return false;
  }
};

const charts = document.querySelectorAll(".chart");
const l = charts.length;
let i = 0;

// make charts
for (i; i < l; i++) {
  const chartEl = charts[i];
  const ctx = chartEl.getContext("2d");
  const chartID = chartEl.id.split("-")[0];
  const chartConfig = chartObjs.chartMeta[chartID];

  try {
    getData(chartConfig.endpoint).then((data) => {
      switch (chartID) {
        case "unemployment":
          chartConfig.data = chartObjs.makeUnemploymentChart(data);
          break;

        case "housing":
          chartConfig.data = chartObjs.makeHousingChart(data);
          break;

        // @TODO reduce calls by making this 1 jawn
        // rn making 3 calls to the same endpoint (two here + for the table)
        case "employmentYear":
          const outputYear = chartObjs.makeEmploymentYearChart(
            data,
            "one-year change (number)",
          );
          const title = chartEl.parentElement.firstElementChild;

          chartConfig.data = outputYear.data;
          title.insertAdjacentHTML(
            "beforeend",
            `<br>${outputYear.current} <small>(1,000s of jobs)</small>`,
          );
          break;

        case "employmentTwoYear":
          const outputTwoYear = chartObjs.makeEmploymentYearChart(
            data,
            "two-year change (number)",
          );
          const twoYearTitle = chartEl.parentElement.firstElementChild;

          chartConfig.data = outputTwoYear.data;
          twoYearTitle.insertAdjacentHTML(
            "beforeend",
            `<br>${outputTwoYear.current} <small>(1,000s of jobs)</small>`,
          );

          break;

        default:
          chartConfig.data = chartObjs.makeInflationChart(data);
      }

      new Chart(ctx, chartConfig);
    });
  } catch (error) {
    console.error(error);
  }
}

// make employment table
// API call in table.js throws error 'await is a reserved identifier' so making it here...
try {
  const bruh = getData("employment-by-industry").then((data) =>
    makeTable(data),
  );
} catch (error) {
  console.error(error);
}
