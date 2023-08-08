import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import StationMapper from './components/StationMapper';
import Map from './components/Map';
import PlotlyTime from './components/PlotlyTime';
import Modal from "./components/MainModal.jsx";
import Axios from "axios";
import TimeLocal from './components/TimeLocal';
import DateRangePicker from './components/RangeDatePicker';
import RadialBarChart from './components/RadialChart';
import RadialBarChartC from './components/RadialChart';

function App() {
  const [modal, setModal] = useState(true);
  const [repository, setRepository] = useState("air-quality");

  const [stations, setStations] = useState([]);
  const [vars, setVars] = useState([]);

  const [station, setStation] = useState("");
  const [stationName, setStationName] = useState("");
  const [stationBar, setStationBar] = useState([]);
  
  useEffect(() => {
    const fetch = async () => { 
      const data = await Axios.get(
        `http://127.0.0.1:5000/repository/${repository}`
      );
 
      setStations(data.data.info);
      setVars(data.data.vars);
    }
  
    fetch(); 
  }, [repository]);

  useEffect(() => {
    const info = stations.find(item => item.id === station);
    if (info) {
      setStationName(info.name);
      setStationBar(info.vars);
    }
  }, [station])

 
  const x = 0;
  
  const [variable, setVariable] = useState(null); 

  return (
    <div className="w-full h-full flex flex-col bg-slate-300" style={{ height: '100vh', width: '100vw' }}>
      <Modal setMainRepo={setRepository} modal={modal} setModal={setModal} />
      <div className="w-full h-2/3 flex flex-row ">
        <div className="w-1/4 bg-gray-100">
          <Sidebar repository={repository} setModal={setModal} stat_name={stationName} stat_var={stationBar}/>
        </div>
        <div className="w-3/4">
          <RadialBarChartC />
        </div>  
      </div>
      <div className="w-full h-1/3 flex flex-row">
        <div className="w-1/4 bg-gray-300">
          <Map stationes={stations} setStat={setStation} setVar={setVariable} repository={repository} variables={vars} />
        </div>
        <div className="w-3/4 flex flex-col">
          <StationMapper />
        </div>
      </div>
    </div>
  );
}

export default App;

/**

  return (
    <div className="w-full h-full flex flex-col bg-amber-900" style={{ height: '100vh', width: '100vw' }}>
      <Modal />
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


 */