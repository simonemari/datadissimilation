// Assuming `data` is an array of objects where each object represents a record
var publisherCounts = d3.rollup(data, v => v.length, d => d.publisher); // count publications for each publisher
console.log('publisherCounts:', publisherCounts); // Log the counts

// Convert the Map to an array of objects and sort by count in descending order
var sortedData = Array.from(publisherCounts, ([publisher, count]) => ({publisher, count}))
    .sort((a, b) => d3.descending(a.count, b.count));
console.log('sortedData:', sortedData); // Log the sorted data

// Define the dimensions of the chart
var margin = {top: 20, right: 30, bottom: 40, left: 200},
    width = window.innerWidth - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Define the scales
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleBand().range([height, 0]).padding(0.1);

// Define the SVG element for the chart
var pubSvg = d3.select("#pub-chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Set the domains of the scales
x.domain([0, d3.max(sortedData, d => d.count)]);
y.domain(sortedData.slice(0, 50).map(d => d.publisher)); // limit to the top 50 publishers

// Add the bars
pubSvg.selectAll(".pub-chart-bar")
  .data(sortedData.slice(0, 50)) // limit to the top 50 publishers
  .enter().append("rect")
    .attr("class", "pub-chart-bar")
    .attr("y", d => y(d.publisher))
    .attr("height", y.bandwidth())
    .attr("x", 0)
    .attr("width", d => x(d.count));

// Add the X Axis
pubSvg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

// Add the Y Axis
pubSvg.append("g")
    .call(d3.axisLeft(y));

// Aggiungi un titolo al grafico
pubSvg.append("text")
    .attr("x", 400)  // Posiziona il titolo a destra
    .attr("y", 10)    // Posiziona il titolo in alto
    .attr("text-anchor", "end")  // Allinea il testo a destra
    .style("font-size", "20px")  // Imposta la dimensione del carattere
    .style("text-decoration", "underline")  // Sottolinea il titolo
    .text("Top Publishers");  // Imposta il testo del titolo