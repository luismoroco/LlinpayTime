import React from 'react';
import Title from './Title';
import "../components/style/map.css";
import WorldMap from './WorldMap';

export default function MapGeoJSON() {
  return (
    <div className='w-full flex flex-col'>
      <div className='w-1/6'>
        <Title
          title={'Stations'}
          style={'text-2xl'}
        />
      </div>
      <div className='w-5/6'>
        <WorldMap width={window.innerWidth * 0.30} height={window.innerHeight * 3.0} />
      </div>
    </div>
  )
}
