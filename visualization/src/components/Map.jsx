import React, { useMemo, useState } from 'react';
import Title from './Title';
import { GoogleMap, Marker, useLoadScript, InfoWindow } from "@react-google-maps/api";
import "../components/style/map.css";
import { contaminants, stations } from '../data/air_quality';

import { ArrowSmallUpIcon, CursorArrowRippleIcon, IdentificationIcon } from '@heroicons/react/24/solid'
import NanPercent from './NanPercent';

export default function Map() {
  const [selectedOption, setSelectedOption] = useState(contaminants[0]);
  const [selectedStation, setSelectedStation] = useState(null);
 
  const handleChange = (event) => { 
    setSelectedOption(event.target.value);  
  };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "",
  });
  const center = useMemo(() => ({ lat: 40.423852777777775, lng: -3.712247222222224 }), []);
 
  const getFillColor = (number) => {
    if (number >= 100)
      return 'white' 
    if (number < 5) { 
      return 'green'; 
    } else if (number >= 5 && number < 10) {
      return 'orange';
    } else {
      return 'red';
    }
  };

  const circleIcon = (number) => ({
    path: "M 0,0 m -5,0 a 5,5 0 1,0 10,0 a 5,5 0 1,0 -10,0",
    fillColor: getFillColor(number),
    fillOpacity: 1,
    strokeWeight: 2,
    scale: 3.5,   
  });

  const spacing = ""

  return (
    <>
      <div className='w-full flex flex-row align-middle items-center'>
        <div className='w-1/2 justify-self-center'>
          <Title
            title={'Stations'}
            style={'text-2xl'}
          />
        </div> 
        <div className='w-1/2'>
          <select
            value={selectedOption}
            onChange={handleChange}
            className="block w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
          >
            {contaminants.map((option) => (
              <option key={option.value} value={option.value}>
                {option.value}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className='w-full flex flex-row border-black border-2'>
        <div className='w-1/4 bg-white p-0.5 text-center font-medium'> {'NOT'} </div>
        <div className='w-1/4 bg-green-700 p-0.5 text-center font-medium text-zinc-50'>  {'<5%'} </div>
        <div className='w-1/4 bg-orange-600 p-0.5 text-center font-medium text-zinc-50'>  {'<10%'} </div>
        <div className='w-1/4 bg-red-600 p-0.5 text-center font-medium text-zinc-50'>  {'>20%'} </div>
      </div>
      <GoogleMap
        mapContainerClassName="map-container"
        center={center}
        zoom={10}
        mapContainerStyle={{ width: '100%', height: '100%' }}
        options={{
          zoomControl: false 
        }}
      >
        {isLoaded && stations.map(({ id, elevation, lat, lng, contaminantes, name }) => {
          const contaminant = contaminantes.find(
            (contaminante) => contaminante.name === selectedOption
          );
          const percentNull = contaminant?.percent_null ?? 100.00;

          return (
            <Marker   
              key={id}
              position={{ lat, lng }}
              icon={circleIcon(percentNull)}
              onClick={() => setSelectedStation({ id, name })}
            >
              {selectedStation?.id === id && (
                <InfoWindow onCloseClick={() => setSelectedStation(null)}>
                  <div>
                    <h2 className='font-medium text-center'>{name}</h2>
                    <div className='w-full flex flex-row items-center'>
                      <IdentificationIcon className='mr-3 w-7 h-7'/>
                      <p className='font-light'> {id} </p>
                    </div>
                    <div className='w-full flex flex-row items-center'>
                      <CursorArrowRippleIcon className='mr-3 w-7 h-7' />
                      <p className='font-medium'> {`${selectedOption}:  ${spacing}`}</p>
                      <NanPercent nan={Number(percentNull.toFixed(3))} />
                    </div>

                    <div className='w-full flex flex-row items-center'>
                      <ArrowSmallUpIcon className='mr-3 w-7 h-7' />
                      <p> {elevation} </p>
                    </div>
                  </div> 
                </InfoWindow>
              )}
            </Marker> 
          );  
        })}
      </GoogleMap>
    </>
  )
}
