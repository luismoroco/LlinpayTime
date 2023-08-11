import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import * as d3 from 'd3';

function PlotlyTime({color, stat, varia}) {
  const [data, setData] = useState([]);
  
  const xField = 'date'; 
  var rawDataURL;
  var yField; 
 
  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await d3.csv(rawDataURL);
      const formattedData = prepData(fetchedData);

      setData(formattedData);
    }; 
    
    if (stat && varia) {
      rawDataURL = `https://raw.githubusercontent.com/luismoroco/LlinpayTime/main/server-side/load/air-quality-madrid/${stat}_${varia}.csv`;
      yField = varia;
      fetchData();
    }
  }, [stat, varia]);   


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
              width: 1050,
              height: 205,
              autosize: true,
              xaxis: {
                rangeslider: {}
              },
              yaxis: {
                fixedrange: true
              },
                margin: {
                    l: 30,
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