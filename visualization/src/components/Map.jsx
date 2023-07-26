import React, { useMemo } from 'react';
import Title from './Title';
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import "../components/style/map.css";

export default function Map() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyChCjtUY6hDi0pU-Ja4fqxfDgCRynD_VNc",
  });
  const center = useMemo(() => ({ lat: 18.52043, lng: 73.856743 }), []);

  return (
    <>
      <Title
        title={'Stations'}
        style={'text-2xl'}
      />
      <GoogleMap
        mapContainerClassName="map-container"
        center={center}
        zoom={15}
        mapContainerStyle={{ width: '100%', height: '100%' }}
        options={{
          zoomControl: false
        }}
      >
        <Marker position={{ lat: 18.52043, lng: 73.856743 }} />
      </GoogleMap>
    </>
  )
}
