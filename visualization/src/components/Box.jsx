import React, { useEffect, useRef } from 'react';
import * as d3 from "d3";

const BoxPlot = ({ width, height, color, data }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 30, bottom: 30, left: 40 };

    // calculate the inner width and height considering margins
    var innerWidth = width - margin.left - margin.right;
    var innerHeight = height - margin.top - margin.bottom;
 
    // append the svg object to the body of the page
    var svg = d3.select(svgRef.current)
      .selectAll("svg") // Select existing svg elements if any
      .data([null]) // Use a single-element array to enter/exit the svg element
      .join("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    // create dummy data
    var data = [12, 19, 11, 13, 12, 22, 13, 4, 15, 16, 18, 19, 20, 12, 11, 9]

    // Compute summary statistics used for the box:
    var data_sorted = data.sort(d3.ascending)
    var q1 = d3.quantile(data_sorted, .25)
    var median = d3.quantile(data_sorted, .5)
    var q3 = d3.quantile(data_sorted, .75)
    var interQuantileRange = q3 - q1
    var min = q1 - 1.5 * interQuantileRange
    var max = q1 + 1.5 * interQuantileRange

    // Show the Y scale
    var y = d3.scaleLinear()
      .domain([0, 24])
      .range([innerHeight, 0]);
    svg.call(d3.axisLeft(y))

    // a few features for the box
    var center = innerWidth / 2;
    var boxWidth = 100;

    // Show the main vertical line
    svg
      .append("line")
      .attr("x1", center)
      .attr("x2", center)
      .attr("y1", y(min))
      .attr("y2", y(max))
      .attr("stroke", "black")

    // Show the box
    svg
      .append("rect")
      .attr("x", center - boxWidth / 2)
      .attr("y", y(q3))
      .attr("height", (y(q1) - y(q3)))
      .attr("width", boxWidth)
      .attr("stroke", "black")
      .style("fill", color)

    // show median, min and max horizontal lines
    svg
      .selectAll(".line")
      .data([min, median, max])
      .enter()
      .append("line")
      .attr("x1", center - boxWidth / 2)
      .attr("x2", center + boxWidth / 2)
      .attr("y1", (d) => y(d))
      .attr("y2", (d) => y(d))
      .attr("stroke", "black");
  }, [width, height]);

  return (
    <svg ref={svgRef} />
  );
};

export default BoxPlot;