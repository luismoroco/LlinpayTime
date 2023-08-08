import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import * as d3 from 'd3';

const rawDataURL = 'https://raw.githubusercontent.com/plotly/datasets/master/2016-weather-data-seattle.csv';
const test_rawURL = 'http://127.0.0.1:5000/get_csv_test'
const xField = 'Date'; //xField
const yField = 'Mean_TemperatureC'; //yField
const filePath = '../data/2016-weather-data-seattle.csv';

const selectorOptions = {
  buttons: [
    // ...
  ],
}; 

function PlotlyTime({color}) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await d3.csv(rawDataURL);
      //const csvData = await fs.promises.readFile(filePath, 'utf-8');
      //const fetchedData = d3.csvParse(csvData);
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
      y: y,
        marker: {
          color: color
        }
    }];
  }

  const config = {
      displayModeBar: false,
  };

  return (
      <div style={{ width: '100%', height: '100%', border: 'none' }}>
        <Plot
            data={data}
            layout={{
              width: 820,
              height: 165,
              autosize: true,
              xaxis: {
                rangeselector: selectorOptions,
                rangeslider: {}
              },
              yaxis: {
                fixedrange: true
              },
                margin: {
                    l: 20,
                    r: 20,
                    b: 20,
                    t: 20
                }
            }}
            config={config}
        />
      </div>
  );
}

export default PlotlyTime;