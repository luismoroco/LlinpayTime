import React, { useState } from 'react';
import LineChart from './Line';
import BoxPlot from './Box';

export default function StationMapper() {

  return (
    <>
      <div className='w-full h-1/2 bg-stone-100 flex flex-row'>
        <div className='w-1/5'>INFO</div>
        <div className='w-3/5'>
          <LineChart width={window.innerWidth * 0.45} height={window.innerHeight * 0.20} />
        </div>
        <div className='w-1/5'>
          <BoxPlot width={window.innerWidth * 0.18} height={window.innerHeight * 0.18} />
        </div>
      </div>
      <div className='w-full h-1/2 bg-stone-200 flex flex-row'>
        <div className='w-1/5'>INFO</div>
        <div className='w-3/5'>LINE</div>
        <div className='w-1/5'>BOX</div>
      </div>
    </>
  )
}