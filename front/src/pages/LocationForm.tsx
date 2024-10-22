import { Grid2, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Map from "../components/Map";

const LocationForm = () => {
  return (
    <Grid2 container spacing={2} direction={"column"}>
      <Grid2>
        <Typography variant="h4">Location</Typography>
      </Grid2>
      <Grid2>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label="Basic date picker" />
        </LocalizationProvider>
      </Grid2>
      <Grid2>
        <Typography variant="h5">Map</Typography>
        <Map />
      </Grid2>
    </Grid2>
  );
};

export default LocationForm;
