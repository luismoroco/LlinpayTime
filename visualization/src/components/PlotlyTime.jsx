import React from 'react';
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
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    // Fetch the CSV data
    d3.csv(rawDataURL, function (err, rawData) {
      if (err) throw err;

      const formattedData = prepData(rawData);
      setData(formattedData);
    });
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
