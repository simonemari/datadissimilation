// Create a tooltip
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("background", "#fff")
    .style("border", "1px solid #000")
    .style("border-radius", "5px")
    .style("padding", "10px");

// Seleziona l'elemento SVG per il bubble chart
var svg = d3.select("#bubble-chart");

// Aggiungi un gruppo <g> all'SVG
var g = svg.append("g");

// Definisci le dimensioni e i margini del grafico
var margin = {top: 80, right: 20, bottom: 30, left: 80},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

// Trasla il gruppo <g> in base ai margini
g.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Creiamo un oggetto per tenere traccia del numero di citazioni per ogni autore
var citesByAuthor = {};

data.forEach(function(d) {
    // Check if d.authors is defined and is a string
    if (typeof d.authors === 'string') {
        // Dividiamo la stringa degli autori in un array di autori
        var authors = d.authors.split(",");
        authors.forEach(function(author) {
            // Rimuoviamo gli spazi bianchi iniziali e finali
            author = author.trim();
            // Aggiungiamo le citazioni all'autore corrispondente
            if (citesByAuthor[author]) {
                citesByAuthor[author] += d.cites;
            } else {
                citesByAuthor[author] = d.cites;
            }
        });
    }
});

// Creiamo un array di oggetti da utilizzare per il grafico a bolle
var bubbleChartData = Object.keys(citesByAuthor).map(function(author) {
    return {
        author: author,
        cites: citesByAuthor[author]
    };
});

// Creiamo le scale per il grafico
var xScale = d3.scaleLinear().domain([0, d3.max(bubbleChartData, d => d.cites)]).range([0, width]);
var yScale = d3.scaleBand().domain(bubbleChartData.map(d => d.author)).range([height, 0]);
var radiusScale = d3.scaleSqrt().domain([0, d3.max(bubbleChartData, d => d.cites)]).range([0, 50]);
var colorScale = d3.scaleSequential().domain([0, d3.max(bubbleChartData, d => d.cites)]).interpolator(d3.interpolateCool);

// Creiamo le bolle
var bubbles = g.selectAll(".bubble")
    .data(bubbleChartData)
    .enter().append("circle")
    .attr("class", "bubble")
    .attr("cx", d => xScale(d.cites))
    .attr("cy", d => yScale(d.author))
    .attr("r", d => radiusScale(d.cites))
    .style("fill", d => colorScale(d.cites));

// Aggiungiamo l'interazione
bubbles.on("mouseover", function(event, d) {
    // Mostra le informazioni dettagliate
    var info = `Author: ${d.author}<br>Citations: ${d.cites}`;
    tooltip.html(info).style("visibility", "visible");
}).on("mousemove", function(event) {
    // Muovi il tooltip con il mouse
    tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px");
}).on("mouseout", function() {
    // Nascondi il tooltip
    tooltip.style("visibility", "hidden");
});