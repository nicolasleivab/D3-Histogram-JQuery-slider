/* D3 Histogram */

//Set dimensions and append svg to div #histogram

var svg = d3.select("#histogram"),
    margin = {top: 20, right: 120, bottom: 100, left: 100},
    width = 1200 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom,
    g = svg.append("svg").attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

// Load data from csv

d3.tsv("/data/asd.tsv")
    .then(function(data){

// Format Data

var parseDate = d3.timeParse("%m/%d/%Y");

data.forEach(function(d) {
    d['Product A'] = +d['Product A'];
    d['Product B'] = +d['Product B'];
    d['Product C'] = +d['Product C'];
    d.Date = parseDate(d.Date);
});

console.log(data);

});



