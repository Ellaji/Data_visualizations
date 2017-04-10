var data = [4, 8, 15, 16, 23, 42];

//Map domain to range (in this case times 10)
var width = 420,
    barHeight = 20;

var x = d3.scale.linear()
  .domain([0, d3.max(data)])
  .range([0, width]);

//HTML bar chart Build the bars with numbers in it
d3.select(".bar-chart-html")
  .selectAll("div")
  .data(data)
  .enter().append("div")
  .style("width", function(d) { return x(d) + "px"; })
  .text(function(d) { return d; });

//SVG bar chart Build the bars with numbers in it
var svgChart = d3.select(".bar-chart-svg")
  .attr("width", width)
  .attr("height", barHeight * data.length);

var svgBar = svgChart.selectAll("g")
  .data(data)
  .enter().append("g")
  .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

svgBar.append("rect")
  .attr("width", x)
  .attr("height", barHeight - 1);

svgBar.append("text")
  .attr("x", function(d) { return x(d) - 3; })
  .attr("y", barHeight / 2)
  .attr("dy", ".35em")
  .text(function(d) { return d; });

/* Loading data introduces a new complexity: downloads are asynchronous. 
When you call d3.tsv, it returns immediately while the file downloads in the background. 
At some point in the future when the download finishes, your callback function is invoked with the new data, 
or an error if the download failed. 
In effect your code is evaluated out of order. To solve that, use this format:

// 1. Code here runs first, before the download starts.

d3.tsv("data.tsv", function(error, data) {
  // 3. Code here runs last, after the download finishes.
});

// 2. Code here runs second, while the file is downloading. */


//Provide a horizontal and vertical axis with numbers
//do conditional formatting on length
//make a gradient on the bars
