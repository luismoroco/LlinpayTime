import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import Papa from 'papaparse';

const TimeLocal = () => {
  const [csvData, setCsvData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('public/data/air-quality-madrid_28079024_PM10.csv'); 
      const reader = response.body.getReader();
      const result = await reader.read();
      const text = new TextDecoder().decode(result.value);
      const parsed = Papa.parse(text, { header: true });
      setCsvData(parsed.data);
    };

    fetchData();
  }, []);

  return ( 
    <div className="App"> 
      {csvData && (
        <Plot
          data={[
            {
              x: csvData.map(item => item.date),
              y: csvData.map(item => item.data),
              type: 'scatter',
              mode: 'lines+markers',
              marker: { color: 'blue' },
            }
          ]}
          layout={{
            title: 'Time Series Data Visualization',
            xaxis: { title: 'Date' },
            yaxis: { title: 'Data' },
          }}
        />
      )}
    </div>
  );
};

export default TimeLocal;
