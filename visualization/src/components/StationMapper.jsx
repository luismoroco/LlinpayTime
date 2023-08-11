import React, { useState, useEffect } from 'react';
import BoxPlot from './Box';
import PlotlyTime from "./PlotlyTime.jsx";
import Axios from 'axios';
import StationTimePlot from './StationTimePlot';


export default function StationMapper({ stat, vari, stations_inf }) {
    const [dataA, setDataA] = useState([]);
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
            <StationTimePlot color={'DarkSlateGrey'} stations={stations_inf}/>
            <StationTimePlot stations={stations_inf}/>
        </>
    );
}
 