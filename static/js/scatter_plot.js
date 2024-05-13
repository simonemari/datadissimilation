// Select the SVG element for the scatter plot
var scatterSvg = d3.select("#scatter-plot");
function drawScatterPlot(data) {

    // Define the dimensions of the chart
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = +scatterSvg.node().getBoundingClientRect().width - margin.left - margin.right,
        height = +scatterSvg.node().getBoundingClientRect().height - margin.top - margin.bottom;


    // Clear the SVG
    scatterSvg.selectAll("*").remove();


    // Define the scales for the scatter plot
    var xScaleScatter = d3.scaleLinear().domain([0, d3.max(data, d => d.authorcount)]).range([0, width]);
    var yScaleScatter = d3.scaleLog().base(10).domain([1, d3.max(data, d => d.cites)]).range([height, 0]);

    // Create a group element and transform it
    var g = scatterSvg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    // Create the scatter plot using the provided data
    var points = g.selectAll(".point")
        .data(data)
        .enter().append("circle")
        .attr("class", "point")
        .attr("cx", d => xScaleScatter(d.authorcount))
        .attr("cy", d => yScaleScatter(d.cites))
        .attr("r", 5)
        .style("fill", "steelblue");



    // Add the X Axis
    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScaleScatter));

    // Add the Y Axis
    g.append("g")
        .call(d3.axisLeft(yScaleScatter));

    // Add the label for the X axis
    g.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height - 6)
        .text("Authors count");
    // Add the label for the Y axis
    g.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 6)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Citations count");

    // Contrast the color of the points with the background
    points.style("fill", "rgba(70, 130, 180, 0.5)"); // steelblue with 50% opacity
    var colorScale = d3.scaleSequential().domain([0, d3.max(data, d => d.cites)]).interpolator(d3.interpolateCool);
    points.style("fill", d => colorScale(d.cites));

 // Add interaction
points.on("mouseover", function(event, d) {
    // Highlight the corresponding bar in the bar chart
    var bar = d3.select("#bar-chart").select(".bar-chart-bar[data-year='" + d.year + "']");
    bar.style("fill", "red");

    // Highlight the corresponding slice in the pie chart
    var slice = d3.select("#pie-chart").select(".arc[data-authorcount='" + d.authorcount + "']");
    // Save the original color
    d.originalColor = slice.select("path").style("fill");
    // Change the color to red
    slice.select("path").style("fill", "red");
}).on("mouseout", function(event, d) {
    // Remove the highlight from the bar in the bar chart
    var bar = d3.select("#bar-chart").select(".bar-chart-bar[data-year='" + d.year + "']");
    bar.style("fill", "steelblue");

    // Remove the highlight from the slice in the pie chart
    var slice = d3.select("#pie-chart").select(".arc[data-authorcount='" + d.authorcount + "']");
    // Restore the original color
    slice.select("path").style("fill", d.originalColor);
});

}

// Prepare the data for the scatter plot
var scatterData = data.map(function(d) {
    // For each paper, we create an object with the properties authorcount and cites
    return {
        authorcount: d.authorcount,
        cites: d.cites,
        year: d.year
    };
});

// Draw the initial scatter plot
drawScatterPlot(scatterData);

// Aggiungi questa funzione per ottenere gli anni selezionati
function getSelectedYears() {
    var selectedYears = [];
    var checkboxes = document.querySelectorAll('.checkbox-container input[type="checkbox"]:checked');
    for (var i = 0; i < checkboxes.length; i++) {
        selectedYears.push(parseInt(checkboxes[i].name.replace('year', '')));
    }
    console.log('selectedYears:',selectedYears);
    return selectedYears;

}

// Aggiungi questa funzione per aggiornare il grafico
function updateScatterPlot() {
    var selectedYears = getSelectedYears();
    console.log('selectedYears:',selectedYears);

    // Filtra i dati per includere solo gli anni selezionati
    var filteredData = scatterData.filter(function(d) {
        return selectedYears.includes(d.year);

    });

    // Ridisegna il grafico con i nuovi dati
    drawScatterPlot(filteredData);
}


document.addEventListener('DOMContentLoaded', (event) => {
    var checkboxes = document.querySelectorAll('.checkbox-container input[type="checkbox"]');
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].addEventListener('change', function() {
            updateScatterPlot();
        });
    }
});