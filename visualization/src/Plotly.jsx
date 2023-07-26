import React, { useEffect } from 'react';
import Plotly from 'plotly.js/lib/core';
import 'buffer';

const FinanceChart = () => {
  useEffect(() => {
    // URL to fetch CSV data
    const csvUrl =
      'https://raw.githubusercontent.com/plotly/datasets/master/finance-charts-apple.csv';

    // Fetch CSV data and create the plot
    fetch(csvUrl)
      .then((response) => response.text())
      .then((csvData) => { // Renamed 'data' to 'csvData'
        const rows = csvData.split('\n').map((row) => row.split(','));
        const header = rows[0];
        const values = rows.slice(1);

        function unpack(rows, key) {
          return rows.map((row) => row[header.indexOf(key)]);
        }

        const trace1 = {
          type: 'scatter',
          mode: 'lines',
          name: 'AAPL High',
          x: unpack(values, 'Date'),
          y: unpack(values, 'AAPL.High'),
          line: { color: '#17BECF' },
        };

        const trace2 = {
          type: 'scatter',
          mode: 'lines',
          name: 'AAPL Low',
          x: unpack(values, 'Date'),
          y: unpack(values, 'AAPL.Low'),
          line: { color: '#7F7F7F' },
        };

        const data = [trace1, trace2];

        const layout = {
          title: 'Time Series with Rangeslider',
          xaxis: {
            autorange: true,
            range: ['2015-02-17', '2017-02-16'],
            rangeselector: {
              buttons: [
                {
                  count: 1,
                  label: '1m',
                  step: 'month',
                  stepmode: 'backward',
                },
                {
                  count: 6,
                  label: '6m',
                  step: 'month',
                  stepmode: 'backward',
                },
                { step: 'all' },
              ],
            },
            rangeslider: { range: ['2015-02-17', '2017-02-16'] },
            type: 'date',
          },
          yaxis: {
            autorange: true,
            range: [86.8700008333, 138.870004167],
            type: 'linear',
          },
        };

        Plotly.newPlot('myDiv', data, layout);
      });
  }, []);

  return <div id="myDiv"></div>;
};

export default FinanceChart;
