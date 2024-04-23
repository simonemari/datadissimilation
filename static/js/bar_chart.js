
// Raggruppiamo i dati per anno e sommiamo le citazioni per ogni gruppo
var sumByYear = d3.rollup(data, v => d3.sum(v, d => d.cites), d => d.year);

// Creiamo un array di oggetti da utilizzare per il grafico
var chartData = Array.from(sumByYear, ([year, cites]) => ({year, cites}));

var svg = d3.select("#bar-chart"),
    margin = {top: 50, right: 30, bottom: 30, left: 50},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    y = d3.scaleLinear().rangeRound([height, 0]);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Ordiniamo i dati per anno
chartData.sort(function(a, b) { return a.year - b.year; });

x.domain(chartData.map(function(d) { return d.year; }));
// Calcoliamo il valore massimo di citazioni tra tutti gli anni
var maxCites = d3.max(chartData, function(d) { return d.cites; });

// Impostiamo il dominio della scala y in base al valore massimo calcolato
y.domain([0, maxCites]);

g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

g.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(y).ticks(10))
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    .text("Cites");

// Creiamo le barre del grafico
var bars = g.selectAll(".bar")
    .data(chartData)
    .enter().append("rect")
    .attr("class", "bar")  // Assicurati che questa riga sia presente
    .attr("x", function(d) { return x(d.year); })
    .attr("y", function(d) { return y(d.cites); })
    .attr("width", x.bandwidth())
    .attr("height", function(d) { return height - y(d.cites); })
    .attr("data-year", function(d) { return d.year; });  // Aggiungi questa riga

// Creiamo i label per le barre, ma li rendiamo invisibili
var labels = g.selectAll(".label")
    .data(chartData)
    .enter().append("text")
    .attr("class", "label")
    .attr("x", (function(d) { return x(d.year) + x.bandwidth() / 2; }  ))
    .attr("y", function(d) { return y(d.cites) - 5; })
    .text(function(d) { return d.cites; })
    .attr("text-anchor", "middle")
    .style("visibility", "hidden")  // I label sono inizialmente invisibili
    .style("fill", "black")  // Impostiamo il colore del testo a nero
    .style("font-size", "12px")  // Impostiamo la dimensione del carattere a 12 pixel
    .attr("data-year", function(d) { return d.year; });  // Aggiungi questa riga


// Quando il mouse passa sopra una barra, mostrare il label corrispondente
bars.on("mouseover", function(event, d) {
    // Selezioniamo il label corrispondente alla barra utilizzando il dato `d`
    var label = svg.select(".label[data-year='" + d.year + "']");
    label.style("visibility", "visible");
});

// Quando il mouse esce da una barra, nascondere il label corrispondente
bars.on("mouseout", function(event, d) {
    // Selezioniamo il label corrispondente alla barra utilizzando il dato `d`
    var label = svg.select(".label[data-year='" + d.year + "']");
    label.style("visibility", "hidden");
});
console.log(chartData);