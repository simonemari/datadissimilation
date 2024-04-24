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
var pieSvg = d3.select("#pie-chart").append("svg")
    .attr("width", 700)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + (width / 2 + 60) + "," + (height / 2 ) + ")"); // Move the pie chart up

// Create the pie chart
var g = pieSvg.selectAll(".arc")
  .data(pie(pieData))
  .enter().append("g")
    .attr("class", "arc");

// Add the arcs
g.append("path")
    .attr("d", arc)
    .style("fill", d => color(d.data.authorcount));

// Ordina i dati per authorcount in ordine decrescente
pieData.sort((a, b) => d3.ascending(a.authorcount, b.authorcount));

// Crea la legenda
var legend = pieSvg.selectAll(".legend")
    .data(pieData)
    .enter().append("g")
    .attr("transform", function(d, i) { return "translate(280," + (i * 20 - height / 2 + 100) + ")"; }); // Sposta la legenda leggermente a destra
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
    .attr("x", 230)  // Sposta il titolo 50 pixel a destra
    .attr("y", -height/2 + 20)    // Posiziona il titolo sopra il centro del grafico
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style("text-decoration", "underline")
    .text("Authors Count Distribution");

/*
// Ottieni l'elemento div e le sue dimensioni
var divContainer = document.querySelector('.grid-container');
var contWidth = divContainer.offsetWidth;
var contHeight = divContainer.offsetHeight;

// Ottieni l'elemento div e le sue dimensioni
var divElement = document.querySelector('.grid-item');
var divWidth = divElement.offsetWidth;
var divHeight = divElement.offsetHeight;

// Ottieni l'elemento SVG e le sue dimensioni
var svgElement = document.getElementById('pie-chart');
var svgWidth = svgElement.getAttribute('width');
var svgHeight = svgElement.getAttribute('height');

// Stampa le dimensioni
console.log('Div container: ' + contWidth + 'x' + contHeight);
console.log('Div item: ' + divWidth + 'x' + divHeight);
console.log('SVG dimensions: ' + svgWidth + 'x' + svgHeight);
*/
