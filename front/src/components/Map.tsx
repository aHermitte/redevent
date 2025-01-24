import {
  useMapEvents,
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import { Icon, LatLng } from "leaflet";

interface MapProps {
  onPositionChange: (position: LatLng) => void;
  history: any[];
  onHistorySelect: (req: any) => void;
}

const Map = ({ onPositionChange, history, onHistorySelect}: MapProps) => {
  const LocationFinder = ({
    position,
    setPosition,
  }: {
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
      <Marker position={position} >
        <Popup>
          Latitude: {position.lat}, Longitude: {position.lng}
        </Popup>
      </Marker>
    );
  };

  const isEmptyObject = (obj: object): boolean => {
    return Object.keys(obj).length === 0;
};

  const MarkedPositions = ({ history }: { history: any[] }) => {
    const h = history || []; // Default to an empty array if null or undefined
    console.log(h);

    // Generate markers and render them as part of the component
    return (
      <>
        {h.map((incident, index) =>{
          if (isEmptyObject(incident)) return;
          console.log("position: " + incident.position)

          const lat = parseFloat(incident.position.split(',')[0]);
          const lon = parseFloat(incident.position.split(',')[1]);
          const pos = new LatLng(lat, lon);
          return (
            <Marker position={pos} key={index} icon={greenIcon} eventHandlers={{click: () => {
              console.log("Diplaying result: ", incident)
              onHistorySelect(incident)
              },}}>
              <Popup>{"Click to see more"}</Popup>
            </Marker>
          );
        })}
      </>
    );
  };

  const [position, setPosition] = useState(new LatLng(44.84, -0.578));

  const handlePositionChange = (newPosition: LatLng) => {
    setPosition(newPosition);
    if (onPositionChange) {
      onPositionChange(newPosition);
    }
  };

  var greenIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

  const tileUrl =
    "https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=6e5478c8a4f54c779f85573c0e399391";

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
        <MarkedPositions history={history? history : []} />
        <LocationFinder
          position={position}
          setPosition={handlePositionChange}
        />
      </MapContainer>
    </div>
  );
};

export default Map;
