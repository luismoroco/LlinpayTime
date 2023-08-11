import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import * as d3 from 'd3';

const MainTimePlot = () => {
  const xField = 'date';
  const stat = "28079008"
  var rawDataURL;
  var yField;
  var varia = "CO";

  const [data, setData] = useState([]);
  const [nanIndices, setNanIndices] = useState([]); 

  const [series, setSeries] = useState([]);
  const [seriesCounter, setSeriesCounter] = useState(0);
 
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
    const data = [];
    const nanIndices = [];

    rawData.forEach(function (datum, i) {
      data.push(new Date(datum[xField]), datum[yField]);

      if (isNaN(parseFloat(datum[yField]))) { 
        nanIndices.push(i);
      }
    });

    setNanIndices(nanIndices); 

    return data;
  }





  const createRandomData = (now, max) => {
    const data = [];
    for (let i = 0; i < 100; i++) { 
      data.push([now + i * 1000, Math.round(Math.random() * max)]);
    }
    return data; 
  };
 
  const createRandomSeries = (index) => { 
    return {
      name: `Series${index}`, 
      data: createRandomData(Date.now(), 1e8)
    };
  }; 

  const handleAddSeries = () => {
    setSeriesCounter((prevCounter) => prevCounter + 1);
    setSeries((prevSeries) => [...prevSeries, createRandomSeries(seriesCounter + 1)]);
  };

  const handleRemoveSeries = () => {
    if (series.length > 0) {
      const randomIndex = Math.floor(Math.random() * series.length);
      setSeries((prevSeries) => prevSeries.filter((_, index) => index !== randomIndex));
    }
  };


  return (
    <div className="app" style={{ width: '99%', height: '100%' }}>
      <HighchartsReact
        highcharts={Highcharts}
        options={{
          title: {
            text: 'Dynamically add/remove series'
          },
          legend: {
            align: 'left', 
            title: {
              text: 'Legend'
            }
          },
          xAxis: {
            type: 'datetime',
            title: {
              text: 'Time'
            }
          },
          yAxis: {
            title: {
              text: 'Value'
            }
          },
          series: series.map(({ name, data }) => ({ name, data }))
        }}
      />

      <div className="btn-toolbar" role="toolbar">
        <button className="btn btn-primary" onClick={handleAddSeries}>
          Add line series
        </button>
        <button className="btn btn-danger" onClick={handleRemoveSeries}>
          Remove line series
        </button>
      </div>
    </div>
  );
};

export default MainTimePlot;