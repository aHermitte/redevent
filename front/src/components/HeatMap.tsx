// components/HeatMap.tsx
import { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";
import { LatLng, type HeatLatLngTuple } from "leaflet";
import Map from "./Map";

interface HeatMapProps {
  center: [number, number];
  zoom: number;
  heatmapData: HeatLatLngTuple[];
  heatmapOptions?: L.HeatMapOptions;
}

function HeatmapLayer({
  data,
  options,
}: {
  data: HeatLatLngTuple[];
  options?: L.HeatMapOptions;
}) {
  const map = useMap();

  useEffect(() => {
    if (data?.length > 0) {
      // @ts-ignore - Leaflet heat plugin extension
      const heat = L.heatLayer(data, options);
      map.addLayer(heat);

      return () => {
        map.removeLayer(heat);
      };
    }
  }, [data, map, options]);

  return null;
}

const HeatMap = ({
  center,
  zoom,
  heatmapData,
  heatmapOptions,
}: HeatMapProps) => {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%", borderRadius: 8 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <HeatmapLayer
          data={heatmapData}
          options={
            heatmapOptions || {
              radius: 25,
              blur: 15,
              maxZoom: 15,
              minOpacity: 0.1,
              gradient: {
                0.1: "blue",
                0.3: "cyan",
                0.5: "lime",
                0.7: "yellow",
                1.0: "red",
              },
            }
          }
        />
      </MapContainer>
    </div>
  );
};

export default HeatMap;
