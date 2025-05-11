import { HedgehogForm } from "./HedgehogForm";
import { HedgehogInfo } from "./HedgehogInfo";
import HedgeHogList from "./HedgehogList";
import { Map } from "./Map";
import { Box, Paper, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { Hedgehog } from "@shared/hedgehog";
import { Feature, Geometry, GeoJsonProperties } from 'geojson';

export function App() {
  // Latest coordinates from the Map click event
  const [coordinates, setCoordinates] = useState<number[]>();
  // ID of the currently selected hedgehog
  const [selectedHedgehogId, setSelectedHedgehogId] = useState<number | null>(
    null
  );
  // Selected hedgehog for map display
  const [selectedHedgehog, setSelectedHedgehog] = useState<Hedgehog | null>(null);
  // A state to track when the list should refresh
  const [listRefreshTrigger, setListRefreshTrigger] = useState(0);

  const handleHedgehogAdded = () => {
    // Increment to trigger a refresh
    setListRefreshTrigger(prev => prev + 1);
  };

  // Fetch the selected hedgehog data when ID changes
  useEffect(() => {
    if (!selectedHedgehogId) {
      setSelectedHedgehog(null);
      return;
    }

    const fetchHedgehog = async () => {
      try {
        const response = await fetch(`/api/v1/hedgehog/${selectedHedgehogId}`);
        if (!response.ok) return;

        const data = await response.json();
        setSelectedHedgehog(data.hedgehog);
      } catch (error) {
        console.error("Error fetching hedgehog:", error);
      }
    };

    fetchHedgehog();
  }, [selectedHedgehogId]);

  // Convert hedgehog to GeoJSON feature
  const mapFeatures: Feature<Geometry, GeoJsonProperties>[] = selectedHedgehog
    ? [
        {
          type: "Feature",
          geometry: selectedHedgehog.location,
          properties: {
            id: selectedHedgehog.id,
            name: selectedHedgehog.name,
            age: selectedHedgehog.age,
            gender: selectedHedgehog.gender,
          },
        },
      ]
    : [];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#00B2A0",
          height: "40px",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography sx={{ color: "white" }} variant="overline">
          Siilit kartalla
        </Typography>
      </Box>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "grid",
          gridAutoColumns: "1fr 1.5fr 2fr",
          gridAutoFlow: "column",
          overflow: "hidden",
        }}
      >
        <HedgeHogList
          onSelectHedgehog={setSelectedHedgehogId}
          selectedHedgehogId={selectedHedgehogId}
          refreshTrigger={listRefreshTrigger}
        />
        <Box>
          <HedgehogInfo hedgehogId={selectedHedgehogId} />
          <HedgehogForm
            coordinates={coordinates || []}
            onHedgehogAdded={handleHedgehogAdded}
          />
        </Box>
        <Paper elevation={3} sx={{ margin: "1em" }}>
          <Map
            onMapClick={(coordinates) => setCoordinates(coordinates)}
            features={mapFeatures}
          />
        </Paper>
      </Box>
      <Box
        sx={{
          backgroundColor: "#00B2A0",
          height: "40px",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {" "}
        <Typography sx={{ color: "white" }} variant="overline">
          Powered by Ubigu Oy
        </Typography>
      </Box>
    </Box>
  );
}
