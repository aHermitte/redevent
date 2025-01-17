import { Button, Grid2, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { TimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Map from "../components/Map";
import { useState } from "react";
import { Dayjs } from "dayjs";
import { LatLng } from "leaflet";

const LocationForm = () => {
  const [position, setPosition] = useState(new LatLng(51.505, -0.09));
  const [date, setDate] = useState<Dayjs | null>(null);
  const [time, setTime] = useState<Dayjs | null>(null);
  const [incidents, setIncidents] = useState<any>([]);

  const sendDatatoBack = async (
    position: LatLng,
    date: Dayjs | null,
    time: Dayjs | null,
  ) => {
    const data = {
      position: {
        latitude: position.lat,
        longitude: position.lng,
      },
      date: date?.format("YYYY-MM-DD"),
      time: time?.format("HH:mm"),
    };
    try {
      console.log(data);
      const response = await fetch("http://127.0.0.1:5000/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        // TODO: Use and display received data
      });

      if (response.ok) {
        alert("Data sent successfully");
        response.json().then((data) => {
          console.log(data);
          handleResult(data);
          setIncidents(data.incidents);
        });
      } else {
        const errMsg = await response.text();
        console.log(errMsg);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleResult = async (result: any) => {
    document.getElementById("time_result")!.innerText = result.input[0].time;
    document.getElementById("date_result")!.innerText = result.input[0].date;
    document.getElementById("position_result")!.innerText = `Latitude: ${result.input[0].latitude}, Longitude: ${result.input[0].longitude}`;
    document.getElementById("probability_result")!.innerText = result.proba[0].prob_accident;
  };

  return (
    <Grid2 container direction={"row"}>
      <Grid2 container spacing={2} direction={"column"}>
        <Grid2>
          <Typography variant="h4">Location</Typography>
        </Grid2>
        <Grid2>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Basic date picker"
              value={date}
              onChange={(newDate) => setDate(newDate)}
            />
            <TimePicker
              label="Basic time picker"
              ampm={false}
              value={time}
              onChange={(newTime) => setTime(newTime)}
            />
          </LocalizationProvider>
        </Grid2>
        <Grid2>
          <Typography variant="h5">Map</Typography>
          <Map onPositionChange={setPosition} markedPositions={incidents} />
          <Button
            variant="contained"
            onClick={() => {
              sendDatatoBack(position, date, time);
            }}
          >
            Send data to back
          </Button>
        </Grid2>
      </Grid2>
      <Grid2>
        <Typography variant="h4">Results</Typography>
        <Typography variant="h5">Parameters</Typography>
        <p id="date_result"></p>
        <p id="time_result"></p>
        <p id="position_result"></p>
        <Typography variant="h5">Probability</Typography>
        <p id="probability_result"></p>

      </Grid2>
    </Grid2>
  );
};

export default LocationForm;
