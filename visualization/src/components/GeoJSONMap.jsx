import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const GeoJSONMap = ({ data, width, height }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    const projection = d3.geoMercator()
      .fitSize([width, height], data); // Ajusta la proyección para ajustar el GeoJSON al tamaño especificado

    const path = d3.geoPath().projection(projection);

    // Dibuja las características del GeoJSON
    svg.selectAll("path")
      .data(data.features)
      .enter()
      .append("path")
      .attr("d", path)
      .style("fill", "grey")
      .style("stroke", "black")
      .style("stroke-width", 0.5);
  }, [data, width, height]);

  return (
    <svg ref={svgRef} width={width} height={height}>
      {/* El mapa será dibujado dentro de este elemento SVG */}
    </svg>
  );
};

export default GeoJSONMap;