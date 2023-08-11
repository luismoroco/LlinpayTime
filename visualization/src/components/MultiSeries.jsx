import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import * as d3 from 'd3';

const MUltiSeries = () => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      const response = await d3.csv("https://raw.githubusercontent.com/plotly/datasets/master/finance-charts-apple.csv");
      const rows = response.map(row => {
        const newRow = {};
        for (const key in row) {
          newRow[key] = isNaN(row[key]) ? row[key] : parseFloat(row[key]);
        }
        return newRow;
      });
      
      const unpack = (rows, key) => rows.map(row => row[key]);
      
      const trace1 = {
        type: "scatter",
        mode: "lines",
        x: unpack(rows, 'Date'),
        y: unpack(rows, 'AAPL.High'),
        line: { color: '#17BECF' }
      };
      
      const trace2 = {
        type: "scatter",
        mode: "lines",
        x: unpack(rows, 'Date'),
        y: unpack(rows, 'AAPL.Low'),
        line: { color: '#7F7F7F' }
      };
      
      setData([trace1, trace2]);
    };

    fetchData();
  }, []);

  const layout = {
    title: 'Custom Range',
    xaxis: {
      range: ['2016-07-01', '2016-12-31'],
      type: 'date'
    },
    yaxis: {
      autorange: true,
      range: [86.8700008333, 138.870004167],
      type: 'linear'
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', border: 'none' }}>
      <Plot
        data={data}
        layout={{
          width: 1050,
          height: 205, 
          autosize: true,
          xaxis: {
            rangeslider: {},
          },
          yaxis: {
            fixedrange: true,
          },
          margin: {
            l: 30,
            r: 20,
            b: 20,
            t: 20,
          }, 
          //shapes: shapes, 
        }}
        config={config}
      />
    </div>
  );
};

export default MUltiSeries;
