// Select the SVG element for the scatter plot
var scatterSvg = d3.select("#scatter-plot");

// Define the margins, width, and height
var margin = {top: 50, right: 30, bottom: 50, left: 50},
    width = +scatterSvg.attr("width") - margin.left - margin.right,
    height = +scatterSvg.attr("height") - margin.top - margin.bottom;

// Prepariamo i dati per lo scatterplot
var scatterData = data.map(function(d) {
    // Per ogni paper, creiamo un oggetto con le proprietà authorcount e cites
    return {
        authorcount: d.authorcount,
        cites: d.cites,
        year: d.year
    };
});

// Define the scales for the scatter plot
//var xScaleScatter = d3.scaleLinear().domain([0, d3.max(scatterData, d => d.authorcount)]).range([0, width]);
//var yScaleScatter = d3.scaleLinear().domain([0, d3.max(scatterData, d => d.cites)]).range([height, 0]);
// Define the scales for the scatter plot
var xScaleScatter = d3.scaleLinear().domain([0, d3.max(scatterData, d => d.authorcount)]).range([0, width]);

// Use a logarithmic scale for the y axis
var yScaleScatter = d3.scaleLog().base(10).domain([1, d3.max(scatterData, d => d.cites)]).range([height, 0]);

// Create a group element and transform it
var g = scatterSvg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Ora possiamo creare lo scatterplot usando scatterData invece di data
var points = g.selectAll(".point")
    .data(scatterData)
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

// Aggiungi il label per l'asse X
g.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height - 6)
    .text("Authors count");

// Aggiungi il label per l'asse Y
g.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Citations count");

// contrast the color of the points with the background
points.style("fill", "rgba(70, 130, 180, 0.5)"); // steelblue with 50% opacity
var colorScale = d3.scaleSequential().domain([0, d3.max(scatterData, d => d.cites)]).interpolator(d3.interpolateCool);
points.style("fill", d => colorScale(d.cites));
var jitterWidth = 0.5;

// Aggiungiamo l'interazione
points.on("mouseover", function(event, d) {
    // Evidenziamo la barra corrispondente nel bar chart
    var bar = d3.select("#bar-chart").select(".bar[data-year='" + d.year + "']");
    bar.style("fill", "red");
}).on("mouseout", function(event, d) {
    // Rimuoviamo l'evidenziazione dalla barra nel bar chart
    var bar = d3.select("#bar-chart").select(".bar[data-year='" + d.year + "']");
    bar.style("fill", "steelblue");
});