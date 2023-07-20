import * as d3 from 'd3';
import { useEffect, useState } from 'react';

function LineChart(props) {
    const { width, height } = props;
    const [ data, setData ] = useState([]);

    useEffect(() => {
        if (data.length > 0) {
            drawChart();
        } else {
            generateChart();
        }
    }, [data])

    const generateChart = () => {
        const dataC = [];
        for (let i = 0; i < 20; ++i) {
            const value = Math.floor(Math.random() * i + 3);
            dataC.push({label: i, value})
        }
        setData(dataC);
    }

    const drawChart = () => {
        const margin = { top: 10, right: 50, bottom: 50, left: 50 };
        
        const yMin = d3.min(data, d => d.value);
        const yMax = d3.max(data, d => d.value);
        const xMin = d3.min(data, d => d.label);
        const xMax = d3.min(data, d => d.label);

        const svg = d3
            .select('#container')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left}), ${margin.top}`);
        
        const xScale = d3
            .scaleLinear()
            .domain([xMin, xMax])
            .range([0, width]);
        
        const yScale = d3
            .scaleLinear()
            .range([height, 0])
            .domain([0, yMax]);
        
        svg 
            .append('g')
            .attr('class', 'grid')
            .attr('transform', `translate(0, ${height})`)
            .call(
                d3.axisBottom(xScale)
                    .tickSize(-height)
                    .tickFormat(''),
            );
    }

    return (
        <>
            <h1>Line Chart</h1>        
            <div id='container'></div>    
        </>
    )
}

export { LineChart };

