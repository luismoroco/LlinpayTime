import React from 'react';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <div className="w-full h-full flex flex-col" style={{ height: '100vh', width: '100vw' }}>
      <div className="w-full h-3/4 flex flex-row">
        <div className="w-1/4">
          <Sidebar />
        </div>
        <div className="w-3/4"> MAIN </div>
      </div>
      <div className="w-full h-1/4 flex flex-row">
        <div className="w-1/4"> STATIONS </div>
        <div className="w-3/4"> MIN-VIS </div>
      </div>
    </div>
  );
}

export default App;