import React from 'react';
import Sidebar from './components/Sidebar';
import StationMapper from './components/StationMapper';
import WorldMap from './components/WorldMap';
import Map from './components/Map';

function App() {
  return (
    <div className="w-full h-full flex flex-col" style={{ height: '100vh', width: '100vw' }}>
      <div className="w-full h-2/3 flex flex-row">
        <div className="w-1/4 bg-gray-100">
          <Sidebar />
        </div>
        <div className="w-3/4">
        <WorldMap />
        
        </div>
      </div>
      <div className="w-full h-1/3 flex flex-row">
        <div className="w-1/4 bg-gray-300">
          <Map />
        </div>
        <div className="w-3/4 flex flex-col">
          <StationMapper />
        </div>
      </div>
    </div>
  );
}

export default App;