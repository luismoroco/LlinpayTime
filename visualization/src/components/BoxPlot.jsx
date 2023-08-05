import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import * as d3 from 'd3';

const rawDataURL = 'https://raw.githubusercontent.com/plotly/datasets/master/2016-weather-data-seattle.csv';
const yField = 'Mean_TemperatureC';

function BoxPlotPlotly() {
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
        const y = rawData.map(datum => datum[yField]);

        return [{
            y: y,
            boxpoints: 'outliers',
            jitter: 0.3,
            pointpos: -1.8,
            type: 'box'
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
                    width: 300,
                    height: 165,
                    autosize: true,
                    xaxis: {
                        showgrid: false,
                        zeroline: false,
                    },
                    yaxis: {
                        showline: false,
                        fixedrange: true,
                    },
                    margin: {
                        l: 0,
                        r: 0,
                        b: 0,
                        t: 0
                    }
                }}
                config={config}
            />
        </div>
    );
}

export default BoxPlotPlotly;
