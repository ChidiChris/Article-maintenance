/*Step 1: Data Collection
The first step is to collect data on the evolution of Wikipedia articles maintained by
WikiProjects. You can use the Wikipedia API to retrieve this data.*/

const request = require("request");

const url = "https://en.wikipedia.org/w/api.php";
const params = {
  action: "query",
  format: "json",
  prop: "revisions",
  rvprop: "content",
  titles: "Example_page",
  formatversion: 2,
};

request.get({ url, qs: params }, (err, res, body) => {
  if (err) {
    console.error(err);
    return;
  }

  const data = JSON.parse(body);
  const revisions = data.query.pages[0].revisions;
  // Do something with the revisions
});

/* Step 2: Data Processing
Once you have collected the data, you need to process it to extract the information you want to visualize. 
For example, you might want to extract the number of edits made to each article over time, the number of contributors, or the length of the article.

 */

const revisionDates = revisions.map((revision) => new Date(revision.timestamp));
const editCounts = revisionDates.reduce((acc, date) => {
  const day = date.toISOString().slice(0, 10);
  if (!acc[day]) {
    acc[day] = 0;
  }
  acc[day]++;
  return acc;
}, {});
/* This code extracts the timestamp from each revision, converts it to a date object, and extracts the date (ignoring the time).
It then counts the number of revisions made on each day. */

/* Step 3: Data Visualization
Once you have processed the data, you can use a JavaScript library like D3.js to visualize it.
Here's an example of how to create a line chart using D3.js:

 */

const margin = { top: 20, right: 20, bottom: 30, left: 50 };
const width = 960 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const x = d3
  .scaleTime()
  .domain(d3.extent(editCounts, (d) => new Date(d.date)))
  .range([0, width]);

const y = d3
  .scaleLinear()
  .domain([0, d3.max(editCounts, (d) => d.count)])
  .range([height, 0]);

const line = d3
  .line()
  .x((d) => x(new Date(d.date)))
  .y((d) => y(d.count));

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("path").datum(editCounts).attr("class", "line").attr("d", line);

svg
  .append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));

svg.append("g").attr("class", "y axis").call(d3.axisLeft(y));
