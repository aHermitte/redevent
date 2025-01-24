import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
  LinearProgress,
} from "@mui/material";
import {
  DatePicker,
  TimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Map from "../components/Map";
import { useState } from "react";
import { Dayjs } from "dayjs";
import { LatLng } from "leaflet";

interface ForecastResult {
  date: string;
  probability: string;
  riskLevel: "low" | "medium" | "high";
  ciLower: string;
  ciUpper: string;
}

const LocationForm = () => {
  const [position, setPosition] = useState(new LatLng(51.505, -0.09));
  const [date, setDate] = useState<Dayjs | null>(null);
  const [time, setTime] = useState<Dayjs | null>(null);
  const [confidence, setConfidence] = useState<number>(95);
  const [results, setResults] = useState<{
    date?: string;
    time?: string;
    position?: string;
    probability?: string;
  }>({});
  const [resultsHistory, setResultsHistory] = useState<{
    date?: string;
    time?: string;
    position?: string;
    probability?: string;
  }[]>([{}]);
  const [forecastResults, setForecastResults] = useState<ForecastResult[]>([]);
  const [loading, setLoading] = useState(false);
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

  const formatProbability = (value: number) => {
    const percentage = value * 100;
    return `${percentage.toFixed(4)}%`;
  };

  const getRiskLevel = (probability: number) => {
    if (probability < 0.0001) return "low"; // < 0.01%
    if (probability < 0.001) return "medium"; // < 0.1%
    return "high"; // >= 0.1%
  };

  const fetchPrediction = async (date: Dayjs, time: Dayjs) => {
    const data = {
      position: {
        latitude: position.lat,
        longitude: position.lng,
      },
      date: date.format("YYYY-MM-DD"),
      time: time.format("HH:mm"),
      confidence: confidence / 100,
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const resultData = await response.json();
        const prob = resultData.proba[0].prob_accident;
        return {
          date: date.format("MMM D"),
          probability: formatProbability(prob),
          riskLevel: getRiskLevel(prob),
          ciLower: formatProbability(resultData.proba[0].ci_lower),
          ciUpper: formatProbability(resultData.proba[0].ci_upper),
        };
      }
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!validateFields() || !date || !time) return;
    setLoading(true);

    try {
      const dates = Array.from({ length: 5 }, (_, i) => date.add(i, "day"));
      const predictions = await Promise.all(
        dates.map((d) => fetchPrediction(d, time))
      );
      const validPredictions = predictions.filter(Boolean) as ForecastResult[];

      if (validPredictions.length > 0) {
        const [first] = validPredictions;
        setResults({
          date: date.format("ddd, MMM D, YYYY"),
          time: time.format("HH:mm"),
          position: `${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`,
          probability: first.probability,
        });
        setResultsHistory((prevResultsHistory) => [...prevResultsHistory, results]);
      }

      setForecastResults(validPredictions);
    } finally {
      setLoading(false);
    }
  };

  const RiskIndicator = ({
    level,
    ciLower,
    ciUpper,
  }: {
    level: "low" | "medium" | "high";
    ciLower: string;
    ciUpper: string;
  }) => {
    const maxValue = 0.001; // 0.1% for full scale
    const upperValue = parseFloat(ciUpper.replace("%", ""));
    const scaledValue = (upperValue / maxValue) * 100;

    return (
      <Box sx={{ width: "100%", mt: 1 }}>
        <LinearProgress
          variant="determinate"
          value={scaledValue}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: "action.disabledBackground",
            "& .MuiLinearProgress-bar": {
              backgroundColor: (theme) =>
                level === "high"
                  ? theme.palette.error.main
                  : level === "medium"
                  ? theme.palette.warning.main
                  : theme.palette.success.main,
            },
          }}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
          <Typography variant="caption" color="text.secondary">
            95% CI: {ciLower} - {ciUpper}
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1400, margin: "0 auto" }}>
      <Grid container spacing={3}>
        {/* Input Section */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                Location Risk Analysis
              </Typography>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      label="Select Date"
                      value={date}
                      onChange={setDate}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.date,
                          helperText: errors.date,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TimePicker
                      label="Select Time"
                      value={time}
                      onChange={setTime}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.time,
                          helperText: errors.time,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Confidence Level (%)"
                      variant="outlined"
                      type="number"
                      value={confidence}
                      onChange={(e) => setConfidence(Number(e.target.value))}
                      error={!!errors.confidence}
                      helperText={errors.confidence}
                      fullWidth
                      InputProps={{ inputProps: { min: 0, max: 100 } }}
                    />
                  </Grid>
                </Grid>
              </LocalizationProvider>

              <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 500 }}>
                Select Location on Map
              </Typography>
              <Map
                onPositionChange={setPosition}
                history={resultsHistory}
                onHistorySelect={setResults}
              />

              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleSubmit}
                disabled={loading}
                sx={{ mt: 3, py: 1.5, fontWeight: 600 }}
              >
                {loading ? "Calculating..." : "Analyze Risk"}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Current Results */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 3, height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                Current Assessment
              </Typography>

              {Object.entries(results).map(([label, value]) => (
                <Box key={label} sx={{ mb: 2.5 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {label.toUpperCase()}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 500,
                      color:
                        label === "probability" ? "error.main" : "text.primary",
                    }}
                  >
                    {value || "-"}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* 5-Day Forecast */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3, boxShadow: 3, mt: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                5-Day Risk Forecast
              </Typography>

              <Grid container spacing={2}>
                {forecastResults.map(
                  ({ date, probability, riskLevel, ciLower, ciUpper }) => (
                    <Grid item xs={12} sm={6} md={4} lg={2.4} key={date}>
                      <Card
                        sx={{
                          borderRadius: 2,
                          borderLeft: (theme) =>
                            `4px solid ${
                              riskLevel === "high"
                                ? theme.palette.error.main
                                : riskLevel === "medium"
                                ? theme.palette.warning.main
                                : theme.palette.success.main
                            }`,
                        }}
                      >
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight={500}>
                            {date}
                          </Typography>
                          <Chip
                            label={probability}
                            size="small"
                            sx={{
                              bgcolor: (theme) =>
                                riskLevel === "high"
                                  ? theme.palette.error.light
                                  : riskLevel === "medium"
                                  ? theme.palette.warning.light
                                  : theme.palette.success.light,
                              color: "common.white",
                              mt: 1,
                              fontWeight: 600,
                            }}
                          />
                          <RiskIndicator
                            level={riskLevel}
                            ciLower={ciLower}
                            ciUpper={ciUpper}
                          />
                        </CardContent>
                      </Card>
                    </Grid>
                  )
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LocationForm;
