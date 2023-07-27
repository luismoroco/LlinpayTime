import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import axios from "axios";

const markers = [
  { "name": "Marker 1", "latitude": 40.423852777777775, "longitude": -3.712247222222224, "color": "red" },
  { "name": "Marker 2", "latitude": 40.42156388888888, "longitude": -3.682319444444445, "color": "blue" },
  { "name": "Marker 3", "latitude": 40.451475, "longitude": -3.6773555555555553, "color": "green" }
];

function WorldMap({ width, height }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // The svg
    const svg = d3.select(svgRef.current);

    // Get container dimensions
    const container = containerRef.current;
    const containerWidth = width || container.clientWidth;
    const containerHeight = height || container.clientHeight;

    // Update SVG dimensions
    svg.attr("width", containerWidth).attr("height", containerHeight);

    // Map and projection
    const projection = d3.geoMercator()
      .center([2, 47])
      .scale(980)
      .translate([containerWidth / 2, containerHeight / 2]);

    // Load external data and draw the map
    axios.get("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
      .then(response => {
        const data = response.data;

        // Filter data
        data.features = data.features.filter(d => d.properties.name === "Spain");

        // Draw the map
        svg.selectAll(".map-path")
          .data(data.features)
          .enter()
          .append("path")
          .attr("class", "map-path")
          .attr("fill", "grey")
          .attr("d", d3.geoPath().projection(projection))
          .style("stroke", "none");

        // Draw markers
        svg.selectAll(".marker")
          .data(markers)
          .enter()
          .append("circle")
          .attr("class", "marker")
          .attr("cx", d => projection([d.longitude, d.latitude])[0])
          .attr("cy", d => projection([d.longitude, d.latitude])[1])
          .attr("r", 5)
          .attr("fill", d => d.color);
      })
      .catch(error => {
        console.error("Error loading data:", error);
      });
  }, [width, height]);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "500px" }}>
      <svg ref={svgRef} width="100%" height="100%">
      </svg>
    </div>
  );
}

export default WorldMap;