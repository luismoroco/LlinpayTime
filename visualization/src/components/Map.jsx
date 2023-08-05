import React, { useMemo, useState} from 'react';
import Title from './Title';
import { GoogleMap, Marker, useLoadScript, InfoWindow } from "@react-google-maps/api";
import "../components/style/map.css";
import { contaminants, stations, shapes } from '../data/air_quality';

import { ArrowSmallUpIcon, CursorArrowRippleIcon, IdentificationIcon } from '@heroicons/react/24/solid'
import NanPercent from './NanPercent';

export default function Map({setStat, setVar}) {
  const [selectedOption, setSelectedOption] = useState(contaminants[0]);
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
    googleMapsApiKey: "AIzaSyChCjtUY6hDi0pU-Ja4fqxfDgCRynD_VNc",
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

  const getShape = (cont_len, total) => {
    if (cont_len <= 0.3 * total)
      return 'M 0,0 l -5,8 l 10,0 z' // triangle
    if (cont_len > 0.3 * total && cont_len <= 0.6 * total)
      return 'M -5,-5 l 10,0 l 0,10 l -10,0 z' // square
    else
      return 'M 0,0 m -5,0 a 5,5 0 1,0 10,0 a 5,5 0 1,0 -10,0' //circle
  }
 
  const circleIcon = (number, cont_len, total) => ({
    path: getShape(cont_len, total),
    fillColor: getFillColor(number),
    fillOpacity: 1,
    strokeWeight: 2,
    scale: 2,
  }); 

  const spacing = ""

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
            {contaminants.map((option) => (
              <option key={option.value} value={option.value}>
                {option.value}
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
        {isLoaded && stations.map(({ id, elevation, lat, lng, contaminantes, name, num_cont }) => {
          const contaminant = contaminantes.find(
            (contaminante) => contaminante.name === selectedOption
          );
          const percentNull = contaminant?.percent_null ?? 100.00;

          return (
            <Marker
              key={id}
              position={{ lat, lng }}
              icon={circleIcon(percentNull, num_cont, contaminantes.length)}
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
