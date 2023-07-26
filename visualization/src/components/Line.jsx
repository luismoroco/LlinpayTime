import React, { useState, useEffect, useRef } from 'react';
import * as d3 from "d3";

export default function LineChart({ width, height }) {
    const svgRef = useRef(null);
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const fetchedData = await d3.csv('https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv');
            var parseTime = d3.timeParse("%Y-%m-%d");

            fetchedData.forEach((d) => {
                d.date = parseTime(d.date);
                d.value = +d.value;
            });

            setData(fetchedData);
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (data.length > 0) {
            var margin = { top: 20, right: 20, bottom: 50, left: 70 },
                chartWidth = width - margin.left - margin.right,
                chartHeight = height - margin.top - margin.bottom;

            var svg = d3.select(svgRef.current)
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`);

            var x = d3.scaleTime().range([0, chartWidth]);
            var y = d3.scaleLinear().range([chartHeight, 0]);

            x.domain(d3.extent(data, (d) => { return d.date; }));
            y.domain([0, d3.max(data, (d) => { return d.value; })]);

            svg.append("g")
                .attr("transform", `translate(0, ${chartHeight})`)
                .call(d3.axisBottom(x));

            svg.append("g")
                .call(d3.axisLeft(y));

            var valueLine = d3.line()
                .x((d) => { return x(d.date); })
                .y((d) => { return y(d.value); });

            svg.append("path")
                .data([data])
                .attr("class", "line")
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                .attr("d", valueLine);
        }
    }, [data, width, height]);

    return (
        <svg ref={svgRef} />
    )
}
