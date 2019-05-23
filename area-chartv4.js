/*area-chart js*/
/* Adapted from Mike Bostock at bl.ocks.org
  https://bl.ocks.org/mbostock/3885211 */

//** tabletop init function **//
function init() {     
  Tabletop.init( { key: '10g_TGtruCriERlXJurPZQk76pvk30U0pkWgbbfzPrjA', //google sheet key
                   callback: function(data, tabletop) { 
                       console.log(data)
                       
//** D3 js script **//


    
    var svg = d3.select("svg"),
        margin = {top: 50, right: 20, bottom: 50, left: 50},
        width = svg.attr("width") - margin.left - margin.right,
        height = svg.attr("height") - margin.top - margin.bottom;
    var parseDate = d3.timeParse("%m/%d/%Y");
    var data = data.filter(function(d){return d.ID == '10574525';});

         data.forEach(function(d) {
        d.Rounds = +d.Rounds;
        d.Playtime = +d.Playtime;
        d.Instructions = +d.Instructions;
        d.Functions = +d.Functions;
        d.Loops = +d.Loops;
        d.Movement = +d.Movement;
        d.PickDrop = +d.PickDrop;
        d["Success Probability"] = +d["Success Probability"];
        d.Cycles = +d.Cycles;
        d["Best Solution"] = +d["Best Solution"];
        d.date = parseDate(d.date);
    });


    var x = d3.scaleTime().range([0, width]),
        y = d3.scaleLinear().range([height, 0]),
        z = d3.scaleOrdinal(d3.schemeCategory20);
    var stack = d3.stack();
    var area = d3.area()
        .x(function(d) { return x(d.data.date); })
        .y0(function(d) { return y(d[0]); })
        .y1(function(d) { return y(d[1]); });
    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
   

         var keys = ['Cycles', 'Best Solution'];
        x.domain(d3.extent(data, function(d) { return d.date; }));
        y.domain([0, (d3.max(data, function(d){return +d.Cycles;}))+10]);
        z.domain(keys);
        stack.keys(keys);
        console.log(data)
        console.log(stack(data))
        var layer = g.selectAll(".layer")
            .data(stack(data))
            .enter().append("g")
            .attr("class", "layer");
        layer.append("path")
            .attr("class", "area")
            .style("fill", function(d) { return z(d.key); })
            .attr("d", area);
        // Only label the layers left at the end (if one browser disappears)
        layer.filter(function(d) { return d[d.length - 1][1] - d[d.length - 1][0] > 0.01; })
            .append("text")
            .attr("x", width - 6)
            .attr("y", function(d) { return y((d[d.length - 1][0] + d[d.length - 1][1]) / 2); })
            .attr("dy", ".35em")
            .style("font", "10px sans-serif")
            .style("text-anchor", "end")
            .text(function(d) { return d.key; });
        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x)).selectAll("text") 
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-40)" 
                );;;;
        g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y).ticks(10));
    




            //** end of D3 script **//

                   },
                   simpleSheet: true } )
}
window.addEventListener('DOMContentLoaded', init)
//** end of tabletop init function **//
   
