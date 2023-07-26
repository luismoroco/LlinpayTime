import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const TimeLine = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    // Chart dimensions and margins
    const margin = { top: 10, right: 30, bottom: 30, left: 60 };
    const width = 460 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Append the SVG object to the div with id "my_dataviz"
    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Fetch the data
    d3.csv('https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv')
      .then(data => {
        // Format the date variables
        const parseDate = d3.timeParse('%Y-%m-%d');
        data.forEach(d => {
          d.date = parseDate(d.date);
          d.value = +d.value;
        });

        // Add X axis (date format)
        const x = d3.scaleTime()
          .domain(d3.extent(data, d => d.date))
          .range([0, width]);
        const xAxis = svg.append('g')
          .attr('transform', `translate(0, ${height})`)
          .call(d3.axisBottom(x));

        // Add Y axis
        const y = d3.scaleLinear()
          .domain([0, d3.max(data, d => d.value)])
          .range([height, 0]);
        const yAxis = svg.append('g')
          .call(d3.axisLeft(y));

        // Add a clipPath: everything out of this area won't be drawn
        const clip = svg.append('defs').append('svg:clipPath')
          .attr('id', 'clip')
          .append('svg:rect')
          .attr('width', width)
          .attr('height', height)
          .attr('x', 0)
          .attr('y', 0);

        // Add brushing
        const brush = d3.brushX()
          .extent([[0, 0], [width, height]])
          .on('end', updateChart);

        // Create the line variable: where both the line and the brush take place
        const line = svg.append('g')
          .attr('clip-path', 'url(#clip)');

        // Add the line
        line.append('path')
          .datum(data)
          .attr('class', 'line')
          .attr('fill', 'none')
          .attr('stroke', 'steelblue')
          .attr('stroke-width', 1.5)
          .attr('d', d3.line()
            .x(d => x(d.date))
            .y(d => y(d.value))
          );

        // Add the brushing
        line.append('g')
          .attr('class', 'brush')
          .call(brush);

        // A function that set idleTimeOut to null
        let idleTimeout;
        function idled() { idleTimeout = null; }

        // A function that update the chart for given boundaries
        function updateChart() {
          // What are the selected boundaries?
          const extent = d3.event?.selection; // Use optional chaining (?.) to check if d3.event is defined before accessing 'selection'

          // If no selection, back to the initial coordinate. Otherwise, update X axis domain
          if (!extent) {
            if (!idleTimeout) return idleTimeout = setTimeout(idled, 350);
            x.domain([4, 8]);
          } else {
            x.domain([x.invert(extent[0]), x.invert(extent[1])]);
            line.select('.brush').call(brush.move, null);
          }

          // Update axis and line position
          xAxis.transition().duration(1000).call(d3.axisBottom(x));
          line.select('.line')
            .transition()
            .duration(1000)
            .attr('d', d3.line()
              .x(d => x(d.date))
              .y(d => y(d.value))
            );
        }

        // If user double click, reinitialize the chart
        svg.on('dblclick', function () {
          x.domain(d3.extent(data, d => d.date));
          xAxis.transition().call(d3.axisBottom(x));
          line.select('.line')
            .transition()
            .attr('d', d3.line()
              .x(d => x(d.date))
              .y(d => y(d.value))
            );
        });
      })
      .catch(error => console.error('Error fetching data:', error));

    // Optionally, you can return a cleanup function if needed.
    // For example, if you want to remove the chart when the component unmounts.
    return () => {
      svg.remove();
    };
  }, []);

  return <div id="my_dataviz" ref={chartRef}></div>;
};

export default TimeLine;
