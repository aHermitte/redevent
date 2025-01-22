import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import {
  DatePicker,
  TimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Grid from "@mui/material/Grid";
import Map from "../components/Map";
import { useState } from "react";
import { Dayjs } from "dayjs";
import { LatLng } from "leaflet";

const LocationForm = () => {
  const [position, setPosition] = useState(new LatLng(51.505, -0.09));
  const [date, setDate] = useState<Dayjs | null>(null);
  const [time, setTime] = useState<Dayjs | null>(null);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [confidence, setConfidence] = useState<number>(95);

  const [errors, setErrors] = useState({
    date: "",
    time: "",
    confidence: "",
  });

  const validateFields = () => {
    const newErrors = { date: "", time: "", confidence: "" };
    let isValid = true;

    if (!date) {
      newErrors.date = "Date is required";
      isValid = false;
    }

    if (!time) {
      newErrors.time = "Time is required";
      isValid = false;
    }

    if (confidence < 0 || confidence > 100) {
      newErrors.confidence = "Confidence must be between 0 and 100";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const sendDatatoBack = async (
    position: LatLng,
    date: Dayjs | null,
    time: Dayjs | null
  ) => {
    const data = {
      position: {
        latitude: position.lat,
        longitude: position.lng,
      },
      date: date?.format("YYYY-MM-DD"),
      time: time?.format("HH:mm"),
      confidence: confidence / 100,
    };
    try {
      console.log(data);
      const response = await fetch("http://127.0.0.1:5000/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("Data sent successfully");
        response.json().then((data) => {
          console.log("Data received");
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
    document.getElementById(
      "position_result"
    )!.innerText = `Latitude: ${result.input[0].latitude}, Longitude: ${result.input[0].longitude}`;
    document.getElementById("probability_result")!.innerText =
      result.proba[0].prob_accident;
  };

  const handleSubmit = () => {
    if (validateFields()) {
      sendDatatoBack(position, date, time);
    }
  };

  return (
    <Grid
      container
      gap={5}
      flexDirection={"row"}
      sx={{
        padding: 2,
        backgroundColor: "background.paper",
        borderRadius: 2,
      }}
    >
      <Grid
        item
        xs={7}
        sx={{
          padding: 2,
          borderRadius: 2,
          boxShadow: 3, // Adding shadow to the first grid
          backgroundColor: "background.paper",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            marginBottom: 2,
            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)", // Subtle shadow for the title
          }}
        >
          Location
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Select date"
            value={date}
            onChange={(newDate) => setDate(newDate)}
            slotProps={{
              textField: {
                error: !!errors.date,
                helperText: errors.date,
              },
            }}
          />
          <TimePicker
            label="Select time"
            ampm={false}
            value={time}
            onChange={(newTime) => setTime(newTime)}
            slotProps={{
              textField: {
                error: !!errors.time,
                helperText: errors.time,
              },
            }}
          />
          <TextField
            name="confidence"
            label="Confidence index"
            value={confidence}
            onChange={(event) => setConfidence(Number(event.target.value))}
            type="number"
            fullWidth
            margin="normal"
            error={!!errors.confidence}
            helperText={errors.confidence}
          />
        </LocalizationProvider>
        <Typography variant="h5" sx={{ mt: 2 }}>
          Map
        </Typography>
        <Map onPositionChange={setPosition} markedPositions={[]} />
        <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
          Compute probability
        </Button>
      </Grid>
      <Grid
        item
        xs={4}
        sx={{
          padding: 2,
          borderRadius: 2,
          boxShadow: 3, // Adding shadow to the second grid
          backgroundColor: "background.default",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Results
        </Typography>

        {["Date", "Time", "Position", "Probability"].map((label) => (
          <Card
            key={label}
            variant="outlined"
            sx={{
              mb: 2,
              backgroundColor: "background.paper",
              borderRadius: 2,
            }}
          >
            <CardContent>
              <Typography variant="h6" component="div">
                {label}
              </Typography>
              <Typography
                id={`${label.toLowerCase()}_result`}
                color="text.secondary"
              >
                {/* Result content will be inserted here */}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Grid>
    </Grid>
  );
};

export default LocationForm;
