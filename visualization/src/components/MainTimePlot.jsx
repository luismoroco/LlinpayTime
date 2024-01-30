import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import * as d3 from 'd3';
import Axios from "axios";


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

  const [imputationMethod, setImputationMethod] = useState("")
 
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
      setSeries([])
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
      //console.log("NO EXISTE AÚN!")
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
    //console.log("DATA MAIN SERIES", data.length, data[1]);
    
    if (data.length > 0) { 
      //console.log("LLEGARON! :'V")
    }
  }, [data]);

  const handleAddSeries = () => {
    setSeriesCounter((prevCounter) => prevCounter + 1);
    setSeries((prevSeries) => [...prevSeries, createRandomSeries(seriesCounter + 1)]);
  };

  const handleRemoveSeries = () => {
    setSeries([])
    //if (series.length > 0) {
    //  const randomIndex = Math.floor(Math.random() * series.length);
    //  setSeries((prevSeries) => prevSeries.filter((_, index) => index !== randomIndex));
    //} 
  };

  const handleImputationApplying = async (e) => {
    setImputationMethod(e.target.value); 
   
    if (imputationMethod && station && variable) {
      try {
        const data = await Axios.get(
          `http://127.0.0.1:5000/imputation/air-quality-madrid&${station}&${variable}/${imputationMethod}`
        ); 
        
        console.log("DATAAAAAAAAA------->", data)
 
        if (data.data.state) {
          setSeriesCounter((prevCounter) => prevCounter + 1);
          setSeries((prevSeries) => [...prevSeries, {
            name: `${imputationMethod}`, 
            data: prepData(data)
          }]);
        }
      } catch (e) {
        console.log(e)
      }
    }
  }

  const impMethods = [
    {id: 1, name : "NEAREST_NEIGHBOR"},
    {id: 2, name : "LINEAR_INTERPOLATION"},
    {id: 3, name : "SPLINE_INTERPOLATION"} 
  ]


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
          Load Dataset
        </button>
        <button className="btn btn-danger" onClick={handleRemoveSeries}>
          Clear Series
        </button>
      </div> 
      <div>
        <h1>SELECT A IMPUTATION METHOD</h1>
        <div className='w-1/2'>
            <select
              className="block w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
              value={imputationMethod}
              onChange={handleImputationApplying}
            >
              {impMethods.map((option) => (
                <option key={option.id} value={option.name}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
      </div>
    </div>
  );
};
