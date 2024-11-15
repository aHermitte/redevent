import {
  useMapEvents,
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import { LatLng } from "leaflet";

interface MapProps {
  onPositionChange?: (position: LatLng) => void;
}

const Map = ({onPositionChange} : MapProps) => {
  const LocationFinder = ({ position, setPosition } : {
    position: LatLng;
    setPosition: (position: LatLng) => void;
  }) => {
  // Listen to map click events and update the position
  useMapEvents({
    click: (e) => {
      setPosition(e.latlng);
    },
  });

  // Render the marker at the current position
  return (
    <Marker position={position}>
      <Popup>
        Latitude: {position.lat}, Longitude: {position.lng}
      </Popup>
    </Marker>
  );
};
  const [position, setPosition] = useState(new LatLng(44.84, -0.578));

  const handlePositionChange = (newPosition: LatLng) => {
    setPosition(newPosition);
    if (onPositionChange) {
      onPositionChange(newPosition);
    }
  };

  const tileUrl = "https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=6e5478c8a4f54c779f85573c0e399391";

  return (
    <div>
      <MapContainer
        center={[44.84, -0.578]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: 300, width: 800 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy;<a href="https://www.thunderforest.com"> ThunderForest</a>'
          url={tileUrl}
        />
        <LocationFinder position={position} setPosition={handlePositionChange}/>
      </MapContainer>
    </div>
  );
};

export default Map;
