/* D3 Histogram */

// Set dimensions and append svg to div #histogram
var svg = d3.select("#histogram"),
    margin = {top: 20, right: 120, bottom: 100, left: 100},
    width = 1200 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom,
    g = svg.append("svg").attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

        var t = d3.transition().duration(500);

// Load data from csv
d3.tsv("/data/data.tsv")
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

allProducts = data.columns.slice(1, -1); // Get Product columns for the filter
selection = allProducts[0];

// Y axis and call func
var y = d3.scaleLinear()
    .range([height, 0]);

// X axis and call func
var x = d3.scaleLinear()
    .range([0, width]);

// X axis append
xApp = g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height +")");

// Y axis append
yApp = g.append("g")
.attr("class", "y axis");


// Run the vis for the first time
 update(data);
    
function update(data) {

    var selector = d3.select("#drop") //dropdown change selection
    .append("select")
    .attr("id","dropdown")
    .on("change", function(d){
         selection = document.getElementById("dropdown");

// X domain   
x.domain([0, d3.max(data, function(d) { return d[selection.value]; })]) // Get max of the selected filter as domain 

// Setting Histogram parameters
var histogram = d3.histogram()
    .value(function(d) { return d[selection.value]; })   //Value of the vector
    .domain(x.domain())  //load x domain
    .thresholds(x.ticks(20)); //Set number of bins

var bins = histogram(data); //Apply d3.histogram function with array data as input and creat a binding 'bins'

// Y domain
y.domain([0, d3.max(bins, function(d) { return d.length; })]);   //return length of selected value in hist func

// Remove old elements
g.selectAll("rect")
    .data(bins)
    .exit()
    .attr("fill", "green")
    .transition(t)
    .attr("y", y(0))
    .attr("height", 0)
    .remove();
    
// Append new rects to svg element
g.selectAll("rect")
    .data(bins)
    .enter()
    .append("rect")
        .attr("x", 1)
        .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
        .attr("width", d => Math.max(0, x(d.x1) - x(d.x0) - 1))
        .attr("height", function(d) { return height - y(d.length); })
        .style("fill", "green")
        .merge(g.selectAll("rect") // Update old elements
        .data(bins))
            .transition(t)
            .attr("x", 1)
            .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
            .attr("width", d => Math.max(0, x(d.x1) - x(d.x0) - 1))
            .attr("height", function(d) { return height - y(d.length); })
            .style("fill", "green")
           
d3.select("g.y.axis")  //changing from selectAll to select fixed the conflict between charts
    .transition()
    .call(yCall).selectAll("text").attr("font-size", "12px");
d3.select("g.x.axis")  //changing from selectAll to select fixed the conflict between charts
    .transition()
    .call(xCall).selectAll("text").attr("font-size", "12px");

});

//get values for the dropdown
selector.selectAll("option")
.data(allProducts)
.enter().append("option")
.attr("value", function(d){
  return d;
})
.text(function(d){
  return d;
})

xCall = d3.axisBottom(x)
.tickFormat(function(d){ return d; });
xApp.transition(t).call(xCall).selectAll("text").attr("font-size", "12px");

yCall = d3.axisLeft(y)
.tickFormat(function(d){ return d; });
yApp.transition(t).call(yCall).selectAll("text").attr("font-size", "12px");

}
});