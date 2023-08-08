import React, { useState, useEffect } from 'react';
import BoxPlot from './Box';
import PlotlyTime from "./PlotlyTime.jsx";
import Axios from 'axios';

export default function StationMapper({ stat, vari }) {
    const [dataA,setDataA] = useState([]);
    const [stationA, setStationA] = useState(null); 

    useEffect(() => {
        const fetch = async () => {
            const x = await Axios.get(
                `http://127.0.0.1:5000/var_station/air-quality-madrid&${"28079004"}&${"PM10"}`
            );
            setStationA(x.data); 
        }; 
        //fetch();
    }, []);

    useEffect(() => {
        const fetchCSV = async () => {
            const x = await Axios.get(
                `http://127.0.0.1:5000/get_csv`, {
                    path: "/media/lmoroco/D/5TO/TDS/LlinpayTime/server-side/volume/air-quality-madrid/load/air-quality-madrid_28079024_NO.csv"
                }
            );
            setDataA(x.data);
        };
        //fetchCSV();
    }, []);

    return (
        <>
            <div className='w-full h-1/2 bg-stone-100 flex flex-row'>
                <div className='w-1/5 p-2 flex flex-col'>
                    INFO
                </div>
                <div className='w-3/5'>
                    <PlotlyTime />
                </div>
                <div className='w-1/5'>
                    <BoxPlot
                        width={window.innerWidth * 0.18}
                        height={window.innerHeight * 0.18}
                        color={'#69b3a2'}
                    />
                </div>
            </div>
            <div className='w-full h-1/2 bg-stone-200 flex flex-row'>
                <div className='w-1/5'>INFO</div>
                <div className='w-3/5'>
                    <PlotlyTime color={'DarkSlateGrey'} />
                </div>
                <div className='w-1/5'>
                    <BoxPlot
                        width={window.innerWidth * 0.18}
                        height={window.innerHeight * 0.18}
                        color={'orange'}
                    />
                </div>
            </div>
        </>
    );
}
