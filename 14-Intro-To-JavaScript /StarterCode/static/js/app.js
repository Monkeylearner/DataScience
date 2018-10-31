// from data.js
var tableData = data;

// Get a reference to the table body
var tbody = d3.select("tbody");

function renderTable(table) {
    table.forEach((sightings) => {
        var row = tbody.append("tr");
        Object.entries(sightings).forEach(([key, value]) => {
            var cell = tbody.append("td");
            cell.text(value);
        });
    });
}

renderTable(tableData);

//Select the filter table button
var filter = d3.select("#filter-btn");
filter.on("click", function() {
  // Prevent the page from refreshing
  d3.event.preventDefault();
  
  // Get the value property of the input element
  var inputValueDate = d3.select("#datetime").property("value");

  // Filtered data
  var filteredData = tableData.filter(info =>
  	info.datetime === inputValueDate);

  // Clear table and message if it exists
  tbody.html("");
  d3.select("span").html("");

  if(filteredData === undefined || filteredData.length == 0) {
        d3.select("span").text("Sorry, no UFO sightings for the selection filter(s)!").style("font-size", "20px");
    }
    else {
        // Display new table with filtered data
        renderTable(filteredData);
    }

    //Clear filters
    d3.select("#datetime").node().value = "";
});

// Select the Reset button
var filter = d3.select("#un-filter-btn");
filter.on("click", function() {
    // Prevent the page from refreshing
    d3.event.preventDefault();

    // Clear table and message if it exists
    tbody.html("");
    d3.select("span").html("");
    
    // Rebuild full table
    renderTable(tableData);
})