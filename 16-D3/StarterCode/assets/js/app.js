// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);

// When the browser loads, makeResponsive() is called.
makeResponsive();

function makeResponsive() {
    // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the chart
    var svgArea = d3.select("body").select("svg");
    // clear svg is not empty
    if (!svgArea.empty()) {
        svgArea.remove();
    }
  
    var svgWidth = 960;
    var svgHeight = 500;

    var chartmargin = {
        top: 40,
        right: 40,
        bottom: 80,
        left: 100
    };

    var chartwidth = svgWidth - chartmargin.left - chartmargin.right;
    var chartheight = svgHeight - chartmargin.top - chartmargin.bottom;

    // Create an SVG wrapper, append an SVG group that will hold our chart,
    // and shift the latter by left and top margins.
    var svg = d3
        .select("#scatter")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    // Append an SVG group
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${chartmargin.left}, ${chartmargin.top})`);

    // Initial Params
    var chosenXAxis = "poverty";
    var chosenYAxis = "healthcare";

    // function used for updating x-scale var upon click on axis label
    function xScale(healthData, chosenXAxis) {
        // create scales
        var xLinearScale = d3.scaleLinear()
            .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.8,
            d3.max(healthData, d => d[chosenXAxis]) * 1.2
            ])
            .range([0, chartwidth]);

        return xLinearScale;
    }

    // function used for updating y-scale var upon click on axis label
    function yScale(healthData, chosenYAxis) {
        // create scales
        var yLinearScale = d3.scaleLinear()
            .domain([d3.min(healthData, d => d[chosenYAxis]) * 0.8,
            d3.max(healthData, d => d[chosenYAxis]) * 1.2
            ])
            .range([chartheight, 0]);

        return yLinearScale;
    }

    // function used for updating xAxis var upon click on axis label
    function renderXAxis(newXScale, xAxis) {
        var bottomAxis = d3.axisBottom(newXScale);

        xAxis.transition()
            .duration(1000)
            .call(bottomAxis);

        return xAxis;
    }

    // function used for updating yAxis var upon click on axis label
    function renderYAxis(newYScale, yAxis) {
        var leftAxis = d3.axisLeft(newYScale);

        yAxis.transition()
            .duration(1000)
            .call(leftAxis);

        return yAxis;
    }

    // function used for updating circles group with a transition to
    // new circles when clicking on new axis
    function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
        circlesGroup.transition()
            .duration(1000)
            .attr("cx", d => newXScale(d[chosenXAxis]))
            .attr("cy", d => newYScale(d[chosenYAxis]));
        return circlesGroup;
    }

    // function used for updating the text in the circles group with a transition to
    // new circles when clicking on new axis
    function renderText(textGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
        textGroup.transition()
            .duration(1000)
            .attr("x", d => newXScale(d[chosenXAxis]))
            .attr("y", d => newYScale(d[chosenYAxis])+6);
        return textGroup;
    }

    // function used for updating circles group with new tooltip
    function updateToolTip(chosenXAxis, chosenYAxis, textGroup) {

        if (chosenXAxis === "poverty") {
            var xlabel = "In Poverty:";
        }
        else if (chosenXAxis === "age") {
            var xlabel = "Median Age:";
        }
        else {
            var xlabel = "Median Income:";
        }

        if (chosenYAxis === "healthcare") {
            var ylabel = "Lack Healthcare:";
        }
        else if (chosenYAxis === "smokes") {
            var ylabel = "Smoke";
        }
        else {
            var ylabel = "Obese";
        }

        var toolTip = d3.tip()
            .attr("class", "d3-tip")
            .offset([-8, 0])
            .html(function(d) {
            return (`${d.state}<br>${xlabel} ${d[chosenXAxis]}<br>${ylabel} ${d[chosenYAxis]}%`);
            });

        textGroup.call(toolTip);

        textGroup.on("mouseover", function(data) {
            toolTip.show(data, this);
        })
            // onmouseout event
            .on("mouseout", function(data, index) {
            toolTip.hide(data);
            });

        return textGroup;
    }

    // Import Data from csv file
    var file = "assets/data/data.csv"
    d3.csv(file).then(fileData, exception);

    function exception(error){
        throw err;
    }

    function fileData(healthData) {

        // Step 1: Parse Data/Cast as numbers
        // ==============================
        healthData.forEach(function(data) {
            data.poverty = +data.poverty;
            data.healthcare = +data.healthcare;
            data.age = +data.age;
            data.income = +data.income;
            data.obesity = +data.obesity;
            data.smokes = +data.smokes;
        });

        // Step 2: Create scale functions
        // ==============================
        var xLinearScale = xScale(healthData, chosenXAxis);
        var yLinearScale = yScale(healthData, chosenYAxis);

        // Step 3: Create axis functions
        // ==============================
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        // Step 4: Append Axes to the chart
        // ==============================
        var xAxis = chartGroup.append("g")
            .classed("x-axis", true)
            .attr("transform", `translate(0, ${chartheight})`)
            .call(bottomAxis);

        var yAxis = chartGroup.append("g")
            .classed("y-axis", true)
            .call(leftAxis);

        // Step 5: Create Circles
        // ==============================
        var circlesGroup = chartGroup.selectAll("circle")
            .data(healthData)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d[chosenXAxis]))
            .attr("cy", d => yLinearScale(d[chosenYAxis]))
            .attr("r", "15")
            .attr("fill", "red")
            .attr("opacity", ".75");

        var textGroup = chartGroup.selectAll(".label")
            .data(healthData)
            .enter()
            .append("text")
            .attr("class", "label")
            .attr("text-anchor", "middle")
            .text(function(d) {return d.abbr;})
            .attr("x", d => xLinearScale(d[chosenXAxis]))
            .attr("y", d => yLinearScale(d[chosenYAxis])+6)
            .attr("fill", "white")
            .attr("font-family","Tahoma", "Geneva", "sans-serif")
            .attr("font-size",9);


        // Create group for 3 y-axis labels
        var ylabelsGroup = chartGroup.append("g")
            .attr("transform", "rotate(-90)")
            .attr("class", "axisText")
            .attr("x", 0 - (chartheight / 2))
            .style("text-anchor", "middle");

        var obesityLabel = ylabelsGroup.append("text")
            .attr("y", 0 - chartmargin.left)
            .attr("x", 0 - (chartheight / 2))
            .attr("value", "obesity")
            .classed("inactive", true)
            .attr("dy", "1em")
            .text("Obese (%)");

        var smokesLabel = ylabelsGroup.append("text")
            .attr("y", 20 - chartmargin.left)
            .attr("x", 0 - (chartheight / 2))
            .attr("value", "smokes")
            .classed("inactive", true)
            .attr("dy", "1em")
            .text("Smokes (%)");

        var healthcareLabel = ylabelsGroup.append("text")
        .attr("x", 0 - (chartheight / 2))
        .attr("y", 40 - chartmargin.left)
            .attr("value", "healthcare")
            .classed("active", true)
            .attr("dy", "1em")
            .text("Lacks Healthcare (%)");

        // Create group for 3 x-axis labels
        var xlabelsGroup = chartGroup.append("g")
            .attr("transform", `translate(${chartwidth / 2}, ${chartheight + 20})`);

        var povertyLabel = xlabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 20)
            .attr("value", "poverty")
            .classed("active", true)
            .text("In Poverty (%)");

        var ageLabel = xlabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 40)
            .attr("value", "age")
            .classed("inactive", true)
            .text("Age (Median)");

        var incomeLabel = xlabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 60)
            .attr("value", "income")
            .classed("inactive", true)
            .text("Household Income (Median)");

        // updateToolTip function above csv import
        var textGroup = updateToolTip(chosenXAxis, chosenYAxis, textGroup);

        // x axis labels event listener
        xlabelsGroup.selectAll("text")
            .on("click", function() {
            // get value of selection
            var xvalue = d3.select(this).attr("value");
            if (xvalue !== chosenXAxis) {
                // replaces chosenXAxis with value
                chosenXAxis = xvalue;
                // updates x scale for new data
                xLinearScale = xScale(healthData, chosenXAxis);
                // updates x axis with transition
                xAxis = renderXAxis(xLinearScale, xAxis);
                // updates circles with new x values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
                // updates text in circles with new x values
                textGroup = renderText(textGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
                // updates tooltips with new info
                textGroup = updateToolTip(chosenXAxis, chosenYAxis, textGroup);
                // changes classes to change bold text
                if (chosenXAxis === "poverty") {
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (chosenXAxis === "age") {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        });
        // y axis labels event listener
        ylabelsGroup.selectAll("text")
            .on("click", function() {
            // get value of selection
            var yvalue = d3.select(this).attr("value");
            if (yvalue !== chosenYAxis) {

            // replaces chosenYAxis with value
            chosenYAxis = yvalue;

            // updates y scale for new data
            yLinearScale = yScale(healthData, chosenYAxis);

            // updates y axis with transition
            yAxis = renderYAxis(yLinearScale, yAxis);

            // updates circles with new y values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

            // updates text in circles with new y values
            textGroup = renderText(textGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

            // updates tooltips with new info
            text = updateToolTip(chosenXAxis, chosenYAxis, textGroup);

            // changes classes to change bold text
            if (chosenYAxis === "obesity") {
                obesityLabel
                    .classed("active", true)
                    .classed("inactive", false);
                smokesLabel
                    .classed("active", false)
                    .classed("inactive", true);
                healthcareLabel
                    .classed("active", false)
                    .classed("inactive", true);
            
            }
            else if (chosenYAxis === "smokes") {
                obesityLabel
                    .classed("active", false)
                    .classed("inactive", true);
                smokesLabel
                    .classed("active", true)
                    .classed("inactive", false);
                healthcareLabel
                    .classed("active", false)
                    .classed("inactive", true);
            
            }
            else {
                obesityLabel
                    .classed("active", false)
                    .classed("inactive", true);
                smokesLabel
                    .classed("active", false)
                    .classed("inactive", true);
                healthcareLabel
                    .classed("active", true)
                    .classed("inactive", false);
                }
            }
        });
    }
}