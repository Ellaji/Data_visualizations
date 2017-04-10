/* Use a tsv (Tabs Separated Values) file as data source; as downloads are asynchronous, 
  we will stick to a certain format, see below for explanation */

//FIRST, we initialize as much as we can when the page loads and before the data is available. 
//It’s good to set the chart size when the page loads, so that the page does not reflow after the data downloads. 
var width = 420,
  barHeight = 20;

var x = d3.scale.linear()
  .range([0, width]);
  //we bind the domain below, in the callback function, because we use data from the tsv data file to generate it

var svgChart2 = d3.select(".bar-chart-svg-tsv")
  .attr("width", width);
  //we bind the height below, in the callback function, because we use data from the tsv data file to generate it

//SECOND, we complete the remainder of the chart (everything data related) inside a callback function
//the code here runs after the download is finished
d3.tsv("data_bar-chart-svg.tsv", type, function(error, data) {
  
  //bind the x domain here
  x.domain([0, d3.max(data, function(d) { return d.value; })]);

  //bind the height of the chart here
  svgChart2.attr("height", barHeight * data.length);
  console.log("working up to here 1");

  var svgBar = svgChart2.selectAll("g")
    .data(data)
    .enter().append("g")
    .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

  svgBar.append("rect")
    .attr("width", function(d) { return x(d.value); })
    .attr("height", barHeight - 1);

  svgBar.append("text")
    .attr("x", function(d) { return x(d.value) -3; })
    .attr("y", barHeight / 2)
    .attr("dy", ".35em")
    .text(function(d) { return d.value; });
});

//the callback itself for drawing the chart after the data is loaded
//d3.tsv does not detect types (by default, all columns in TSV and CSV files are strings), 
//so we have to convert the data ourselves in a type function, that is passed as the second argument to d3.tsv
function type(d) {
  d.value = +d.value; // coerce to number
  return d;
}

//THIRD all code below here runs while the tsv file is downloading, directly after the FIRST part of the code. 
