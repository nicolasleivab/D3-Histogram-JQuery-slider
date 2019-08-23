# D3-Histogram-JQuery-slider

Implementation of a D3.js histogram visualization about the average height of men and women around the world over one hundred years. The data used in this visualization was obtained from [NCD Risk Factor Collaboration (NCD-RisC)](http://ncdrisc.org/).
The hisrogram contains a double dropdown filter (rows and columns) and a jQuery range slider that filters the volunteers by their birthdays. In order to integrate the filters with the histogram correctly, the update (enter and exit) D3 function of version 5 is used as shown in the official documentation example (https://d3js.org/):

```
// Enter
d3.select("body")
  .selectAll("p")
  .data([4, 8, 15, 16, 23, 42])
  .enter().append("p")
    .text(function(d) { return "I’m number " + d + "!"; });


// Update…
var p = d3.select("body")
  .selectAll("p")
  .data([4, 8, 15, 16, 23, 42])
    .text(function(d) { return d; });

// Enter…
p.enter().append("p")
    .text(function(d) { return d; });

// Exit…
p.exit().remove();
```



