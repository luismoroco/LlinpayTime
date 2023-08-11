import React from 'react';
import StationTimePlot from './StationTimePlot';


export default function StationMapper({ stat, vari, stations_inf }) {
    return (
        <>
            <StationTimePlot color={'DarkSlateGrey'} stations={stations_inf}/>
            <StationTimePlot stations={stations_inf}/>
        </>
    );
}
  