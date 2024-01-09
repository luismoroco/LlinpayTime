import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import StationMapper from './components/StationMapper';
import Map from './components/Map';
import Modal from "./components/MainModal.jsx";
import Axios from "axios";
import MainTimePlot from './components/MainTimePlot';
import MUltiSeries from './components/MultiSeries';

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
          <Sidebar nam_var={variable} nam_stat={station} repository={repository} setModal={setModal} stat_name={stationName} stat_var={stationBar} />
        </div>
        <div className="w-3/4 h-full flex flex-col">
          <div className='h-1/6 bg-zinc-300 flex justify-center p-4'> 
            <div className='p-2 transition duration-150 text-2xl shadow-lg rounded h-1/2 border border-spacing-0 border-gray-500 border-solid hover:bg-zinc-400 '>
              <span>{`${station} : `}</span>
              <span className='text-blue-950'>{variable}</span>
            </div> 
          </div>
          <div className='h-5/6 '>
            <MainTimePlot /> 
          </div>
        </div>
      </div> 
      <div className="w-full h-1/3 flex flex-row"> 
        <div className="w-1/4 bg-gray-300">
          <Map stationes={stations} setStat={setStation} setVar={setVariable} repository={repository} variables={vars} />
        </div>
        <div className="w-3/4 flex flex-col">
          <StationMapper stations_inf={stations} />
        </div>
      </div>
    </div>
  );
}

export default App;