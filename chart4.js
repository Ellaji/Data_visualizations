//Tutorial from https://bost.ocks.org/mike/bar/3/

/*  Rotating a bar chart into a column chart largely involves swapping x with y. 
    However, a number of smaller incidental changes are also required. 
    This is the cost of working directly with SVG rather than using a high-level visualization grammar like ggplot2. 
    On the other hand, SVG offers greater customizability; and SVG is a web standard, 
    so we can use the browser’s developer tools like the element inspector, and use SVG for things beyond visualization.
    
    When renaming the x scale to the y scale, the range becomes [height, 0] rather than [0, width]. 
*/

var chart4 = d3.select(".chart4"),
    margin4 = {top: 20, right: 20, bottom: 30, left: 40},
    width4 = +chart4.attr("width") - margin4.left - margin4.right,
    height4 = +chart4.attr("height") - margin4.top - margin4.bottom;

var x4 = d3.scaleBand().rangeRound([0, width4]).paddingInner(0.1),
    y4 = d3.scaleLinear().rangeRound([height4, 0]);

var g4 = chart4.append("g")
    .attr("class", "padding-chart4")
    .attr("transform", "translate(" + margin4.left + "," + margin4.top + ")");

 
// Setup the tip
var tool_tip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-10, 0])
    .html(function(d) { return "Frequency: " + (d.frequency*100).toFixed(3) + "%"; });
chart4.call(tool_tip); //invoking the tool_tip

// Setup the comment 
var comment_field = d3.comment()
        .attr("class", "d3-comment")
        .html(function(d) { return "Comment: " + (d.frequency*100).toFixed(3) + "%"; });
chart4.call(comment_field); //invoking the comment_field

d3.tsv("data_chart4.tsv", function(d) {
    d.frequency = +d.frequency;
    return d;
    }, function(error, data) {
    if (error) throw error;

    x4.domain(data.map(function(d) { return d.letter; }));
    y4.domain([0, d3.max(data, function(d) { return d.frequency; })]);

    g4.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height4 + ")")
            .call(d3.axisBottom(x4));

    g4.append("g")
            .attr("class", "axis axis--y")
        .call(d3.axisLeft(y4).ticks(10, "%"))
        .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("Frequency");

    g4.selectAll(".bar")
        .data(data)
        .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x4(d.letter); })
            .attr("y", function(d) { return y4(d.frequency); })
            .attr("width", x4.bandwidth())
            .attr("height", function(d) { return height4 - y4(d.frequency); })
            .style('fill',  function(d) {
                if(d.frequency > .09000 ){
                    return 'red';
                } else {
                    return 'steelblue';
                }
            })
            .on('mouseover', tool_tip.show)
            .on('mouseout', tool_tip.hide)
            .on('click', function(d) { 
                comment_field.show; 
                console.log(d.frequency);
            });
});

