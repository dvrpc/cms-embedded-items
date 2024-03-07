import { workbook } from "./globals.js";
import { updateChart } from "./comparison.js";
import { updateTotal, updateTelework, updateAutomation } from "./summary.js";

var regionsMap = {
  undefined: "Greater Philadelphia",
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
workbook.SheetNames.slice(2, -2).map((name) => {
  var option = document.createElement("option");
  option.value = name;
  option.innerHTML = regionsMap[name];
  geographySelect.appendChild(option);
});

geographySelect.addEventListener("change", () => {
  updateChart();
  updateTotal();
  updateTelework();
  updateAutomation();
});
updateChart();
updateTotal();
updateTelework();
updateAutomation();

export { regionsMap, geographySelect };
