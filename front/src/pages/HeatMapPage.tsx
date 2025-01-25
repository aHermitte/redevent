// pages/HeatMapPage.tsx
import { useState, useEffect } from "react";
import { Card, LinearProgress, Typography, Box } from "@mui/material";
import HeatMap from "../components/HeatMap";
import { LatLng, latLng } from "leaflet";

const HeatMapPage = () => {
  const [heatmapData, setHeatmapData] = useState<[number, number, number][]>(
    []
  );
  const [loading, setLoading] = useState(true);

  // Bordeaux coordinates bounding box
  const BORDEAUX_BOUNDS = {
    minLat: 44.81,
    maxLat: 44.92,
    minLng: -0.63,
    maxLng: -0.51,
  };

  const generateGridPoints = (steps = 15) => {
    const points: LatLng[] = [];
    const latStep = (BORDEAUX_BOUNDS.maxLat - BORDEAUX_BOUNDS.minLat) / steps;
    const lngStep = (BORDEAUX_BOUNDS.maxLng - BORDEAUX_BOUNDS.minLng) / steps;

    for (
      let lat = BORDEAUX_BOUNDS.minLat;
      lat <= BORDEAUX_BOUNDS.maxLat;
      lat += latStep
    ) {
      for (
        let lng = BORDEAUX_BOUNDS.minLng;
        lng <= BORDEAUX_BOUNDS.maxLng;
        lng += lngStep
      ) {
        points.push(latLng(lat, lng));
      }
    }
    return points;
  };

  const fetchRiskData = async (lat: number, lng: number) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          position: { latitude: lat, longitude: lng },
          date: "2025-01-28",
          time: "12:00",
          confidence: 0.95,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.proba[0].prob_accident;
      }
      return 0;
    } catch (err) {
      console.error("Error fetching risk data:", err);
      return 0;
    }
  };

  useEffect(() => {
    const loadHeatmapData = async () => {
      try {
        setLoading(true);
        const gridPoints = generateGridPoints();
        const results = await Promise.all(
          gridPoints.map(async (point) => [
            point.lat,
            point.lng,
            await fetchRiskData(point.lat, point.lng),
          ])
        );

        setHeatmapData(results.filter((p) => p[2] > 0));
      } finally {
        setLoading(false);
      }
    };

    loadHeatmapData();
  }, []);

  return (
    <Box sx={{ p: 3, height: "100vh" }}>
      <Card sx={{ borderRadius: 3, boxShadow: 3, height: "100%" }}>
        <Box sx={{ p: 3, height: "100%", position: "relative" }}>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
            Bordeaux Risk Heatmap
          </Typography>

          {loading && (
            <Box
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                zIndex: 1000,
                width: 200,
              }}
            >
              <Typography variant="body2" sx={{ mb: 1 }}>
                Loading heatmap data...
              </Typography>
              <LinearProgress />
            </Box>
          )}

          <HeatMap
            center={[44.8378, -0.5792]}
            zoom={12}
            heatmapData={heatmapData.map(([lat, lng, intensity]) => [
              lat,
              lng,
              intensity * 1000,
            ])}
          />

          <Box
            sx={{
              position: "absolute",
              bottom: 32,
              left: 32,
              zIndex: 1000,
              bgcolor: "background.paper",
              p: 2,
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <Typography variant="body2" sx={{ mb: 1 }}>
              Risk Intensity Legend:
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {["Low", "Medium", "High"].map((label, i) => (
                <Box
                  key={label}
                  sx={{ display: "flex", alignItems: "center", mr: 2 }}
                >
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      bgcolor: i === 0 ? "blue" : i === 1 ? "yellow" : "red",
                      mr: 1,
                      borderRadius: 1,
                    }}
                  />
                  <Typography variant="caption">{label}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default HeatMapPage;
