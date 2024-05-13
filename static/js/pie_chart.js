// Select the SVG element for the pie chart
var pieSvg = d3.select("#pie-chart");

// Create a tooltip
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

function drawPieChart(data) {
    // Clear the SVG
    pieSvg.selectAll("*").remove();

    // Assuming `data` is an array of objects where each object represents a record
    var authorCounts = d3.rollup(data, v => v.length, d => d.authorcount); // count publications for each author count

    // Convert the Map to an array of objects
    var pieData = Array.from(authorCounts, ([authorcount, count]) => ({authorcount, count}));

    // Define the dimensions of the chart
    var width = 500;
    var height = 500;
    var radius = Math.min(width, height) / 2;

    // Define the color scale
    var color = d3.scaleOrdinal(d3.schemeCategory10);

    // Define the arc generator with innerRadius to give 3D effect
    var arc = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(radius / 2); // Change this to create a donut chart

    // Define the pie chart generator
    var pie = d3.pie()
        .sort(null)
        .value(d => d.count)
        .padAngle(0.005); // This will create a small padding between sectors

    // Create the SVG element for the chart
    var svg = pieSvg.append("svg")
        .attr("width", 700)
        .attr("height", height)
      .append("g")
        .attr("transform", "translate(" + (width / 2 + 60) + "," + (height / 2 ) + ")"); // Move the pie chart up

    // Create the pie chart
    var g = svg.selectAll(".arc")
      .data(pie(pieData))
      .enter().append("g")
        .attr("class", "arc")
        .attr("data-authorcount", d => d.data.authorcount);  // Add this line


    // Add the arcs
    g.append("path")
        .attr("d", arc)
        .style("fill", d => color(d.data.authorcount))
        .on("mouseover", function(event, d) { // Add interactivity
            // Calculate the percentage of the total count
            var percent = Math.round(1000 * d.data.count / data.length) / 10;
            // Update the tooltip position and value
            tooltip.style("opacity", 1)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 10) + "px")
                .html(d.data.authorcount + " authors: " + percent + "%");
        })
        .on("mouseout", function() {
            // Hide the tooltip
            tooltip.style("opacity", 0);
        });

    // Ordina i dati per authorcount in ordine decrescente
    pieData.sort((a, b) => d3.ascending(a.authorcount, b.authorcount));

    // Crea la legenda
    var legend = pieSvg.selectAll(".legend")
        .data(pieData) .enter().append("g")
        .attr("transform", function(d, i) { return "translate(600," + (i * 20 - height / 2 + 400) + ")"; });

    // Sposta la legenda leggermente a destra
    legend.append("rect")
        .attr("x", 0)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", d => color(d.authorcount));

    legend.append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("fill", "black")
        .style("font-size", "12px")
        .text(d => d.authorcount + " authors");

    // Aggiungi un titolo alla pie chart
    pieSvg.append("text")
        .attr("x", 575)
        .attr("y", 20 )
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("text-decoration", "underline")
        .text("Authors Count Distribution");
}

// Prepare the data for the pie chart
var pieData = data.map(function(d) {
    // For each paper, we create an object with the properties authorcount and cites
    return {
        authorcount: d.authorcount,
        cites: d.cites,
        year: d.year
    };
});

// Draw the initial pie chart
drawPieChart(pieData);

// Add this function to update the pie chart
function updatePieChart() {
    var selectedYears = getSelectedYears();
    console.log('selectedYears:',selectedYears);

    // Filter the data to include only the selected years
    var filteredData = pieData.filter(function(d) {
        return selectedYears.includes(d.year);
    });

    // Redraw the pie chart with the new data
    drawPieChart(filteredData);
}

document.addEventListener('DOMContentLoaded', (event) => {
    var checkboxes = document.querySelectorAll('.checkbox-container input[type="checkbox"]');
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].addEventListener('change', function() {
            updatePieChart();
        });
    }
});