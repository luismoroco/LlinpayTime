import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet';

const Map = () => {
  const center = [40.416775, -3.70379]; // Coordenadas de Madrid

  const mapContainerStyle = {
    height: '500px',
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    border: '2px solid #000', // Establece el estilo del borde del contenedor del mapa
    margin: '20px', // Establece el margen del contorno
  };

  const maxBounds = [
    [40.35, -3.95], // Coordenadas del límite inferior izquierdo
    [40.55, -3.45], // Coordenadas del límite superior derecho
  ];

  const stations = [
    { name: 'Estación 1', lat: 40.416, lng: -3.703 },
    { name: 'Estación 2', lat: 40.420, lng: -3.710 },
    { name: 'Estación 3', lat: 40.412, lng: -3.695 },
    // Agrega más estaciones con sus coordenadas
  ];

  return (
    <div style={mapContainerStyle}>
      <MapContainer center={center} zoom={12} maxBounds={maxBounds} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Agrega los círculos para las estaciones */}
        {stations.map(station => (
          <CircleMarker
            key={station.name}
            center={[station.lat, station.lng]}
            radius={5}
            color="blue"
            fillColor="blue"
            fillOpacity={1}
          />
        ))}
      </MapContainer>
    </div>
  );
}

export  {Map};