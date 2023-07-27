import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import * as d3 from 'd3';

const rawDataURL = 'https://raw.githubusercontent.com/plotly/datasets/master/2016-weather-data-seattle.csv';
const xField = 'Date';
const yField = 'Mean_TemperatureC';

const selectorOptions = {
  buttons: [
    // ...
  ],
};

function PlotlyTime() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await d3.csv(rawDataURL);
      const formattedData = prepData(fetchedData);
      
      setData(formattedData);
    };

    fetchData();
  }, []);


  function prepData(rawData) {
    const x = []; 
    const y = [];

    rawData.forEach(function (datum, i) {
      x.push(new Date(datum[xField]));
      y.push(datum[yField]);
    });

    return [{
      type: 'scatter',
      mode: 'lines',
      x: x,
      y: y
    }];
  }

  return (
    <div>
      <Plot
        data={data}
        layout={{
          title: 'Time series with range slider and selectors',
          xaxis: {
            rangeselector: selectorOptions,
            rangeslider: {}
          },
          yaxis: {
            fixedrange: true
          }
        }}
      />
    </div>
  );
}

export default PlotlyTime;
