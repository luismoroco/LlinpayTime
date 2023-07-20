import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import * as shp from 'shapefile'; 
import 'leaflet/dist/leaflet.css'; 

const Map = () => {
    const [shapeData, setShapeData] = useState(null);
  
    useEffect(() => {
      async function fetchShapeFile() {
        const response = await fetch();
        const arrayBuffer = await response.arrayBuffer();
        const geoJsonData = await shp.parseZip(arrayBuffer);
        setShapeData(geoJsonData);
      }
  
      fetchShapeFile();
    }, []);
  
    return (
      <div>
        {shapeData && (
          <MapContainer center={[400, 400]} zoom={5}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <GeoJSON data={shapeData} />
          </MapContainer>
        )}
      </div>
    );
};

export { Map };