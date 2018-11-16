// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = {
  top: 30,
  right: 30,
  bottom: 30,
  left: 30
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and down to adhere
// to the margins set in the "chartMargin" object.
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Load data from hours-of-tv-watched.csv
d3.csv("assets/data/data.csv", function (error, Data) {

  // Log an error if one exists
  if (error) throw error;

  // Print the tvData
  console.log(Data);

  // Cast the hours value to a number for each piece of tvData
  Data.forEach(function (data) {
    data.healthcareLow = +data.healthcareLow;
    data.poverty = +data.poverty;
  });

  //Create a scale for your independent (x) coordinates
  var xScale = d3.scaleLinear()
    .domain(d3.extent(Data, d => d.poverty))
    .range([0, svgWidth])

  //Create a scale for your dependent (y) coordinates
  var yScale = d3.scaleLinear()
    .domain([0, d3.max(Data, d => d.healthcareLow)])
    .range([svgHeight, 0])
  

  // Create axis functions
  var bottomAxis = d3.axisBottom(xScale);
  var leftAxis = d3.axisLeft(yScale);

  // SAppend Axes to the chart
  chartGroup.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

  // Create Circles
  var circlesGroup = chartGroup.selectAll("circle")
  .data(Data)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.poverty))
  .attr("cy", d => yLinearScale(d.healthcareLow))
  .attr("r", "15")
  .attr("fill", "blue")
  .attr("opacity", ".5")

  // Create axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Lacks Healthcare (%)");

  chartGroup.append("text")
    .attr("transform", `translate(${width/2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("In Poverty (%)");

  
});
