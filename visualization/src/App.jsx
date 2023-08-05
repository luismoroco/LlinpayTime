import React, {useEffect, useState} from 'react';
import Sidebar from './components/Sidebar';
import StationMapper from './components/StationMapper';
import Map from './components/Map';
import PlotlyTime from './components/PlotlyTime';
import {contaminants, stations} from "./data/air_quality.jsx";

function App() {
    const x = 0;
    const [station, setStation] = useState(null);
    const [variable, setVariable] = useState(null);

    useEffect(() => {
        setStation(stations[0].id)
        setVariable(contaminants[0].value)
    }, [x]);

  return (
    <div className="w-full h-full flex flex-col bg-amber-900" style={{ height: '100vh', width: '100vw' }}>
      <div className="w-full h-2/3 flex flex-row">
        <div className="w-1/4 bg-gray-100">
          <Sidebar />
        </div>
        <div className="w-3/4">
          <PlotlyTime />
        </div>
      </div>
      <div className="w-full h-1/3 flex flex-row">
        <div className="w-1/4 bg-gray-300">
          <Map setStat={setStation} setVar={setVariable} />
        </div>
        <div className="w-3/4 flex flex-col">
          <StationMapper stat={station} vari={variable} />
        </div>
      </div>
    </div>
  );
}

export default App;