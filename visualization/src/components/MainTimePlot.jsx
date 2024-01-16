import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import * as d3 from 'd3';


export default function MainTimePlot({station, variable}) {
  const xField = 'date';
  //const stat = "28079008"
  var rawDataURL;
  var yField; 
  //var varia = "CO";

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
 
    if (station && variable) {
      rawDataURL = `https://raw.githubusercontent.com/luismoroco/LlinpayTime/main/server-side/load/air-quality-madrid/${station}_${variable}.csv`;
      yField = variable;
      fetchData();
    }

  }, [station, variable]); 
 
  function prepData(rawData) {
    const data = [];
    const nanIndices = [];

    rawData.forEach(function (datum, i) {
      data.push([new Date(datum[xField]).getTime(), parseFloat(datum[yField])]);
    });

    return data;  
  }   
 
  const createRandomData = (now, max) => {
    const data_random = []; 
    for (let i = 0; i < 15000; i++) { 
      data_random.push([now + i * 1000, Math.round(Math.random() * max)]);
    }
    return data_random; 
  };   
  
  const createRandomSeries = (index) => { 
    if (!data) {
      console.log("NO EXISTE AÚN!")
      return {
        name: `Series${index}`,
        data: createRandomData(Date.now(), 1e8)
      }
    }

    return {
      name: `Series${index}`, 
      data: data
    };
  }; 

  useEffect(() => {
    console.log("DATA MAIN SERIES", data.length, data[1]);
    
    if (data.length > 0) {
      console.log("LLEGARON! :'V")
    }
  }, [data]);

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
            text: 'General Time Series VIEW'
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
