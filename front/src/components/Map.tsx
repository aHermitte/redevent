import {
  useMapEvents,
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";

const Map = () => {
  const LocationFinder = () => {
    const [position, setPosition] = useState({ lat: 51.505, lng: -0.09 });
    useMapEvents({
      click: (e) => {
        setPosition(e.latlng);
      },
    });
    return (
      <Marker position={position}>
        <Popup>
          Latitude: {position.lat}, Longitude: {position.lng}
        </Popup>
      </Marker>
    );
  };

  return (
    <div>
      <MapContainer
        center={[44.84, -0.578]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: 300, width: 800 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationFinder />
      </MapContainer>
    </div>
  );
};

export default Map;
