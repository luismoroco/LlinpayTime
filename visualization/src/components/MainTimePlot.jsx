import React, { useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const MainTimePlot = () => {
  const [series, setSeries] = useState([]);
  const [seriesCounter, setSeriesCounter] = useState(0);

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

  const renderSeries = ({ name, data }) => {
    return <HighchartsReact.LineSeries name={name} key={name} data={data} />;
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
              text: 'Price'
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