import React, { useState, useEffect } from 'react';
import PlotlyTime from './PlotlyTime';
import Axios from "axios";
import BoxPlotPlotly from './BoxPlot';
import axios from 'axios';

export default function StationTimePlot({ color, stations }) {
  const [station, setStation] = useState("");
  const [vari, setVari] = useState("");
  const [vars, setVars] = useState([]);

  const [info, setInfo] = useState(null);

  useEffect(() => {
    if (stations && stations.length > 0) {
      setStation(stations[0].id);
      setVars(stations[0].vars)
    }
  }, [stations]); 
  
  useEffect(() => {
    if (station && stations) {
      const item = stations.find(x => x.id === station);
      if (item) {
        setVars(item.vars); 
      }
    }  
  }, [station]);   
  
  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await Axios.get(
          `http://127.0.0.1:5000/var_station/air-quality-madrid&${station}&${vari}`
        );
        
        setInfo(data.data.info);
        //setTimeout(fetch, 1000);  
      } catch (error) {
        console.log("PIPIPI");
      }
      if (!data.data.state) {  
        setTimeout(fetch, 1000);
      } 
    }

    if (station && vari) {
      fetch();
    }
  }, [station, vari]);

  return (
    <div className='w-full h-1/2 bg-stone-100 flex flex-row'>
      <div className='w-1/5 flex flex-col'>
        <div className='w-full flex flex-row h-1/6'>
          <div className='w-1/2'>
            <select
              className="block w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
              value={station}
              onChange={(e) => setStation(e.target.value)}
            >
              {stations.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
          <div className='w-1/2'>
            <select
              value={vari}
              onChange={(e) => { setVari(e.target.value) }}
              className="block w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
            >
              {vars.map((option) => (
                option.percent_nan != 100 && (<option className={`text-zinc-800`} key={option.name} value={option.name}>
                  {`${option.name}, ${option.percent_nan.toFixed(1)}`}
                </option>)
              ))}
            </select>
          </div>
        </div>
        {info && (
          <div className='w-full flex flex-row h-1/6'>
            <div className='w-1/3 block p-2 bg-slate-300  rounded border border-gray-300 focus:outline-none focus:ring focus:border-blue-300'>FROM</div>
            <div className='w-2/3 block p-2  rounded border border-gray-300 focus:outline-none focus:ring focus:border-blue-300'>{info.from_d}</div>
          </div>
        )}
        {info && (
          <div className='w-full flex flex-row h-1/6'>
            <div className='w-1/3 block p-2 bg-slate-400  rounded border border-gray-300 focus:outline-none focus:ring focus:border-blue-300'>p_value</div>
            <div className='w-2/3 block p-2  rounded border border-gray-300 focus:outline-none focus:ring focus:border-blue-300'>{info.p_value}</div>
          </div>
        )} 
        {info && (
          <div className='w-full flex flex-row h-1/6'>
            <div className='w-1/3 block p-2 bg-stone-500  rounded border border-gray-300 focus:outline-none focus:ring focus:border-blue-300'>trend</div>
            <div className='w-2/3 block p-2  rounded border border-gray-300 focus:outline-none focus:ring focus:border-blue-300'>{info.trend}</div>
          </div>
        )}
        {info && (
          <div className='w-full flex flex-row h-1/6'>
            <div className='w-1/3 block p-2 bg-amber-700  rounded border border-gray-300 focus:outline-none focus:ring focus:border-blue-300'>FILLED</div>
            <div className='w-2/3 block p-2  rounded border border-gray-300 focus:outline-none focus:ring focus:border-blue-300'>{info.method_fill}</div>
          </div>
        )}
        {info && (
          <div className='w-full flex flex-row h-1/6'>
            <div className='w-1/3 block p-2 bg-slate-300  rounded border border-gray-300 focus:outline-none focus:ring focus:border-blue-300'>TO</div>
            <div className='w-2/3 block p-2  rounded border border-gray-300 focus:outline-none focus:ring focus:border-blue-300'>{info.to_d}</div>
          </div>
        )}
      </div>
      <div className='w-3/5'>
        <PlotlyTime
          color={color}
          stat={station}
          varia={vari}
        />
      </div>
      <div className='w-1/5'>
        <BoxPlotPlotly
          color={color}
          stat={station}
          varia={vari}
        />
      </div>
    </div>
  )
}