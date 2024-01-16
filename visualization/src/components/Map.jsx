import React, { useMemo, useState} from 'react';
import Title from './Title';
import { GoogleMap, Marker, useLoadScript, InfoWindow } from "@react-google-maps/api";
import "../components/style/map.css";

import { circleIcon, spacing } from './utils';
import { CursorArrowRippleIcon, IdentificationIcon } from '@heroicons/react/24/solid'
import NanPercent from './NanPercent';

export default function Map({setStat, setVar, repository, variables, stationes}) {
  const [selectedOption, setSelectedOption] = useState(variables[0]);
  const [selectedStation, setSelectedStation] = useState(null);

  const handleChangeContaminant = (event) => {
    setSelectedOption(event.target.value);
    setVar(event.target.value);  
  };   
 
  const handleChangeStation = (id, name) => {  
    setSelectedStation({id, name});
    setStat(id);
  }
 
  const { isLoaded } = useLoadScript({ 
    googleMapsApiKey: "",
  });
  const center = useMemo(() => ({ lat: 40.423852777777775, lng: -3.712247222222224 }), []);


  return (
    <>
      <div className='w-full flex flex-row align-middle items-center shadow-inner'>
        <div className='w-4/5 justify-self-center'>
          <Title
            title={'Stations'}
            style={'text-2xl'} 
          />    
        </div>  
        <div className='w-1/5'>
          <select 
            value={selectedOption}
            onChange={handleChangeContaminant}
            className="block w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
          >
            {variables.map((option) => (
              <option key={option.name} value={option.name}>
                {option.name}
              </option>  
            ))}   
          </select>
        </div>  
      </div>
      <div className='w-full flex flex-row border-black border-2'>
        <div className='w-1/4 bg-white p-0.5 text-center font-medium'> {'NA'} </div>
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
        {isLoaded && stationes.map(({ id, lat, lng, vars, name, len_vars }) => {
          const contaminant = vars.find(
            (contaminante) => contaminante.name === selectedOption
          );
          const percentNull = contaminant?.percent_nan ?? 100.00;

          return (
            <Marker
              key={id}
              position={{ lat, lng }}
              icon={circleIcon(percentNull, len_vars, vars.length)}
              onClick={() => handleChangeStation( id, name )}
            >
              {selectedStation?.id === id && (
                <InfoWindow onCloseClick={() => setSelectedStation(null)}>
                  <div>
                    <h2 className='font-medium text-center'>{name}</h2>
                    <div className='w-full flex flex-row items-center'>
                      <IdentificationIcon className='mr-3 w-7 h-7' />
                      <p className='font-light'> {id} </p>
                    </div>
                    <div className='w-full flex flex-row items-center'>
                      <CursorArrowRippleIcon className='mr-3 w-7 h-7' />
                      <p className='font-medium'> {`${selectedOption}:  ${spacing}`}</p>
                      <NanPercent nan={Number(percentNull.toFixed(3))} />
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
