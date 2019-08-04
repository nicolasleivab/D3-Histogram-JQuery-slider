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

// transition time 
var t = d3.transition().duration(500);

// Load data from tsv
d3.tsv("/data/data.tsv")
    .then(function(data){

// Format Data
data.forEach(function(d) {
    d['Mean height (cm)'] = +d['Mean height (cm)'];
    d['Mean height lower 95% uncertainty interval (cm)'] = +d['Mean height lower 95% uncertainty interval (cm)'];
    d['Mean height upper 95% uncertainty interval (cm)'] = +d['Mean height upper 95% uncertainty interval (cm)'];
    d['Year of birth'] = +d['Year of birth'];
});

// Filter values
allStats = data.columns.slice(2); //get Product columns for the filter
selection = allStats[0];
allSexs = d3.map(data, function(d){return(d.Sex)}).keys(); //get zones
selection2= allSexs[0];

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


function update(data) {
    
// X domain   
x.domain([(d3.min(data, function(d) { return d[selection.value] || d[selection]; })) - 2, (d3.max(data, function(d) { return d[selection.value] || d[selection] ; })) + 2]); 
    
// Setting Histogram parameters
var histogram = d3.histogram()
    .value(function(d) { return d[selection.value] || d[selection] ; })   //Value of the vector
    .domain(x.domain())  //load x domain
    .thresholds(x.ticks(40)); //Set number of bins

var bins = histogram(data); //Apply d3.histogram function with array data as input and creat a binding 'bins'

// Y domain
y.domain([0, d3.max(bins, function(d) { return d.length; })]);   //return length of selected value in hist func

// Remove old elements
g.selectAll("rect")
    .data(bins)
    .exit()
    .attr("fill", "green")
    .transition(t)
    .attr("height", 0)
    .attr("width", 0)
    .remove();
    
// Append new rects to svg element
g.selectAll("rect")
    .data(bins)
    .enter()
    .append("rect")
        .attr("x", 1)
        .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
        .attr("width", d => Math.max(0, x(d.x1) - x(d.x0) - 1))
        .style("fill", "green")
        .merge(g.selectAll("rect") // Update old elements
        .data(bins))
            .transition(t)
            .attr("x", 1)
            .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
            .attr("width", d => Math.max(0, x(d.x1) - x(d.x0) - 1))
            .attr("height", function(d) { return height - y(d.length); })
            .style("fill", "green")

// axis update
d3.select("g.y.axis")  //changing from selectAll to select fixed the conflict between charts
    .transition()
    .call(yCall).selectAll("text").attr("font-size", "12px");
d3.select("g.x.axis")  //changing from selectAll to select fixed the conflict between charts
    .transition()
    .call(xCall).selectAll("text").attr("font-size", "12px");

}

//jQuery UI slider
$("#yearSlider").slider({
    range: true,
    max: 1996,
    min: 1896,
    step: 1, // One year
    values: [ 1896, 1996 ],
    slide: function(event, ui){
        $("#dateLabel1").text((ui.values[0]));
        $("#dateLabel2").text((ui.values[1]));
        update(data.filter(function(d){return ((d['Year of birth'] >= ui.values[0]) && (d['Year of birth'] <= ui.values[1]));}));
        console.log(ui.values[0]);
        console.log(data);
    }
});


// Filters
var sexSelector = d3.select("#drop2") //dropdown change selection
.append("select") //append row filter dropdown
.attr("id","dropdown2")
.on("change", function(d){ // Row Filter
    selection2 = document.getElementById("dropdown2");
    console.log([selection2.value]);
    update(data.filter(function(d){return d.Sex == [selection2.value];}));
        statSelector.on("change", function(d){ // Column Filter
            selection = document.getElementById("dropdown");
            console.log([selection.value]);
            update(data.filter(function(d){return d.Sex == [selection2.value];}));
             });
      });

      
//get values for the row filter dropdown
sexSelector.selectAll("option")
.data(allSexs)
.enter().append("option")
.attr("value", function(d){
  return d;
})
.text(function(d){
  return d;
})

// append column filter dropdown
var statSelector = d3.select("#drop") //dropdown change selection
.append("select")
.attr("id","dropdown")
.on("change", function(d){ //default run for column filter
    selection = document.getElementById("dropdown");
    console.log([selection.value]);
    update(data.filter(function(d){return d.Sex == [selection2];}));
     });

//get values for the column filter dropdown
statSelector.selectAll("option")
.data(allStats)
.enter().append("option")
.attr("value", function(d){
  return d;
})
.text(function(d){
  return d;
})

//xcall func
var xCall = d3.axisBottom(x)
.tickFormat(function(d){ return d; });
xApp.transition(t).call(xCall).selectAll("text").attr("font-size", "12px");

//ycall func
var yCall = d3.axisLeft(y)
.tickFormat(function(d){ return d; });
yApp.transition(t).call(yCall).selectAll("text").attr("font-size", "12px");

// Render first viz
update(data.filter(function(d){return d.Sex == [selection2];}));


});
